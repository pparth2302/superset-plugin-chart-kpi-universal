/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { ChartProps } from '@superset-ui/core';
import type { QueryFormData, TimeseriesDataRecord } from '@superset-ui/core';
import {
  DEFAULT_BORDER_RADIUS,
  DEFAULT_CARD_PADDING,
  DEFAULT_DECIMAL_PRECISION,
  DEFAULT_DURATION_UNIT,
  DEFAULT_KPI_AGGREGATION_MODE,
  DEFAULT_KPI_SOURCE_MODE,
  DEFAULT_KPI_VALUE_FONT_SIZE,
  DEFAULT_NO_DATA_MESSAGE,
  DEFAULT_SPARKLINE_FILL_OPACITY,
  DEFAULT_SPARKLINE_LINE_WIDTH,
  DEFAULT_TITLE_FONT_SIZE,
  DEFAULT_TREND_CALCULATION_MODE,
  DEFAULT_TREND_FONT_SIZE,
  DEFAULT_TREND_MEANING,
  DEFAULT_VALUE_COLUMN_WIDTH_PERCENT,
} from '../constants';
import type {
  KpiUniversalChartFormData,
  KpiUniversalChartProps,
  KpiValueResult,
} from '../types';
import {
  aggregateSparklineValue,
  buildSparklineData,
  computeTrendResult,
  findRecordValue,
  formatMetricValue,
  getColumnLabel,
  getFirstMetricRawValue,
  getLatestNumericSparklineDatum,
  getMetricLabelSafe,
  getPrimaryMetric,
  hasMeaningfulValue,
  parseBoundedNumber,
  parsePositiveInteger,
  resolveTimeField,
  resolveValueType,
  toNumericMetricValue,
} from '../utils';

function hasDisplayableValue(candidate: {
  rawValue: unknown;
  numericValue: number | null;
}): boolean {
  return hasMeaningfulValue(candidate.rawValue) || candidate.numericValue !== null;
}

function selectKpiValue(
  preferred: KpiValueResult,
  fallback: KpiValueResult,
): KpiValueResult {
  return hasDisplayableValue(preferred) ? preferred : fallback;
}

export default function transformProps(chartProps: ChartProps): KpiUniversalChartProps {
  const { width, height, queriesData, formData, theme } = chartProps;
  const rawFormData =
    ((chartProps as unknown as { rawFormData?: QueryFormData }).rawFormData as
      | KpiUniversalChartFormData
      | undefined) || (formData as KpiUniversalChartFormData);
  const primaryMetric = getPrimaryMetric(rawFormData.metrics, rawFormData.metric);

  if (!primaryMetric) {
    throw new Error('Universal KPI Card requires a primary metric.');
  }

  const primaryMetricLabel = getMetricLabelSafe(primaryMetric);
  const secondaryMetricLabel = rawFormData.secondary_metric
    ? getMetricLabelSafe(rawFormData.secondary_metric)
    : undefined;
  const aggregateRows = (queriesData[0]?.data || []) as TimeseriesDataRecord[];
  const timeseriesRows = (queriesData[1]?.data || []) as TimeseriesDataRecord[];
  const aggregateRow = aggregateRows[0];
  const configuredTimeLabel = getColumnLabel(
    rawFormData.granularity_sqla ?? rawFormData.granularity,
  );
  const durationUnit = rawFormData.duration_unit ?? DEFAULT_DURATION_UNIT;
  const decimalPrecision = parsePositiveInteger(
    rawFormData.decimal_precision,
    DEFAULT_DECIMAL_PRECISION,
    { min: 0, max: 8 },
  );
  const numberFormat = rawFormData.number_format?.trim() || 'SMART_NUMBER';
  const valuePrefix = rawFormData.value_prefix?.trim() || '';
  const valueSuffix = rawFormData.value_suffix?.trim() || '';
  const kpiAggregationMode =
    rawFormData.kpi_aggregation_mode ?? DEFAULT_KPI_AGGREGATION_MODE;
  const kpiSourceMode = rawFormData.kpi_source_mode ?? DEFAULT_KPI_SOURCE_MODE;
  const showSparkline = rawFormData.show_sparkline ?? true;
  const enableTrend = rawFormData.enable_trend ?? true;
  const trendCalculationMode =
    rawFormData.trend_calculation_mode ?? DEFAULT_TREND_CALCULATION_MODE;
  const warnings: string[] = [];

  const rawAggregatePrimaryValue = aggregateRow
    ? findRecordValue(aggregateRow, primaryMetricLabel, {
        allowSingleNumericFallback: !secondaryMetricLabel,
      })
    : undefined;
  const rawTimeseriesPrimaryValue = getFirstMetricRawValue(
    timeseriesRows,
    primaryMetricLabel,
    configuredTimeLabel ? [configuredTimeLabel, '__timestamp'] : ['__timestamp'],
  );
  const primaryValueType = resolveValueType(rawFormData.value_type_mode, {
    metricLabel: primaryMetricLabel,
    rawValue: rawAggregatePrimaryValue ?? rawTimeseriesPrimaryValue,
    valueSuffix,
  });
  const timeField = resolveTimeField(timeseriesRows, configuredTimeLabel);

  const sparklineResult = timeField
    ? buildSparklineData(timeseriesRows, {
        metricLabel: primaryMetricLabel,
        timeField,
        valueType: primaryValueType,
        durationUnit,
      })
    : { data: [], invalidTimestampRows: 0 };

  if (timeseriesRows.length && !timeField) {
    warnings.push(
      'The time-series query returned rows, but no usable timestamp field could be resolved for the sparkline.',
    );
  }

  if (sparklineResult.invalidTimestampRows > 0) {
    warnings.push(
      `${sparklineResult.invalidTimestampRows} sparkline row(s) were skipped because the timestamp field was missing or invalid.`,
    );
  }

  const aggregatePrimaryNumericValue = toNumericMetricValue(
    rawAggregatePrimaryValue,
    primaryValueType,
    durationUnit,
  );
  const timeseriesNumericValue = aggregateSparklineValue(
    sparklineResult.data,
    kpiAggregationMode,
  );
  const latestSparklineDatum = getLatestNumericSparklineDatum(sparklineResult.data);

  const aggregateCandidate: KpiValueResult = {
    source: 'aggregate',
    aggregationMode: 'latest',
    rawValue: rawAggregatePrimaryValue,
    numericValue: aggregatePrimaryNumericValue,
    formattedValue: '--',
  };
  const timeseriesCandidate: KpiValueResult = {
    source: 'time_series',
    aggregationMode: kpiAggregationMode,
    rawValue:
      kpiAggregationMode === 'latest'
        ? latestSparklineDatum?.rawValue ?? timeseriesNumericValue
        : timeseriesNumericValue,
    numericValue: timeseriesNumericValue,
    formattedValue: '--',
  };
  const selectedValue = selectKpiValue(
    kpiSourceMode === 'time_series' ? timeseriesCandidate : aggregateCandidate,
    kpiSourceMode === 'time_series' ? aggregateCandidate : timeseriesCandidate,
  );
  const formattedValue = hasDisplayableValue(selectedValue)
    ? formatMetricValue(selectedValue.rawValue ?? selectedValue.numericValue, {
        valueType: primaryValueType,
        numberFormat,
        decimalPrecision,
        durationUnit,
        prefix: valuePrefix,
        suffix: valueSuffix,
      })
    : '--';

  const rawSecondaryValue =
    aggregateRow && secondaryMetricLabel
      ? findRecordValue(aggregateRow, secondaryMetricLabel, {
          allowSingleNumericFallback: false,
        })
      : undefined;
  const secondaryValueType = resolveValueType(rawFormData.value_type_mode, {
    metricLabel: secondaryMetricLabel,
    rawValue: rawSecondaryValue,
  });
  const secondaryNumericValue = toNumericMetricValue(
    rawSecondaryValue,
    secondaryValueType,
    durationUnit,
  );

  if (trendCalculationMode === 'secondary_metric' && !secondaryMetricLabel) {
    warnings.push(
      'Trend calculation mode is set to secondary metric, but no secondary metric is configured.',
    );
  }

  const trend = enableTrend
    ? computeTrendResult({
        mode: trendCalculationMode,
        sparklineData: sparklineResult.data,
        secondaryValue: rawSecondaryValue,
        secondaryNumericValue,
        trendMeaning: rawFormData.trend_meaning ?? DEFAULT_TREND_MEANING,
        neutralThreshold: parseBoundedNumber(rawFormData.neutral_threshold, 0, {
          min: 0,
        }),
        labelPrefix: rawFormData.trend_label_prefix,
        showTrendLabel: rawFormData.show_trend_label,
        showPositivePlusSign: rawFormData.show_positive_plus_sign ?? true,
        decimalPrecision,
        numberFormat,
        durationUnit,
        valueType:
          trendCalculationMode === 'secondary_metric'
            ? secondaryValueType
            : primaryValueType,
      })
    : undefined;

  const noData = !hasDisplayableValue(selectedValue);
  if (noData) {
    warnings.push(
      'No KPI value could be derived from the current query results and control selections.',
    );
  }

  return {
    width,
    height,
    theme,
    title: rawFormData.card_title_override?.trim() || primaryMetricLabel,
    showTitle: rawFormData.show_title ?? true,
    showInfoIcon: rawFormData.show_info_icon ?? false,
    infoTooltipText: rawFormData.info_tooltip_text?.trim() || undefined,
    primaryMetricLabel,
    secondaryMetricLabel,
    formattedValue,
    rawValue: selectedValue.rawValue,
    valueSource: selectedValue.source,
    resolvedValueType: primaryValueType,
    showTrend: enableTrend,
    trend,
    showSparkline,
    sparklineData: sparklineResult.data,
    sparklineType: rawFormData.sparkline_type ?? 'area',
    sparklineSmooth: rawFormData.sparkline_smooth ?? true,
    sparklineFillOpacity: parseBoundedNumber(
      rawFormData.sparkline_fill_opacity,
      DEFAULT_SPARKLINE_FILL_OPACITY,
      { min: 0, max: 1 },
    ),
    sparklineLineWidth: parseBoundedNumber(
      rawFormData.sparkline_line_width,
      DEFAULT_SPARKLINE_LINE_WIDTH,
      { min: 1, max: 8 },
    ),
    padding: parsePositiveInteger(rawFormData.card_padding, DEFAULT_CARD_PADDING, {
      min: 8,
      max: 48,
    }),
    borderRadius: parsePositiveInteger(
      rawFormData.border_radius,
      DEFAULT_BORDER_RADIUS,
      { min: 0, max: 48 },
    ),
    showBorder: rawFormData.show_border ?? true,
    showShadow: rawFormData.show_shadow ?? false,
    titleFontSize: parsePositiveInteger(
      rawFormData.title_font_size,
      DEFAULT_TITLE_FONT_SIZE,
      { min: 10, max: 28 },
    ),
    kpiValueFontSize: parsePositiveInteger(
      rawFormData.kpi_value_font_size,
      DEFAULT_KPI_VALUE_FONT_SIZE,
      { min: 18, max: 72 },
    ),
    trendFontSize: parsePositiveInteger(
      rawFormData.trend_font_size,
      DEFAULT_TREND_FONT_SIZE,
      { min: 10, max: 24 },
    ),
    valueColumnWidthPercent: parsePositiveInteger(
      rawFormData.value_column_width_percent,
      DEFAULT_VALUE_COLUMN_WIDTH_PERCENT,
      { min: 40, max: 80 },
    ),
    noData,
    noDataMessage: warnings[0] ?? DEFAULT_NO_DATA_MESSAGE,
    warnings,
  };
}

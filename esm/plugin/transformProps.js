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

import { DEFAULT_BORDER_RADIUS, DEFAULT_CARD_PADDING, DEFAULT_DECIMAL_PRECISION, DEFAULT_DURATION_UNIT, DEFAULT_KPI_AGGREGATION_MODE, DEFAULT_KPI_SOURCE_MODE, DEFAULT_KPI_VALUE_FONT_SIZE, DEFAULT_NO_DATA_MESSAGE, DEFAULT_SPARKLINE_FILL_OPACITY, DEFAULT_SPARKLINE_LINE_WIDTH, DEFAULT_TITLE_FONT_SIZE, DEFAULT_TREND_CALCULATION_MODE, DEFAULT_TREND_FONT_SIZE, DEFAULT_TREND_MEANING, DEFAULT_VALUE_COLUMN_WIDTH_PERCENT } from '../constants';
import { aggregateSparklineValue, buildSparklineData, computeTrendResult, findRecordValue, formatMetricValue, getColumnLabel, getFirstMetricRawValue, getLatestNumericSparklineDatum, getMetricLabelSafe, getPrimaryMetric, hasMeaningfulValue, parseBoundedNumber, parsePositiveInteger, resolveTimeField, resolveValueType, toNumericMetricValue } from '../utils';
function hasDisplayableValue(candidate) {
  return hasMeaningfulValue(candidate.rawValue) || candidate.numericValue !== null;
}
function selectKpiValue(preferred, fallback) {
  return hasDisplayableValue(preferred) ? preferred : fallback;
}
export default function transformProps(chartProps) {
  var _queriesData$, _queriesData$2, _rawFormData$granular, _rawFormData$duration, _rawFormData$number_f, _rawFormData$value_pr, _rawFormData$value_su, _rawFormData$kpi_aggr, _rawFormData$kpi_sour, _rawFormData$show_spa, _rawFormData$enable_t, _rawFormData$trend_ca, _latestSparklineDatum, _selectedValue$rawVal, _rawFormData$trend_me, _rawFormData$show_pos, _rawFormData$card_tit, _rawFormData$show_tit, _rawFormData$show_inf, _rawFormData$info_too, _rawFormData$sparklin, _rawFormData$sparklin2, _rawFormData$show_bor, _rawFormData$show_sha, _warnings$;
  var {
    width,
    height,
    queriesData,
    formData,
    theme
  } = chartProps;
  var rawFormData = chartProps.rawFormData || formData;
  var primaryMetric = getPrimaryMetric(rawFormData.metrics, rawFormData.metric);
  if (!primaryMetric) {
    throw new Error('Universal KPI Card requires a primary metric.');
  }
  var primaryMetricLabel = getMetricLabelSafe(primaryMetric);
  var secondaryMetricLabel = rawFormData.secondary_metric ? getMetricLabelSafe(rawFormData.secondary_metric) : undefined;
  var aggregateRows = ((_queriesData$ = queriesData[0]) == null ? void 0 : _queriesData$.data) || [];
  var timeseriesRows = ((_queriesData$2 = queriesData[1]) == null ? void 0 : _queriesData$2.data) || [];
  var aggregateRow = aggregateRows[0];
  var configuredTimeLabel = getColumnLabel((_rawFormData$granular = rawFormData.granularity_sqla) != null ? _rawFormData$granular : rawFormData.granularity);
  var durationUnit = (_rawFormData$duration = rawFormData.duration_unit) != null ? _rawFormData$duration : DEFAULT_DURATION_UNIT;
  var decimalPrecision = parsePositiveInteger(rawFormData.decimal_precision, DEFAULT_DECIMAL_PRECISION, {
    min: 0,
    max: 8
  });
  var numberFormat = ((_rawFormData$number_f = rawFormData.number_format) == null ? void 0 : _rawFormData$number_f.trim()) || 'SMART_NUMBER';
  var valuePrefix = ((_rawFormData$value_pr = rawFormData.value_prefix) == null ? void 0 : _rawFormData$value_pr.trim()) || '';
  var valueSuffix = ((_rawFormData$value_su = rawFormData.value_suffix) == null ? void 0 : _rawFormData$value_su.trim()) || '';
  var kpiAggregationMode = (_rawFormData$kpi_aggr = rawFormData.kpi_aggregation_mode) != null ? _rawFormData$kpi_aggr : DEFAULT_KPI_AGGREGATION_MODE;
  var kpiSourceMode = (_rawFormData$kpi_sour = rawFormData.kpi_source_mode) != null ? _rawFormData$kpi_sour : DEFAULT_KPI_SOURCE_MODE;
  var showSparkline = (_rawFormData$show_spa = rawFormData.show_sparkline) != null ? _rawFormData$show_spa : true;
  var enableTrend = (_rawFormData$enable_t = rawFormData.enable_trend) != null ? _rawFormData$enable_t : true;
  var trendCalculationMode = (_rawFormData$trend_ca = rawFormData.trend_calculation_mode) != null ? _rawFormData$trend_ca : DEFAULT_TREND_CALCULATION_MODE;
  var warnings = [];
  var rawAggregatePrimaryValue = aggregateRow ? findRecordValue(aggregateRow, primaryMetricLabel, {
    allowSingleNumericFallback: !secondaryMetricLabel
  }) : undefined;
  var rawTimeseriesPrimaryValue = getFirstMetricRawValue(timeseriesRows, primaryMetricLabel, configuredTimeLabel ? [configuredTimeLabel, '__timestamp'] : ['__timestamp']);
  var primaryValueType = resolveValueType(rawFormData.value_type_mode, {
    metricLabel: primaryMetricLabel,
    rawValue: rawAggregatePrimaryValue != null ? rawAggregatePrimaryValue : rawTimeseriesPrimaryValue,
    valueSuffix
  });
  var timeField = resolveTimeField(timeseriesRows, configuredTimeLabel);
  var sparklineResult = timeField ? buildSparklineData(timeseriesRows, {
    metricLabel: primaryMetricLabel,
    timeField,
    valueType: primaryValueType,
    durationUnit
  }) : {
    data: [],
    invalidTimestampRows: 0
  };
  if (timeseriesRows.length && !timeField) {
    warnings.push('The time-series query returned rows, but no usable timestamp field could be resolved for the sparkline.');
  }
  if (sparklineResult.invalidTimestampRows > 0) {
    warnings.push(sparklineResult.invalidTimestampRows + " sparkline row(s) were skipped because the timestamp field was missing or invalid.");
  }
  var aggregatePrimaryNumericValue = toNumericMetricValue(rawAggregatePrimaryValue, primaryValueType, durationUnit);
  var timeseriesNumericValue = aggregateSparklineValue(sparklineResult.data, kpiAggregationMode);
  var latestSparklineDatum = getLatestNumericSparklineDatum(sparklineResult.data);
  var aggregateCandidate = {
    source: 'aggregate',
    aggregationMode: 'latest',
    rawValue: rawAggregatePrimaryValue,
    numericValue: aggregatePrimaryNumericValue,
    formattedValue: '--'
  };
  var timeseriesCandidate = {
    source: 'time_series',
    aggregationMode: kpiAggregationMode,
    rawValue: kpiAggregationMode === 'latest' ? (_latestSparklineDatum = latestSparklineDatum == null ? void 0 : latestSparklineDatum.rawValue) != null ? _latestSparklineDatum : timeseriesNumericValue : timeseriesNumericValue,
    numericValue: timeseriesNumericValue,
    formattedValue: '--'
  };
  var selectedValue = selectKpiValue(kpiSourceMode === 'time_series' ? timeseriesCandidate : aggregateCandidate, kpiSourceMode === 'time_series' ? aggregateCandidate : timeseriesCandidate);
  var formattedValue = hasDisplayableValue(selectedValue) ? formatMetricValue((_selectedValue$rawVal = selectedValue.rawValue) != null ? _selectedValue$rawVal : selectedValue.numericValue, {
    valueType: primaryValueType,
    numberFormat,
    decimalPrecision,
    durationUnit,
    prefix: valuePrefix,
    suffix: valueSuffix
  }) : '--';
  var rawSecondaryValue = aggregateRow && secondaryMetricLabel ? findRecordValue(aggregateRow, secondaryMetricLabel, {
    allowSingleNumericFallback: false
  }) : undefined;
  var secondaryValueType = resolveValueType(rawFormData.value_type_mode, {
    metricLabel: secondaryMetricLabel,
    rawValue: rawSecondaryValue
  });
  var secondaryNumericValue = toNumericMetricValue(rawSecondaryValue, secondaryValueType, durationUnit);
  if (trendCalculationMode === 'secondary_metric' && !secondaryMetricLabel) {
    warnings.push('Trend calculation mode is set to secondary metric, but no secondary metric is configured.');
  }
  var trend = enableTrend ? computeTrendResult({
    mode: trendCalculationMode,
    sparklineData: sparklineResult.data,
    secondaryValue: rawSecondaryValue,
    secondaryNumericValue,
    trendMeaning: (_rawFormData$trend_me = rawFormData.trend_meaning) != null ? _rawFormData$trend_me : DEFAULT_TREND_MEANING,
    neutralThreshold: parseBoundedNumber(rawFormData.neutral_threshold, 0, {
      min: 0
    }),
    labelPrefix: rawFormData.trend_label_prefix,
    showTrendLabel: rawFormData.show_trend_label,
    showPositivePlusSign: (_rawFormData$show_pos = rawFormData.show_positive_plus_sign) != null ? _rawFormData$show_pos : true,
    decimalPrecision,
    numberFormat,
    durationUnit,
    valueType: trendCalculationMode === 'secondary_metric' ? secondaryValueType : primaryValueType
  }) : undefined;
  var noData = !hasDisplayableValue(selectedValue);
  if (noData) {
    warnings.push('No KPI value could be derived from the current query results and control selections.');
  }
  return {
    width,
    height,
    theme,
    title: ((_rawFormData$card_tit = rawFormData.card_title_override) == null ? void 0 : _rawFormData$card_tit.trim()) || primaryMetricLabel,
    showTitle: (_rawFormData$show_tit = rawFormData.show_title) != null ? _rawFormData$show_tit : true,
    showInfoIcon: (_rawFormData$show_inf = rawFormData.show_info_icon) != null ? _rawFormData$show_inf : false,
    infoTooltipText: ((_rawFormData$info_too = rawFormData.info_tooltip_text) == null ? void 0 : _rawFormData$info_too.trim()) || undefined,
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
    sparklineType: (_rawFormData$sparklin = rawFormData.sparkline_type) != null ? _rawFormData$sparklin : 'area',
    sparklineSmooth: (_rawFormData$sparklin2 = rawFormData.sparkline_smooth) != null ? _rawFormData$sparklin2 : true,
    sparklineFillOpacity: parseBoundedNumber(rawFormData.sparkline_fill_opacity, DEFAULT_SPARKLINE_FILL_OPACITY, {
      min: 0,
      max: 1
    }),
    sparklineLineWidth: parseBoundedNumber(rawFormData.sparkline_line_width, DEFAULT_SPARKLINE_LINE_WIDTH, {
      min: 1,
      max: 8
    }),
    padding: parsePositiveInteger(rawFormData.card_padding, DEFAULT_CARD_PADDING, {
      min: 8,
      max: 48
    }),
    borderRadius: parsePositiveInteger(rawFormData.border_radius, DEFAULT_BORDER_RADIUS, {
      min: 0,
      max: 48
    }),
    showBorder: (_rawFormData$show_bor = rawFormData.show_border) != null ? _rawFormData$show_bor : true,
    showShadow: (_rawFormData$show_sha = rawFormData.show_shadow) != null ? _rawFormData$show_sha : false,
    titleFontSize: parsePositiveInteger(rawFormData.title_font_size, DEFAULT_TITLE_FONT_SIZE, {
      min: 10,
      max: 28
    }),
    kpiValueFontSize: parsePositiveInteger(rawFormData.kpi_value_font_size, DEFAULT_KPI_VALUE_FONT_SIZE, {
      min: 18,
      max: 72
    }),
    trendFontSize: parsePositiveInteger(rawFormData.trend_font_size, DEFAULT_TREND_FONT_SIZE, {
      min: 10,
      max: 24
    }),
    valueColumnWidthPercent: parsePositiveInteger(rawFormData.value_column_width_percent, DEFAULT_VALUE_COLUMN_WIDTH_PERCENT, {
      min: 40,
      max: 80
    }),
    noData,
    noDataMessage: (_warnings$ = warnings[0]) != null ? _warnings$ : DEFAULT_NO_DATA_MESSAGE,
    warnings
  };
}
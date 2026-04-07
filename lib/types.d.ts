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
import type { QueryFormData, QueryFormMetric, TimeseriesDataRecord } from '@superset-ui/core';
export type ColumnLike = string | {
    label?: string;
    column_name?: string;
    sqlExpression?: string;
    expressionType?: string;
};
export type ValueTypeMode = 'auto' | 'number' | 'percent' | 'duration';
export type ResolvedValueTypeMode = Exclude<ValueTypeMode, 'auto'>;
export type DurationInputUnit = 'seconds' | 'milliseconds';
export type KpiAggregationMode = 'latest' | 'sum' | 'average' | 'min' | 'max';
export type TrendCalculationMode = 'first_vs_last_percent' | 'previous_vs_latest_percent' | 'absolute_difference' | 'secondary_metric';
export type TrendMeaning = 'higher_is_better' | 'lower_is_better';
export type TrendState = 'good' | 'bad' | 'neutral' | 'missing';
export type TrendDirection = 'positive' | 'negative' | 'neutral' | 'missing';
export type SparklineType = 'line' | 'area';
export type KpiSourceMode = 'time_series' | 'direct_metric';
export interface SparklineDatum {
    timestamp: number;
    value: number | null;
    rawValue: unknown;
    originalRow: TimeseriesDataRecord;
}
export interface TrendResult {
    label: string;
    formattedValue: string;
    numericValue: number | null;
    state: TrendState;
    direction: TrendDirection;
    isPercent: boolean;
}
export interface KpiValueResult {
    source: 'aggregate' | 'time_series';
    aggregationMode: KpiAggregationMode;
    rawValue: unknown;
    numericValue: number | null;
    formattedValue: string;
}
export interface KpiUniversalChartFormData extends QueryFormData {
    metric?: QueryFormMetric | null;
    metrics?: QueryFormMetric[] | QueryFormMetric | null;
    secondary_metric?: QueryFormMetric | null;
    granularity_sqla?: ColumnLike | null;
    granularity?: ColumnLike | null;
    time_grain_sqla?: string | null;
    row_limit?: number | string;
    kpi_source_mode?: KpiSourceMode;
    card_title_override?: string;
    show_title?: boolean;
    show_info_icon?: boolean;
    info_tooltip_text?: string;
    trend_label_prefix?: string;
    show_trend_label?: boolean;
    number_format?: string;
    decimal_precision?: number | string;
    value_prefix?: string;
    value_suffix?: string;
    value_type_mode?: ValueTypeMode;
    duration_unit?: DurationInputUnit;
    kpi_aggregation_mode?: KpiAggregationMode;
    enable_trend?: boolean;
    trend_calculation_mode?: TrendCalculationMode;
    trend_meaning?: TrendMeaning;
    neutral_threshold?: number | string;
    show_positive_plus_sign?: boolean;
    show_sparkline?: boolean;
    sparkline_type?: SparklineType;
    sparkline_smooth?: boolean;
    sparkline_fill_opacity?: number | string;
    sparkline_line_width?: number | string;
    card_padding?: number | string;
    border_radius?: number | string;
    show_border?: boolean;
    show_shadow?: boolean;
    title_font_size?: number | string;
    kpi_value_font_size?: number | string;
    trend_font_size?: number | string;
    value_column_width_percent?: number | string;
}
export interface KpiUniversalChartProps {
    width: number;
    height: number;
    theme: Record<string, any>;
    title: string;
    showTitle: boolean;
    showInfoIcon: boolean;
    infoTooltipText?: string;
    primaryMetricLabel: string;
    secondaryMetricLabel?: string;
    formattedValue: string;
    rawValue: unknown;
    valueSource: 'aggregate' | 'time_series';
    resolvedValueType: ResolvedValueTypeMode;
    showTrend: boolean;
    trend?: TrendResult;
    showSparkline: boolean;
    sparklineData: SparklineDatum[];
    sparklineType: SparklineType;
    sparklineSmooth: boolean;
    sparklineFillOpacity: number;
    sparklineLineWidth: number;
    padding: number;
    borderRadius: number;
    showBorder: boolean;
    showShadow: boolean;
    titleFontSize: number;
    kpiValueFontSize: number;
    trendFontSize: number;
    valueColumnWidthPercent: number;
    noData: boolean;
    noDataMessage: string;
    warnings: string[];
}
//# sourceMappingURL=types.d.ts.map
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
import type { QueryFormMetric, TimeseriesDataRecord } from '@superset-ui/core';
import type { ColumnLike, DurationInputUnit, KpiAggregationMode, ResolvedValueTypeMode, SparklineDatum, TrendCalculationMode, TrendDirection, TrendMeaning, TrendResult, TrendState, ValueTypeMode } from './types';
export declare function getColumnLabel(column?: ColumnLike | null): string | undefined;
export declare function getPrimaryMetric(metrics?: QueryFormMetric[] | QueryFormMetric | null, metric?: QueryFormMetric | null): QueryFormMetric | undefined;
export declare function getMetricLabelSafe(metric?: QueryFormMetric): string;
export declare function uniqueMetrics(metrics: Array<QueryFormMetric | null | undefined>): QueryFormMetric[];
export declare function hasMeaningfulValue(value: unknown): boolean;
export declare function toNumber(value: unknown): number | null;
export declare function parsePositiveInteger(value: unknown, fallback: number, options?: {
    min?: number;
    max?: number;
}): number;
export declare function parseBoundedNumber(value: unknown, fallback: number, options?: {
    min?: number;
    max?: number;
}): number;
export declare function parseTimestamp(value: unknown): number | null;
export declare function isDurationLike(value: unknown): boolean;
export declare function parseDurationInSeconds(value: unknown, durationUnit: DurationInputUnit): number | null;
export declare function formatDurationValue(value: unknown, durationUnit: DurationInputUnit, showPositivePlusSign?: boolean): string;
export declare function findRecordValue(row: TimeseriesDataRecord, label?: string, options?: {
    excludedKeys?: string[];
    allowSingleNumericFallback?: boolean;
}): unknown;
export declare function getFirstMetricRawValue(rows: TimeseriesDataRecord[], label: string, excludedKeys?: string[]): unknown;
export declare function resolveValueType(valueTypeMode: ValueTypeMode | undefined, options: {
    metricLabel?: string;
    rawValue?: unknown;
    valueSuffix?: string;
}): ResolvedValueTypeMode;
export declare function toNumericMetricValue(value: unknown, valueType: ResolvedValueTypeMode, durationUnit: DurationInputUnit): number | null;
export declare function formatMetricValue(value: unknown, options: {
    valueType: ResolvedValueTypeMode;
    numberFormat?: string;
    decimalPrecision?: number;
    durationUnit: DurationInputUnit;
    prefix?: string;
    suffix?: string;
    showPositivePlusSign?: boolean;
    scalePercent?: boolean;
}): string;
export declare function resolveTimeField(rows: TimeseriesDataRecord[], configuredLabel?: string): string | undefined;
export declare function buildSparklineData(rows: TimeseriesDataRecord[], options: {
    metricLabel: string;
    timeField?: string;
    valueType: ResolvedValueTypeMode;
    durationUnit: DurationInputUnit;
}): {
    data: SparklineDatum[];
    invalidTimestampRows: number;
};
export declare function aggregateSparklineValue(data: SparklineDatum[], aggregationMode: KpiAggregationMode): number | null;
export declare function getLatestNumericSparklineDatum(data: SparklineDatum[]): SparklineDatum | undefined;
export declare function getFirstAndLastNumericValues(data: SparklineDatum[]): [number, number] | null;
export declare function getPreviousAndLatestNumericValues(data: SparklineDatum[]): [number, number] | null;
export declare function determineTrendState(comparableValue: number | null, trendMeaning: TrendMeaning, neutralThreshold: number): TrendState;
export declare function determineTrendDirection(numericValue: number | null, neutralThreshold: number): TrendDirection;
export declare function calculatePercentChange(baseline: number, latest: number): number | null;
export declare function computeTrendResult(options: {
    mode: TrendCalculationMode;
    sparklineData: SparklineDatum[];
    secondaryValue: unknown;
    secondaryNumericValue: number | null;
    trendMeaning: TrendMeaning;
    neutralThreshold: number;
    labelPrefix?: string;
    showTrendLabel?: boolean;
    showPositivePlusSign?: boolean;
    decimalPrecision?: number;
    numberFormat?: string;
    durationUnit: DurationInputUnit;
    valueType: ResolvedValueTypeMode;
}): TrendResult;
//# sourceMappingURL=utils.d.ts.map
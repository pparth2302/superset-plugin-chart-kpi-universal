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

import { getMetricLabel, getNumberFormatter } from '@superset-ui/core';
import type { QueryFormMetric, TimeseriesDataRecord } from '@superset-ui/core';
import {
  DEFAULT_DECIMAL_PRECISION,
  DEFAULT_TREND_LABEL_PREFIX,
} from './constants';
import type {
  ColumnLike,
  DurationInputUnit,
  KpiAggregationMode,
  ResolvedValueTypeMode,
  SparklineDatum,
  TrendCalculationMode,
  TrendDirection,
  TrendMeaning,
  TrendResult,
  TrendState,
  ValueTypeMode,
} from './types';

function normalizeLookupKey(value: string): string {
  return value.replace(/[`"'[\]]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
}

function formatNumberWithPrecision(
  value: number,
  precision: number,
  showPositivePlusSign = false,
): string {
  const numeric = Number(value);
  const absValue = Math.abs(numeric);
  const formatted = absValue.toLocaleString(undefined, {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  });

  if (numeric < 0) {
    return `-${formatted}`;
  }

  if (showPositivePlusSign && numeric > 0) {
    return `+${formatted}`;
  }

  return formatted;
}

function getNumericCandidateKeys(
  row: TimeseriesDataRecord,
  excludedKeys: string[],
): string[] {
  return Object.keys(row).filter(key => {
    if (excludedKeys.includes(key)) {
      return false;
    }

    return toNumber(row[key]) !== null || isDurationLike(row[key]);
  });
}

function getPercentDisplayValue(value: number): number {
  return Math.abs(value) <= 1 ? value * 100 : value;
}

function formatDurationCore(totalSeconds: number): string {
  const absSeconds = Math.abs(Math.round(totalSeconds));
  const hours = Math.floor(absSeconds / 3600);
  const minutes = Math.floor((absSeconds % 3600) / 60);
  const seconds = absSeconds % 60;

  return [hours, minutes, seconds]
    .map((part, index) => (index === 0 ? String(part) : String(part).padStart(2, '0')))
    .join(':');
}

export function getColumnLabel(column?: ColumnLike | null): string | undefined {
  if (!column) {
    return undefined;
  }

  if (typeof column === 'string') {
    return column;
  }

  return column.label ?? column.column_name ?? column.sqlExpression;
}

export function getPrimaryMetric(
  metrics?: QueryFormMetric[] | QueryFormMetric | null,
  metric?: QueryFormMetric | null,
): QueryFormMetric | undefined {
  if (Array.isArray(metrics)) {
    return metrics.find(Boolean);
  }

  if (metrics) {
    return metrics;
  }

  return metric ?? undefined;
}

export function getMetricLabelSafe(metric?: QueryFormMetric): string {
  return metric ? getMetricLabel(metric) : 'Metric';
}

export function uniqueMetrics(
  metrics: Array<QueryFormMetric | null | undefined>,
): QueryFormMetric[] {
  const seen = new Set<string>();

  return metrics.reduce<QueryFormMetric[]>((accumulator, metric) => {
    if (!metric) {
      return accumulator;
    }

    const key = getMetricLabelSafe(metric);
    if (seen.has(key)) {
      return accumulator;
    }

    seen.add(key);
    accumulator.push(metric);
    return accumulator;
  }, []);
}

export function hasMeaningfulValue(value: unknown): boolean {
  return value !== null && typeof value !== 'undefined' && value !== '';
}

export function toNumber(value: unknown): number | null {
  if (!hasMeaningfulValue(value)) {
    return null;
  }

  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

export function parsePositiveInteger(
  value: unknown,
  fallback: number,
  options: { min?: number; max?: number } = {},
): number {
  const numeric = toNumber(value);
  if (numeric === null) {
    return fallback;
  }

  const min = options.min ?? 0;
  const max = options.max ?? Number.MAX_SAFE_INTEGER;
  return Math.max(min, Math.min(max, Math.round(numeric)));
}

export function parseBoundedNumber(
  value: unknown,
  fallback: number,
  options: { min?: number; max?: number } = {},
): number {
  const numeric = toNumber(value);
  if (numeric === null) {
    return fallback;
  }

  const min = options.min ?? -Number.MAX_SAFE_INTEGER;
  const max = options.max ?? Number.MAX_SAFE_INTEGER;
  return Math.max(min, Math.min(max, numeric));
}

export function parseTimestamp(value: unknown): number | null {
  if (!hasMeaningfulValue(value)) {
    return null;
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.getTime();
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return value > 1e12 ? value : value * 1000;
  }

  const timestamp = Date.parse(String(value));
  return Number.isNaN(timestamp) ? null : timestamp;
}

export function isDurationLike(value: unknown): boolean {
  if (!hasMeaningfulValue(value) || typeof value !== 'string') {
    return false;
  }

  const parts = value.trim().split(':');
  if (parts.length !== 2 && parts.length !== 3) {
    return false;
  }

  return parts.every(part => /^\d+$/.test(part));
}

export function parseDurationInSeconds(
  value: unknown,
  durationUnit: DurationInputUnit,
): number | null {
  if (!hasMeaningfulValue(value)) {
    return null;
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return durationUnit === 'milliseconds' ? value / 1000 : value;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    const directNumber = toNumber(trimmed);
    if (directNumber !== null) {
      return durationUnit === 'milliseconds' ? directNumber / 1000 : directNumber;
    }

    if (!isDurationLike(trimmed)) {
      return null;
    }

    const parts = trimmed.split(':').map(part => Number(part));
    if (parts.some(part => !Number.isFinite(part))) {
      return null;
    }

    if (parts.length === 2) {
      const [minutes, seconds] = parts;
      return minutes * 60 + seconds;
    }

    const [hours, minutes, seconds] = parts;
    return hours * 3600 + minutes * 60 + seconds;
  }

  return null;
}

export function formatDurationValue(
  value: unknown,
  durationUnit: DurationInputUnit,
  showPositivePlusSign = false,
): string {
  const totalSeconds = parseDurationInSeconds(value, durationUnit);
  if (totalSeconds === null) {
    return '--';
  }

  const sign =
    totalSeconds < 0
      ? '-'
      : totalSeconds > 0 && showPositivePlusSign
        ? '+'
        : '';
  return `${sign}${formatDurationCore(totalSeconds)}`;
}

export function findRecordValue(
  row: TimeseriesDataRecord,
  label?: string,
  options: {
    excludedKeys?: string[];
    allowSingleNumericFallback?: boolean;
  } = {},
): unknown {
  if (!label) {
    return undefined;
  }

  const excludedKeys = options.excludedKeys ?? [];
  if (Object.prototype.hasOwnProperty.call(row, label)) {
    return row[label];
  }

  const normalizedLabel = normalizeLookupKey(label);
  const matchingKey = Object.keys(row).find(
    key => normalizeLookupKey(key) === normalizedLabel,
  );
  if (matchingKey) {
    return row[matchingKey];
  }

  if (!options.allowSingleNumericFallback) {
    return undefined;
  }

  const numericCandidateKeys = getNumericCandidateKeys(row, excludedKeys);
  if (numericCandidateKeys.length === 1) {
    return row[numericCandidateKeys[0]];
  }

  return undefined;
}

export function getFirstMetricRawValue(
  rows: TimeseriesDataRecord[],
  label: string,
  excludedKeys: string[] = [],
): unknown {
  return rows.reduce<unknown>((accumulator, row) => {
    if (hasMeaningfulValue(accumulator)) {
      return accumulator;
    }

    return findRecordValue(row, label, {
      excludedKeys,
      allowSingleNumericFallback: false,
    });
  }, undefined);
}

export function resolveValueType(
  valueTypeMode: ValueTypeMode | undefined,
  options: {
    metricLabel?: string;
    rawValue?: unknown;
    valueSuffix?: string;
  },
): ResolvedValueTypeMode {
  if (valueTypeMode && valueTypeMode !== 'auto') {
    return valueTypeMode;
  }

  if (isDurationLike(options.rawValue)) {
    return 'duration';
  }

  const hint = `${options.metricLabel ?? ''} ${options.valueSuffix ?? ''}`.toLowerCase();
  if (hint.includes('%') || hint.includes('percent') || hint.includes('pct')) {
    return 'percent';
  }

  return 'number';
}

export function toNumericMetricValue(
  value: unknown,
  valueType: ResolvedValueTypeMode,
  durationUnit: DurationInputUnit,
): number | null {
  if (valueType === 'duration') {
    return parseDurationInSeconds(value, durationUnit);
  }

  return toNumber(value);
}

export function formatMetricValue(
  value: unknown,
  options: {
    valueType: ResolvedValueTypeMode;
    numberFormat?: string;
    decimalPrecision?: number;
    durationUnit: DurationInputUnit;
    prefix?: string;
    suffix?: string;
    showPositivePlusSign?: boolean;
    scalePercent?: boolean;
  },
): string {
  const prefix = options.prefix ?? '';
  const suffix = options.suffix ?? '';
  const precision = options.decimalPrecision ?? DEFAULT_DECIMAL_PRECISION;
  const numberFormat = options.numberFormat?.trim();

  if (!hasMeaningfulValue(value)) {
    return '--';
  }

  if (options.valueType === 'duration') {
    const durationText = formatDurationValue(
      value,
      options.durationUnit,
      options.showPositivePlusSign,
    );
    return durationText === '--' ? durationText : `${prefix}${durationText}${suffix}`;
  }

  const numeric = toNumber(value);
  if (numeric === null) {
    return `${prefix}${String(value)}${suffix}`;
  }

  if (options.valueType === 'percent') {
    const percentValue =
      options.scalePercent === false ? numeric : getPercentDisplayValue(numeric);
    return `${prefix}${formatNumberWithPrecision(
      percentValue,
      precision,
      options.showPositivePlusSign,
    )}%${suffix}`;
  }

  const useSupersetFormatter = Boolean(numberFormat && numberFormat !== 'SMART_NUMBER');
  const baseValue = useSupersetFormatter
    ? getNumberFormatter(numberFormat)(numeric)
    : formatNumberWithPrecision(numeric, precision, options.showPositivePlusSign);

  return `${prefix}${baseValue}${suffix}`;
}

export function resolveTimeField(
  rows: TimeseriesDataRecord[],
  configuredLabel?: string,
): string | undefined {
  const candidates = ['__timestamp', configuredLabel].filter(
    (value): value is string => Boolean(value),
  );

  const exactMatch = candidates.find(candidate =>
    rows.some(row => parseTimestamp(row[candidate]) !== null),
  );
  if (exactMatch) {
    return exactMatch;
  }

  const heuristicMatch = Array.from(
    new Set(rows.flatMap(row => Object.keys(row))),
  ).find(
    key =>
      /(timestamp|time|date|ds)$/i.test(key) &&
      rows.some(row => parseTimestamp(row[key]) !== null),
  );

  return heuristicMatch;
}

export function buildSparklineData(
  rows: TimeseriesDataRecord[],
  options: {
    metricLabel: string;
    timeField?: string;
    valueType: ResolvedValueTypeMode;
    durationUnit: DurationInputUnit;
  },
): {
  data: SparklineDatum[];
  invalidTimestampRows: number;
} {
  let invalidTimestampRows = 0;

  const data = rows
    .map(row => {
      const timestamp = options.timeField ? parseTimestamp(row[options.timeField]) : null;
      if (timestamp === null) {
        invalidTimestampRows += 1;
        return null;
      }

      const rawValue = findRecordValue(row, options.metricLabel, {
        excludedKeys: options.timeField ? [options.timeField] : [],
        allowSingleNumericFallback: false,
      });

      return {
        timestamp,
        value: toNumericMetricValue(rawValue, options.valueType, options.durationUnit),
        rawValue,
        originalRow: row,
      } as SparklineDatum;
    })
    .filter((datum): datum is SparklineDatum => datum !== null)
    .sort((left, right) => left.timestamp - right.timestamp);

  return {
    data,
    invalidTimestampRows,
  };
}

export function aggregateSparklineValue(
  data: SparklineDatum[],
  aggregationMode: KpiAggregationMode,
): number | null {
  const numericValues = data
    .map(datum => datum.value)
    .filter((value): value is number => value !== null && Number.isFinite(value));

  if (!numericValues.length) {
    return null;
  }

  switch (aggregationMode) {
    case 'sum':
      return numericValues.reduce((sum, value) => sum + value, 0);
    case 'average':
      return numericValues.reduce((sum, value) => sum + value, 0) / numericValues.length;
    case 'min':
      return Math.min(...numericValues);
    case 'max':
      return Math.max(...numericValues);
    case 'latest':
    default:
      return numericValues[numericValues.length - 1];
  }
}

export function getLatestNumericSparklineDatum(
  data: SparklineDatum[],
): SparklineDatum | undefined {
  return [...data]
    .reverse()
    .find(datum => datum.value !== null && Number.isFinite(datum.value));
}

export function getFirstAndLastNumericValues(
  data: SparklineDatum[],
): [number, number] | null {
  const numericValues = data
    .map(datum => datum.value)
    .filter((value): value is number => value !== null && Number.isFinite(value));

  if (numericValues.length < 2) {
    return null;
  }

  return [numericValues[0], numericValues[numericValues.length - 1]];
}

export function getPreviousAndLatestNumericValues(
  data: SparklineDatum[],
): [number, number] | null {
  const numericValues = data
    .map(datum => datum.value)
    .filter((value): value is number => value !== null && Number.isFinite(value));

  if (numericValues.length < 2) {
    return null;
  }

  return [
    numericValues[numericValues.length - 2],
    numericValues[numericValues.length - 1],
  ];
}

export function determineTrendState(
  comparableValue: number | null,
  trendMeaning: TrendMeaning,
  neutralThreshold: number,
): TrendState {
  if (comparableValue === null || !Number.isFinite(comparableValue)) {
    return 'missing';
  }

  if (Math.abs(comparableValue) <= neutralThreshold) {
    return 'neutral';
  }

  const isPositive = comparableValue > 0;
  if (trendMeaning === 'lower_is_better') {
    return isPositive ? 'bad' : 'good';
  }

  return isPositive ? 'good' : 'bad';
}

export function determineTrendDirection(
  numericValue: number | null,
  neutralThreshold: number,
): TrendDirection {
  if (numericValue === null || !Number.isFinite(numericValue)) {
    return 'missing';
  }

  if (Math.abs(numericValue) <= neutralThreshold) {
    return 'neutral';
  }

  return numericValue > 0 ? 'positive' : 'negative';
}

export function calculatePercentChange(
  baseline: number,
  latest: number,
): number | null {
  if (!Number.isFinite(baseline) || !Number.isFinite(latest)) {
    return null;
  }

  if (baseline === 0) {
    return latest === 0 ? 0 : null;
  }

  return ((latest - baseline) / Math.abs(baseline)) * 100;
}

export function computeTrendResult(options: {
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
}): TrendResult {
  let numericValue: number | null = null;
  let comparableValue: number | null = null;
  let isPercent = false;
  let formatValue = options.secondaryValue;

  switch (options.mode) {
    case 'first_vs_last_percent': {
      const pair = getFirstAndLastNumericValues(options.sparklineData);
      numericValue = pair ? calculatePercentChange(pair[0], pair[1]) : null;
      comparableValue = numericValue;
      formatValue = numericValue;
      isPercent = true;
      break;
    }
    case 'previous_vs_latest_percent': {
      const pair = getPreviousAndLatestNumericValues(options.sparklineData);
      numericValue = pair ? calculatePercentChange(pair[0], pair[1]) : null;
      comparableValue = numericValue;
      formatValue = numericValue;
      isPercent = true;
      break;
    }
    case 'absolute_difference': {
      const pair = getPreviousAndLatestNumericValues(options.sparklineData);
      numericValue = pair ? pair[1] - pair[0] : null;
      comparableValue = numericValue;
      formatValue = numericValue;
      break;
    }
    case 'direct_secondary_value':
    case 'secondary_metric':
    default:
      numericValue = options.secondaryNumericValue;
      comparableValue = numericValue;
      formatValue = options.secondaryValue;
      break;
  }

  const state = determineTrendState(
    comparableValue,
    options.trendMeaning,
    options.neutralThreshold,
  );
  const direction = determineTrendDirection(numericValue, options.neutralThreshold);
  const formattedValue =
    numericValue === null
      ? '--'
      : isPercent
        ? formatMetricValue(formatValue, {
            valueType: 'percent',
            decimalPrecision: options.decimalPrecision ?? DEFAULT_DECIMAL_PRECISION,
            durationUnit: options.durationUnit,
            showPositivePlusSign: options.showPositivePlusSign,
            scalePercent: false,
          })
        : formatMetricValue(formatValue, {
            valueType: options.valueType,
            numberFormat: options.numberFormat,
            decimalPrecision: options.decimalPrecision ?? DEFAULT_DECIMAL_PRECISION,
            durationUnit: options.durationUnit,
            showPositivePlusSign: options.showPositivePlusSign,
          });
  const prefix = options.labelPrefix?.trim() || DEFAULT_TREND_LABEL_PREFIX;

  return {
    label: options.showTrendLabel === false ? formattedValue : `${prefix} ${formattedValue}`,
    formattedValue,
    numericValue,
    state,
    direction,
    isPercent,
  };
}

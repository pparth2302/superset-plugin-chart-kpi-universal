"use strict";

exports.__esModule = true;
exports.aggregateSparklineValue = aggregateSparklineValue;
exports.buildSparklineData = buildSparklineData;
exports.calculatePercentChange = calculatePercentChange;
exports.computeTrendResult = computeTrendResult;
exports.determineTrendDirection = determineTrendDirection;
exports.determineTrendState = determineTrendState;
exports.findRecordValue = findRecordValue;
exports.formatDurationValue = formatDurationValue;
exports.formatMetricValue = formatMetricValue;
exports.getColumnLabel = getColumnLabel;
exports.getFirstAndLastNumericValues = getFirstAndLastNumericValues;
exports.getFirstMetricRawValue = getFirstMetricRawValue;
exports.getLatestNumericSparklineDatum = getLatestNumericSparklineDatum;
exports.getMetricLabelSafe = getMetricLabelSafe;
exports.getPreviousAndLatestNumericValues = getPreviousAndLatestNumericValues;
exports.getPrimaryMetric = getPrimaryMetric;
exports.hasMeaningfulValue = hasMeaningfulValue;
exports.isDurationLike = isDurationLike;
exports.parseBoundedNumber = parseBoundedNumber;
exports.parseDurationInSeconds = parseDurationInSeconds;
exports.parsePositiveInteger = parsePositiveInteger;
exports.parseTimestamp = parseTimestamp;
exports.resolveTimeField = resolveTimeField;
exports.resolveValueType = resolveValueType;
exports.toNumber = toNumber;
exports.toNumericMetricValue = toNumericMetricValue;
exports.uniqueMetrics = uniqueMetrics;
var _core = require("@superset-ui/core");
var _constants = require("./constants");
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

function normalizeLookupKey(value) {
  return value.replace(/[`"'[\]]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
}
function formatNumberWithPrecision(value, precision, showPositivePlusSign) {
  if (showPositivePlusSign === void 0) {
    showPositivePlusSign = false;
  }
  var numeric = Number(value);
  var absValue = Math.abs(numeric);
  var formatted = absValue.toLocaleString(undefined, {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision
  });
  if (numeric < 0) {
    return "-" + formatted;
  }
  if (showPositivePlusSign && numeric > 0) {
    return "+" + formatted;
  }
  return formatted;
}
function getNumericCandidateKeys(row, excludedKeys) {
  return Object.keys(row).filter(key => {
    if (excludedKeys.includes(key)) {
      return false;
    }
    return toNumber(row[key]) !== null || isDurationLike(row[key]);
  });
}
function getPercentDisplayValue(value) {
  return Math.abs(value) <= 1 ? value * 100 : value;
}
function formatDurationCore(totalSeconds) {
  var absSeconds = Math.abs(Math.round(totalSeconds));
  var hours = Math.floor(absSeconds / 3600);
  var minutes = Math.floor(absSeconds % 3600 / 60);
  var seconds = absSeconds % 60;
  return [hours, minutes, seconds].map((part, index) => index === 0 ? String(part) : String(part).padStart(2, '0')).join(':');
}
function getColumnLabel(column) {
  var _ref, _column$label;
  if (!column) {
    return undefined;
  }
  if (typeof column === 'string') {
    return column;
  }
  return (_ref = (_column$label = column.label) != null ? _column$label : column.column_name) != null ? _ref : column.sqlExpression;
}
function getPrimaryMetric(metrics, metric) {
  if (Array.isArray(metrics)) {
    return metrics.find(Boolean);
  }
  if (metrics) {
    return metrics;
  }
  return metric != null ? metric : undefined;
}
function getMetricLabelSafe(metric) {
  return metric ? (0, _core.getMetricLabel)(metric) : 'Metric';
}
function uniqueMetrics(metrics) {
  var seen = new Set();
  return metrics.reduce((accumulator, metric) => {
    if (!metric) {
      return accumulator;
    }
    var key = getMetricLabelSafe(metric);
    if (seen.has(key)) {
      return accumulator;
    }
    seen.add(key);
    accumulator.push(metric);
    return accumulator;
  }, []);
}
function hasMeaningfulValue(value) {
  return value !== null && typeof value !== 'undefined' && value !== '';
}
function toNumber(value) {
  if (!hasMeaningfulValue(value)) {
    return null;
  }
  var numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}
function parsePositiveInteger(value, fallback, options) {
  var _options$min, _options$max;
  if (options === void 0) {
    options = {};
  }
  var numeric = toNumber(value);
  if (numeric === null) {
    return fallback;
  }
  var min = (_options$min = options.min) != null ? _options$min : 0;
  var max = (_options$max = options.max) != null ? _options$max : Number.MAX_SAFE_INTEGER;
  return Math.max(min, Math.min(max, Math.round(numeric)));
}
function parseBoundedNumber(value, fallback, options) {
  var _options$min2, _options$max2;
  if (options === void 0) {
    options = {};
  }
  var numeric = toNumber(value);
  if (numeric === null) {
    return fallback;
  }
  var min = (_options$min2 = options.min) != null ? _options$min2 : -Number.MAX_SAFE_INTEGER;
  var max = (_options$max2 = options.max) != null ? _options$max2 : Number.MAX_SAFE_INTEGER;
  return Math.max(min, Math.min(max, numeric));
}
function parseTimestamp(value) {
  if (!hasMeaningfulValue(value)) {
    return null;
  }
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.getTime();
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value > 1e12 ? value : value * 1000;
  }
  var timestamp = Date.parse(String(value));
  return Number.isNaN(timestamp) ? null : timestamp;
}
function isDurationLike(value) {
  if (!hasMeaningfulValue(value) || typeof value !== 'string') {
    return false;
  }
  var parts = value.trim().split(':');
  if (parts.length !== 2 && parts.length !== 3) {
    return false;
  }
  return parts.every(part => /^\d+$/.test(part));
}
function parseDurationInSeconds(value, durationUnit) {
  if (!hasMeaningfulValue(value)) {
    return null;
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return durationUnit === 'milliseconds' ? value / 1000 : value;
  }
  if (typeof value === 'string') {
    var trimmed = value.trim();
    var directNumber = toNumber(trimmed);
    if (directNumber !== null) {
      return durationUnit === 'milliseconds' ? directNumber / 1000 : directNumber;
    }
    if (!isDurationLike(trimmed)) {
      return null;
    }
    var parts = trimmed.split(':').map(part => Number(part));
    if (parts.some(part => !Number.isFinite(part))) {
      return null;
    }
    if (parts.length === 2) {
      var [_minutes, _seconds] = parts;
      return _minutes * 60 + _seconds;
    }
    var [hours, minutes, seconds] = parts;
    return hours * 3600 + minutes * 60 + seconds;
  }
  return null;
}
function formatDurationValue(value, durationUnit, showPositivePlusSign) {
  if (showPositivePlusSign === void 0) {
    showPositivePlusSign = false;
  }
  var totalSeconds = parseDurationInSeconds(value, durationUnit);
  if (totalSeconds === null) {
    return '--';
  }
  var sign = totalSeconds < 0 ? '-' : totalSeconds > 0 && showPositivePlusSign ? '+' : '';
  return "" + sign + formatDurationCore(totalSeconds);
}
function findRecordValue(row, label, options) {
  var _options$excludedKeys;
  if (options === void 0) {
    options = {};
  }
  if (!label) {
    return undefined;
  }
  var excludedKeys = (_options$excludedKeys = options.excludedKeys) != null ? _options$excludedKeys : [];
  if (Object.prototype.hasOwnProperty.call(row, label)) {
    return row[label];
  }
  var normalizedLabel = normalizeLookupKey(label);
  var matchingKey = Object.keys(row).find(key => normalizeLookupKey(key) === normalizedLabel);
  if (matchingKey) {
    return row[matchingKey];
  }
  if (!options.allowSingleNumericFallback) {
    return undefined;
  }
  var numericCandidateKeys = getNumericCandidateKeys(row, excludedKeys);
  if (numericCandidateKeys.length === 1) {
    return row[numericCandidateKeys[0]];
  }
  return undefined;
}
function getFirstMetricRawValue(rows, label, excludedKeys) {
  if (excludedKeys === void 0) {
    excludedKeys = [];
  }
  return rows.reduce((accumulator, row) => {
    if (hasMeaningfulValue(accumulator)) {
      return accumulator;
    }
    return findRecordValue(row, label, {
      excludedKeys,
      allowSingleNumericFallback: false
    });
  }, undefined);
}
function resolveValueType(valueTypeMode, options) {
  var _options$metricLabel, _options$valueSuffix;
  if (valueTypeMode && valueTypeMode !== 'auto') {
    return valueTypeMode;
  }
  if (isDurationLike(options.rawValue)) {
    return 'duration';
  }
  var hint = (((_options$metricLabel = options.metricLabel) != null ? _options$metricLabel : '') + " " + ((_options$valueSuffix = options.valueSuffix) != null ? _options$valueSuffix : '')).toLowerCase();
  if (hint.includes('%') || hint.includes('percent') || hint.includes('pct')) {
    return 'percent';
  }
  return 'number';
}
function toNumericMetricValue(value, valueType, durationUnit) {
  if (valueType === 'duration') {
    return parseDurationInSeconds(value, durationUnit);
  }
  return toNumber(value);
}
function formatMetricValue(value, options) {
  var _options$prefix, _options$suffix, _options$decimalPreci, _options$numberFormat;
  var prefix = (_options$prefix = options.prefix) != null ? _options$prefix : '';
  var suffix = (_options$suffix = options.suffix) != null ? _options$suffix : '';
  var precision = (_options$decimalPreci = options.decimalPrecision) != null ? _options$decimalPreci : _constants.DEFAULT_DECIMAL_PRECISION;
  var numberFormat = (_options$numberFormat = options.numberFormat) == null ? void 0 : _options$numberFormat.trim();
  if (!hasMeaningfulValue(value)) {
    return '--';
  }
  if (options.valueType === 'duration') {
    var durationText = formatDurationValue(value, options.durationUnit, options.showPositivePlusSign);
    return durationText === '--' ? durationText : "" + prefix + durationText + suffix;
  }
  var numeric = toNumber(value);
  if (numeric === null) {
    return "" + prefix + String(value) + suffix;
  }
  if (options.valueType === 'percent') {
    var percentValue = options.scalePercent === false ? numeric : getPercentDisplayValue(numeric);
    return "" + prefix + formatNumberWithPrecision(percentValue, precision, options.showPositivePlusSign) + "%" + suffix;
  }
  var useSupersetFormatter = Boolean(numberFormat && numberFormat !== 'SMART_NUMBER');
  var baseValue = useSupersetFormatter ? (0, _core.getNumberFormatter)(numberFormat)(numeric) : formatNumberWithPrecision(numeric, precision, options.showPositivePlusSign);
  return "" + prefix + baseValue + suffix;
}
function resolveTimeField(rows, configuredLabel) {
  var candidates = ['__timestamp', configuredLabel].filter(value => Boolean(value));
  var exactMatch = candidates.find(candidate => rows.some(row => parseTimestamp(row[candidate]) !== null));
  if (exactMatch) {
    return exactMatch;
  }
  var heuristicMatch = Array.from(new Set(rows.flatMap(row => Object.keys(row)))).find(key => /(timestamp|time|date|ds)$/i.test(key) && rows.some(row => parseTimestamp(row[key]) !== null));
  return heuristicMatch;
}
function buildSparklineData(rows, options) {
  var invalidTimestampRows = 0;
  var data = rows.map(row => {
    var timestamp = options.timeField ? parseTimestamp(row[options.timeField]) : null;
    if (timestamp === null) {
      invalidTimestampRows += 1;
      return null;
    }
    var rawValue = findRecordValue(row, options.metricLabel, {
      excludedKeys: options.timeField ? [options.timeField] : [],
      allowSingleNumericFallback: false
    });
    return {
      timestamp,
      value: toNumericMetricValue(rawValue, options.valueType, options.durationUnit),
      rawValue,
      originalRow: row
    };
  }).filter(datum => datum !== null).sort((left, right) => left.timestamp - right.timestamp);
  return {
    data,
    invalidTimestampRows
  };
}
function aggregateSparklineValue(data, aggregationMode) {
  var numericValues = data.map(datum => datum.value).filter(value => value !== null && Number.isFinite(value));
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
function getLatestNumericSparklineDatum(data) {
  return [...data].reverse().find(datum => datum.value !== null && Number.isFinite(datum.value));
}
function getFirstAndLastNumericValues(data) {
  var numericValues = data.map(datum => datum.value).filter(value => value !== null && Number.isFinite(value));
  if (numericValues.length < 2) {
    return null;
  }
  return [numericValues[0], numericValues[numericValues.length - 1]];
}
function getPreviousAndLatestNumericValues(data) {
  var numericValues = data.map(datum => datum.value).filter(value => value !== null && Number.isFinite(value));
  if (numericValues.length < 2) {
    return null;
  }
  return [numericValues[numericValues.length - 2], numericValues[numericValues.length - 1]];
}
function determineTrendState(comparableValue, trendMeaning, neutralThreshold) {
  if (comparableValue === null || !Number.isFinite(comparableValue)) {
    return 'missing';
  }
  if (Math.abs(comparableValue) <= neutralThreshold) {
    return 'neutral';
  }
  var isPositive = comparableValue > 0;
  if (trendMeaning === 'lower_is_better') {
    return isPositive ? 'bad' : 'good';
  }
  return isPositive ? 'good' : 'bad';
}
function determineTrendDirection(numericValue, neutralThreshold) {
  if (numericValue === null || !Number.isFinite(numericValue)) {
    return 'missing';
  }
  if (Math.abs(numericValue) <= neutralThreshold) {
    return 'neutral';
  }
  return numericValue > 0 ? 'positive' : 'negative';
}
function calculatePercentChange(baseline, latest) {
  if (!Number.isFinite(baseline) || !Number.isFinite(latest)) {
    return null;
  }
  if (baseline === 0) {
    return latest === 0 ? 0 : null;
  }
  return (latest - baseline) / Math.abs(baseline) * 100;
}
function computeTrendResult(options) {
  var _options$decimalPreci2, _options$decimalPreci3, _options$labelPrefix;
  var numericValue = null;
  var comparableValue = null;
  var isPercent = false;
  var formatValue = options.secondaryValue;
  switch (options.mode) {
    case 'first_vs_last_percent':
      {
        var pair = getFirstAndLastNumericValues(options.sparklineData);
        numericValue = pair ? calculatePercentChange(pair[0], pair[1]) : null;
        comparableValue = numericValue;
        formatValue = numericValue;
        isPercent = true;
        break;
      }
    case 'previous_vs_latest_percent':
      {
        var _pair = getPreviousAndLatestNumericValues(options.sparklineData);
        numericValue = _pair ? calculatePercentChange(_pair[0], _pair[1]) : null;
        comparableValue = numericValue;
        formatValue = numericValue;
        isPercent = true;
        break;
      }
    case 'absolute_difference':
      {
        var _pair2 = getPreviousAndLatestNumericValues(options.sparklineData);
        numericValue = _pair2 ? _pair2[1] - _pair2[0] : null;
        comparableValue = numericValue;
        formatValue = numericValue;
        break;
      }
    case 'secondary_metric':
    default:
      numericValue = options.secondaryNumericValue;
      comparableValue = numericValue;
      formatValue = options.secondaryValue;
      break;
  }
  var state = determineTrendState(comparableValue, options.trendMeaning, options.neutralThreshold);
  var direction = determineTrendDirection(numericValue, options.neutralThreshold);
  var formattedValue = numericValue === null ? '--' : isPercent ? formatMetricValue(formatValue, {
    valueType: 'percent',
    decimalPrecision: (_options$decimalPreci2 = options.decimalPrecision) != null ? _options$decimalPreci2 : _constants.DEFAULT_DECIMAL_PRECISION,
    durationUnit: options.durationUnit,
    showPositivePlusSign: options.showPositivePlusSign,
    scalePercent: false
  }) : formatMetricValue(formatValue, {
    valueType: options.valueType,
    numberFormat: options.numberFormat,
    decimalPrecision: (_options$decimalPreci3 = options.decimalPrecision) != null ? _options$decimalPreci3 : _constants.DEFAULT_DECIMAL_PRECISION,
    durationUnit: options.durationUnit,
    showPositivePlusSign: options.showPositivePlusSign
  });
  var prefix = ((_options$labelPrefix = options.labelPrefix) == null ? void 0 : _options$labelPrefix.trim()) || _constants.DEFAULT_TREND_LABEL_PREFIX;
  return {
    label: options.showTrendLabel === false ? formattedValue : prefix + " " + formattedValue,
    formattedValue,
    numericValue,
    state,
    direction,
    isPercent
  };
}
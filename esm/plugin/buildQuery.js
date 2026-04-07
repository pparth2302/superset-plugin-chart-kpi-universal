function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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

import { buildQueryContext } from '@superset-ui/core';
import { DEFAULT_KPI_SOURCE_MODE, DEFAULT_ROW_LIMIT, DEFAULT_TREND_CALCULATION_MODE } from '../constants';
import { getColumnLabel, getPrimaryMetric, parsePositiveInteger, uniqueMetrics } from '../utils';
export default function buildQuery(formData) {
  var _fd$secondary_metric, _fd$granularity_sqla, _fd$show_sparkline, _fd$enable_trend, _fd$kpi_source_mode, _fd$trend_calculation;
  var fd = formData;
  var primaryMetric = getPrimaryMetric(fd.metrics, fd.metric);
  var secondaryMetric = (_fd$secondary_metric = fd.secondary_metric) != null ? _fd$secondary_metric : undefined;
  var aggregateMetrics = uniqueMetrics([primaryMetric, secondaryMetric]);
  var rowLimit = parsePositiveInteger(fd.row_limit, DEFAULT_ROW_LIMIT, {
    min: 1
  });
  var timeColumnLabel = getColumnLabel((_fd$granularity_sqla = fd.granularity_sqla) != null ? _fd$granularity_sqla : fd.granularity);
  var showSparkline = (_fd$show_sparkline = fd.show_sparkline) != null ? _fd$show_sparkline : true;
  var enableTrend = (_fd$enable_trend = fd.enable_trend) != null ? _fd$enable_trend : true;
  var kpiSourceMode = (_fd$kpi_source_mode = fd.kpi_source_mode) != null ? _fd$kpi_source_mode : DEFAULT_KPI_SOURCE_MODE;
  var trendCalculationMode = (_fd$trend_calculation = fd.trend_calculation_mode) != null ? _fd$trend_calculation : DEFAULT_TREND_CALCULATION_MODE;
  var shouldQueryTimeseries = Boolean(timeColumnLabel && primaryMetric && (showSparkline || kpiSourceMode === 'time_series' || enableTrend && trendCalculationMode !== 'secondary_metric'));
  return buildQueryContext(formData, baseQueryObject => {
    var queries = [_extends({}, baseQueryObject, {
      columns: [],
      metrics: aggregateMetrics,
      orderby: [],
      row_limit: 1,
      series_columns: [],
      is_timeseries: false
    })];
    if (shouldQueryTimeseries && primaryMetric) {
      var orderby = timeColumnLabel ? [[timeColumnLabel, true]] : [];
      queries.push(_extends({}, baseQueryObject, {
        columns: [],
        metrics: [primaryMetric],
        orderby,
        row_limit: rowLimit,
        series_columns: [],
        is_timeseries: true
      }));
    }
    return queries;
  });
}
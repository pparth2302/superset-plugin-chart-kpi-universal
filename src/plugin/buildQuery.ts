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
import type {
  QueryFormData,
  QueryFormMetric,
  QueryFormOrderBy,
  QueryObject,
} from '@superset-ui/core';
import {
  DEFAULT_KPI_SOURCE_MODE,
  DEFAULT_ROW_LIMIT,
  DEFAULT_TREND_CALCULATION_MODE,
} from '../constants';
import type { KpiUniversalChartFormData } from '../types';
import {
  getColumnLabel,
  getPrimaryMetric,
  parsePositiveInteger,
  uniqueMetrics,
} from '../utils';

export default function buildQuery(formData: QueryFormData) {
  const fd = formData as KpiUniversalChartFormData;
  const primaryMetric = getPrimaryMetric(fd.metrics, fd.metric) as
    | QueryFormMetric
    | undefined;
  const secondaryMetric = fd.secondary_metric ?? undefined;
  const aggregateMetrics = uniqueMetrics([primaryMetric, secondaryMetric]);
  const rowLimit = parsePositiveInteger(fd.row_limit, DEFAULT_ROW_LIMIT, { min: 1 });
  const timeColumnLabel = getColumnLabel(fd.granularity_sqla ?? fd.granularity);
  const showSparkline = fd.show_sparkline ?? true;
  const enableTrend = fd.enable_trend ?? true;
  const kpiSourceMode = fd.kpi_source_mode ?? DEFAULT_KPI_SOURCE_MODE;
  const trendCalculationMode =
    fd.trend_calculation_mode ?? DEFAULT_TREND_CALCULATION_MODE;
  const shouldQueryTimeseries = Boolean(
    timeColumnLabel &&
      primaryMetric &&
      (showSparkline ||
        kpiSourceMode === 'time_series' ||
        (enableTrend && trendCalculationMode !== 'secondary_metric')),
  );

  return buildQueryContext(formData, (baseQueryObject: QueryObject) => {
    const queries: QueryObject[] = [
      {
        ...baseQueryObject,
        columns: [],
        metrics: aggregateMetrics,
        orderby: [],
        row_limit: 1,
        series_columns: [],
        is_timeseries: false,
      },
    ];

    if (shouldQueryTimeseries && primaryMetric) {
      const orderby: QueryFormOrderBy[] = timeColumnLabel
        ? [[timeColumnLabel, true]]
        : [];

      queries.push({
        ...baseQueryObject,
        columns: [],
        metrics: [primaryMetric],
        orderby,
        row_limit: rowLimit,
        series_columns: [],
        is_timeseries: true,
      });
    }

    return queries;
  });
}

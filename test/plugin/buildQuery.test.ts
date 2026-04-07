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

import buildQuery from '../../src/plugin/buildQuery';

describe('Universal KPI Card buildQuery', () => {
  it('builds aggregate and time-series queries when a sparkline-compatible time column is configured', () => {
    const queryContext = buildQuery({
      datasource: '5__table',
      granularity_sqla: 'event_time',
      metric: 'AVG(oee)',
      secondary_metric: 'SUM(trend_metric)',
      show_sparkline: true,
      enable_trend: true,
      trend_calculation_mode: 'previous_vs_latest_percent',
      row_limit: 250,
      viz_type: 'kpi_universal',
    } as any);

    expect(queryContext.queries).toHaveLength(2);
    expect(queryContext.queries[0].metrics).toEqual([
      'AVG(oee)',
      'SUM(trend_metric)',
    ]);
    expect(queryContext.queries[0].is_timeseries).toBe(false);
    expect(queryContext.queries[0].row_limit).toBe(1);
    expect(queryContext.queries[1].metrics).toEqual(['AVG(oee)']);
    expect(queryContext.queries[1].is_timeseries).toBe(true);
    expect(queryContext.queries[1].orderby).toEqual([]);
    expect(queryContext.queries[1].row_limit).toBe(250);
  });

  it('builds only one aggregate query when direct metric mode does not need time-series data', () => {
    const queryContext = buildQuery({
      datasource: '5__table',
      metric: 'SUM(reject_count)',
      kpi_source_mode: 'direct_metric',
      show_sparkline: false,
      enable_trend: true,
      trend_calculation_mode: 'secondary_metric',
      viz_type: 'kpi_universal',
    } as any);

    expect(queryContext.queries).toHaveLength(1);
    expect(queryContext.queries[0].is_timeseries).toBe(false);
    expect(queryContext.queries[0].metrics).toEqual(['SUM(reject_count)']);
  });
});

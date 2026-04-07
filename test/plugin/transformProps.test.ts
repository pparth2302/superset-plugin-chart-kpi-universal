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
import transformProps from '../../src/plugin/transformProps';

describe('Universal KPI Card transformProps', () => {
  it('computes a time-series-derived KPI, trend label, and sparkline data', () => {
    const chartProps = new ChartProps({
      width: 320,
      height: 180,
      formData: {
        metric: 'AVG(oee)',
        granularity_sqla: 'event_time',
        kpi_source_mode: 'time_series',
        kpi_aggregation_mode: 'average',
        value_type_mode: 'percent',
        decimal_precision: 1,
        trend_calculation_mode: 'previous_vs_latest_percent',
        trend_meaning: 'higher_is_better',
        trend_label_prefix: 'Trend',
      },
      queriesData: [
        {
          data: [{ 'AVG(oee)': 61.2 }],
        },
        {
          data: [
            { __timestamp: '2026-04-01T00:00:00Z', 'AVG(oee)': 50 },
            { __timestamp: '2026-04-02T00:00:00Z', 'AVG(oee)': 58 },
            { __timestamp: '2026-04-03T00:00:00Z', 'AVG(oee)': 59.3 },
          ],
        },
      ],
      theme: {},
    } as any);

    const props = transformProps(chartProps);

    expect(props.formattedValue).toBe('55.8%');
    expect(props.valueSource).toBe('time_series');
    expect(props.sparklineData).toHaveLength(3);
    expect(props.trend?.label).toBe('Trend +2.2%');
    expect(props.trend?.state).toBe('good');
    expect(props.noData).toBe(false);
  });

  it('formats direct metric durations and secondary metric trend values', () => {
    const chartProps = new ChartProps({
      width: 320,
      height: 180,
      formData: {
        metric: 'Downtime',
        secondary_metric: 'Trend Delta',
        kpi_source_mode: 'direct_metric',
        value_type_mode: 'duration',
        duration_unit: 'seconds',
        trend_calculation_mode: 'secondary_metric',
        trend_meaning: 'lower_is_better',
      },
      queriesData: [
        {
          data: [{ Downtime: '21:00:28', 'Trend Delta': -300 }],
        },
      ],
      theme: {},
    } as any);

    const props = transformProps(chartProps);

    expect(props.formattedValue).toBe('21:00:28');
    expect(props.valueSource).toBe('aggregate');
    expect(props.trend?.label).toBe('Trend -0:05:00');
    expect(props.trend?.state).toBe('good');
    expect(props.noData).toBe(false);
  });
});

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

import type { ControlPanelConfig } from '@superset-ui/chart-controls';
import { sections, sharedControls } from '@superset-ui/chart-controls';
import { t } from '@superset-ui/core';
import {
  DEFAULT_BORDER_RADIUS,
  DEFAULT_CARD_PADDING,
  DEFAULT_DECIMAL_PRECISION,
  DEFAULT_DURATION_UNIT,
  DEFAULT_KPI_AGGREGATION_MODE,
  DEFAULT_KPI_SOURCE_MODE,
  DEFAULT_KPI_VALUE_FONT_SIZE,
  DEFAULT_ROW_LIMIT,
  DEFAULT_SPARKLINE_FILL_OPACITY,
  DEFAULT_SPARKLINE_LINE_WIDTH,
  DEFAULT_TITLE_FONT_SIZE,
  DEFAULT_TREND_CALCULATION_MODE,
  DEFAULT_TREND_FONT_SIZE,
  DEFAULT_TREND_LABEL_PREFIX,
  DEFAULT_TREND_MEANING,
  DEFAULT_VALUE_COLUMN_WIDTH_PERCENT,
} from '../constants';

const granularityControl = sharedControls.granularity_sqla || sharedControls.series || {};
const timeGrainControl = sharedControls.time_grain_sqla || {};
const metricControl = sharedControls.metric || sharedControls.metrics || {};

const controlPanel: ControlPanelConfig = {
  controlPanelSections: [
    {
      label: t('Query'),
      expanded: true,
      tabOverride: 'data',
      controlSetRows: [
        [
          {
            name: 'granularity_sqla',
            config: {
              ...granularityControl,
              label: t('Time column'),
              clearable: true,
              description: t(
                'Optional temporal column used for sparkline generation and time-series-derived KPI calculations.',
              ),
            },
          },
          {
            name: 'time_grain_sqla',
            config: {
              ...timeGrainControl,
              label: t('Time grain'),
              clearable: true,
              description: t('Optional time grain for the sparkline query.'),
            },
          },
        ],
        [
          {
            name: 'metric',
            config: {
              ...metricControl,
              label: t('Primary KPI metric'),
              clearable: false,
              description: t('Required metric used for the KPI value and sparkline.'),
            },
          },
          {
            name: 'secondary_metric',
            config: {
              ...metricControl,
              label: t('Secondary trend metric'),
              clearable: true,
              description: t(
                'Optional aggregate metric used when trend mode is set to secondary metric.',
              ),
            },
          },
        ],
        [
          {
            name: 'kpi_source_mode',
            config: {
              type: 'SelectControl',
              label: t('KPI source mode'),
              default: DEFAULT_KPI_SOURCE_MODE,
              clearable: false,
              renderTrigger: true,
              description: t(
                'Choose whether the large KPI value is derived from the time series or from the aggregate metric query.',
              ),
              choices: [
                ['time_series', t('Time series')],
                ['direct_metric', t('Direct metric')],
              ],
            },
          },
          {
            name: 'row_limit',
            config: {
              type: 'TextControl',
              label: t('Row limit'),
              default: DEFAULT_ROW_LIMIT,
              isInt: true,
              description: t('Maximum number of time-series rows fetched for the sparkline.'),
            },
          },
        ],
        ['adhoc_filters'],
      ],
    },
    {
      label: t('Customize'),
      expanded: true,
      tabOverride: 'customize',
      controlSetRows: [
        [
          {
            name: 'card_title_override',
            config: {
              type: 'TextControl',
              label: t('Card title override'),
              renderTrigger: true,
              description: t(
                'Optional title override. If left empty, the primary metric label is used.',
              ),
            },
          },
        ],
        [
          {
            name: 'show_title',
            config: {
              type: 'CheckboxControl',
              label: t('Show title'),
              default: true,
              renderTrigger: true,
            },
          },
          {
            name: 'show_info_icon',
            config: {
              type: 'CheckboxControl',
              label: t('Show info icon'),
              default: false,
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'info_tooltip_text',
            config: {
              type: 'TextControl',
              label: t('Info tooltip text'),
              renderTrigger: true,
              description: t('Optional tooltip text shown when the info icon is hovered.'),
            },
          },
        ],
        [
          {
            name: 'number_format',
            config: {
              type: 'TextControl',
              label: t('Number format'),
              default: 'SMART_NUMBER',
              renderTrigger: true,
              description: t(
                'Superset number format string used for numeric values when Value type mode is number.',
              ),
            },
          },
          {
            name: 'decimal_precision',
            config: {
              type: 'TextControl',
              label: t('Decimal precision'),
              default: DEFAULT_DECIMAL_PRECISION,
              isInt: true,
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'value_prefix',
            config: {
              type: 'TextControl',
              label: t('Value prefix'),
              renderTrigger: true,
            },
          },
          {
            name: 'value_suffix',
            config: {
              type: 'TextControl',
              label: t('Value suffix'),
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'value_type_mode',
            config: {
              type: 'SelectControl',
              label: t('Value type mode'),
              default: 'auto',
              clearable: false,
              renderTrigger: true,
              choices: [
                ['auto', t('Auto')],
                ['number', t('Number')],
                ['percent', t('Percent')],
                ['duration', t('Duration')],
              ],
            },
          },
          {
            name: 'duration_unit',
            config: {
              type: 'SelectControl',
              label: t('Duration unit'),
              default: DEFAULT_DURATION_UNIT,
              clearable: false,
              renderTrigger: true,
              description: t(
                'Used when duration values are numeric rather than already formatted as HH:MM:SS.',
              ),
              choices: [
                ['seconds', t('Seconds')],
                ['milliseconds', t('Milliseconds')],
              ],
            },
          },
        ],
        [
          {
            name: 'kpi_aggregation_mode',
            config: {
              type: 'SelectControl',
              label: t('KPI aggregation mode'),
              default: DEFAULT_KPI_AGGREGATION_MODE,
              clearable: false,
              renderTrigger: true,
              description: t(
                'Applied when KPI source mode is set to time series. Direct metric mode uses the aggregate query result directly.',
              ),
              choices: [
                ['latest', t('Latest')],
                ['sum', t('Sum')],
                ['average', t('Average')],
                ['min', t('Min')],
                ['max', t('Max')],
              ],
            },
          },
        ],
        [
          {
            name: 'enable_trend',
            config: {
              type: 'CheckboxControl',
              label: t('Enable trend'),
              default: true,
              renderTrigger: true,
            },
          },
          {
            name: 'show_trend_label',
            config: {
              type: 'CheckboxControl',
              label: t('Show trend label'),
              default: true,
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'trend_label_prefix',
            config: {
              type: 'TextControl',
              label: t('Trend label prefix'),
              default: DEFAULT_TREND_LABEL_PREFIX,
              renderTrigger: true,
            },
          },
          {
            name: 'show_positive_plus_sign',
            config: {
              type: 'CheckboxControl',
              label: t('Show plus sign for positive values'),
              default: true,
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'trend_calculation_mode',
            config: {
              type: 'SelectControl',
              label: t('Trend calculation mode'),
              default: DEFAULT_TREND_CALCULATION_MODE,
              clearable: false,
              renderTrigger: true,
              choices: [
                ['first_vs_last_percent', t('First vs last percent')],
                ['previous_vs_latest_percent', t('Previous vs latest percent')],
                ['absolute_difference', t('Absolute difference')],
                ['secondary_metric', t('Secondary metric')],
              ],
            },
          },
          {
            name: 'trend_meaning',
            config: {
              type: 'SelectControl',
              label: t('Trend meaning'),
              default: DEFAULT_TREND_MEANING,
              clearable: false,
              renderTrigger: true,
              choices: [
                ['higher_is_better', t('Higher is better')],
                ['lower_is_better', t('Lower is better')],
              ],
            },
          },
        ],
        [
          {
            name: 'neutral_threshold',
            config: {
              type: 'TextControl',
              label: t('Neutral threshold'),
              default: 0,
              renderTrigger: true,
              description: t(
                'Absolute change at or below this threshold is treated as neutral.',
              ),
            },
          },
        ],
        [
          {
            name: 'show_sparkline',
            config: {
              type: 'CheckboxControl',
              label: t('Show sparkline'),
              default: true,
              renderTrigger: true,
            },
          },
          {
            name: 'sparkline_smooth',
            config: {
              type: 'CheckboxControl',
              label: t('Smooth sparkline'),
              default: true,
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'sparkline_type',
            config: {
              type: 'SelectControl',
              label: t('Sparkline type'),
              default: 'area',
              clearable: false,
              renderTrigger: true,
              choices: [
                ['area', t('Area')],
                ['line', t('Line')],
              ],
            },
          },
          {
            name: 'sparkline_fill_opacity',
            config: {
              type: 'TextControl',
              label: t('Sparkline fill opacity'),
              default: DEFAULT_SPARKLINE_FILL_OPACITY,
              renderTrigger: true,
            },
          },
          {
            name: 'sparkline_line_width',
            config: {
              type: 'TextControl',
              label: t('Sparkline line width'),
              default: DEFAULT_SPARKLINE_LINE_WIDTH,
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'card_padding',
            config: {
              type: 'TextControl',
              label: t('Padding'),
              default: DEFAULT_CARD_PADDING,
              isInt: true,
              renderTrigger: true,
            },
          },
          {
            name: 'border_radius',
            config: {
              type: 'TextControl',
              label: t('Border radius'),
              default: DEFAULT_BORDER_RADIUS,
              isInt: true,
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'show_border',
            config: {
              type: 'CheckboxControl',
              label: t('Show border'),
              default: true,
              renderTrigger: true,
            },
          },
          {
            name: 'show_shadow',
            config: {
              type: 'CheckboxControl',
              label: t('Show shadow'),
              default: false,
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'title_font_size',
            config: {
              type: 'TextControl',
              label: t('Title font size'),
              default: DEFAULT_TITLE_FONT_SIZE,
              isInt: true,
              renderTrigger: true,
            },
          },
          {
            name: 'kpi_value_font_size',
            config: {
              type: 'TextControl',
              label: t('KPI value font size'),
              default: DEFAULT_KPI_VALUE_FONT_SIZE,
              isInt: true,
              renderTrigger: true,
            },
          },
          {
            name: 'trend_font_size',
            config: {
              type: 'TextControl',
              label: t('Trend font size'),
              default: DEFAULT_TREND_FONT_SIZE,
              isInt: true,
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'value_column_width_percent',
            config: {
              type: 'TextControl',
              label: t('Value column width %'),
              default: DEFAULT_VALUE_COLUMN_WIDTH_PERCENT,
              isInt: true,
              renderTrigger: true,
              description: t(
                'Controls the left-versus-right width split between the KPI text and the trend/sparkline area.',
              ),
            },
          },
        ],
      ],
    },
    {
      ...sections.annotationsAndLayersControls,
      tabOverride: 'data',
    },
    {
      ...sections.advancedAnalyticsControls,
      tabOverride: 'data',
    },
  ],
};

export default controlPanel;

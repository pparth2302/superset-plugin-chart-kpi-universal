"use strict";

exports.__esModule = true;
exports.default = void 0;
var _chartControls = require("@superset-ui/chart-controls");
var _core = require("@superset-ui/core");
var _constants = require("../constants");
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); } /**
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
var granularityControl = _chartControls.sharedControls.granularity_sqla || _chartControls.sharedControls.series || {};
var timeGrainControl = _chartControls.sharedControls.time_grain_sqla || {};
var metricControl = _chartControls.sharedControls.metric || _chartControls.sharedControls.metrics || {};
var controlPanel = {
  controlPanelSections: [{
    label: (0, _core.t)('Query'),
    expanded: true,
    tabOverride: 'data',
    controlSetRows: [[{
      name: 'granularity_sqla',
      config: _extends({}, granularityControl, {
        label: (0, _core.t)('Time column'),
        clearable: true,
        description: (0, _core.t)('Optional temporal column used for sparkline generation and time-series-derived KPI calculations.')
      })
    }, {
      name: 'time_grain_sqla',
      config: _extends({}, timeGrainControl, {
        label: (0, _core.t)('Time grain'),
        clearable: true,
        description: (0, _core.t)('Optional time grain for the sparkline query.')
      })
    }], [{
      name: 'metric',
      config: _extends({}, metricControl, {
        label: (0, _core.t)('Primary KPI metric'),
        clearable: false,
        description: (0, _core.t)('Required metric used for the KPI value and sparkline.')
      })
    }, {
      name: 'secondary_metric',
      config: _extends({}, metricControl, {
        label: (0, _core.t)('Secondary trend metric'),
        clearable: true,
        description: (0, _core.t)('Optional aggregate metric used when trend mode is set to secondary metric.')
      })
    }], [{
      name: 'kpi_source_mode',
      config: {
        type: 'SelectControl',
        label: (0, _core.t)('KPI source mode'),
        default: _constants.DEFAULT_KPI_SOURCE_MODE,
        clearable: false,
        renderTrigger: true,
        description: (0, _core.t)('Choose whether the large KPI value is derived from the time series or from the aggregate metric query.'),
        choices: [['time_series', (0, _core.t)('Time series')], ['direct_metric', (0, _core.t)('Direct metric')]]
      }
    }, {
      name: 'row_limit',
      config: {
        type: 'TextControl',
        label: (0, _core.t)('Row limit'),
        default: _constants.DEFAULT_ROW_LIMIT,
        isInt: true,
        description: (0, _core.t)('Maximum number of time-series rows fetched for the sparkline.')
      }
    }], ['adhoc_filters']]
  }, {
    label: (0, _core.t)('Customize'),
    expanded: true,
    tabOverride: 'customize',
    controlSetRows: [[{
      name: 'card_title_override',
      config: {
        type: 'TextControl',
        label: (0, _core.t)('Card title override'),
        renderTrigger: true,
        description: (0, _core.t)('Optional title override. If left empty, the primary metric label is used.')
      }
    }], [{
      name: 'show_title',
      config: {
        type: 'CheckboxControl',
        label: (0, _core.t)('Show title'),
        default: true,
        renderTrigger: true
      }
    }, {
      name: 'show_info_icon',
      config: {
        type: 'CheckboxControl',
        label: (0, _core.t)('Show info icon'),
        default: false,
        renderTrigger: true
      }
    }], [{
      name: 'info_tooltip_text',
      config: {
        type: 'TextControl',
        label: (0, _core.t)('Info tooltip text'),
        renderTrigger: true,
        description: (0, _core.t)('Optional tooltip text shown when the info icon is hovered.')
      }
    }], [{
      name: 'number_format',
      config: {
        type: 'TextControl',
        label: (0, _core.t)('Number format'),
        default: 'SMART_NUMBER',
        renderTrigger: true,
        description: (0, _core.t)('Superset number format string used for numeric values when Value type mode is number.')
      }
    }, {
      name: 'decimal_precision',
      config: {
        type: 'TextControl',
        label: (0, _core.t)('Decimal precision'),
        default: _constants.DEFAULT_DECIMAL_PRECISION,
        isInt: true,
        renderTrigger: true
      }
    }], [{
      name: 'value_prefix',
      config: {
        type: 'TextControl',
        label: (0, _core.t)('Value prefix'),
        renderTrigger: true
      }
    }, {
      name: 'value_suffix',
      config: {
        type: 'TextControl',
        label: (0, _core.t)('Value suffix'),
        renderTrigger: true
      }
    }], [{
      name: 'value_type_mode',
      config: {
        type: 'SelectControl',
        label: (0, _core.t)('Value type mode'),
        default: 'auto',
        clearable: false,
        renderTrigger: true,
        choices: [['auto', (0, _core.t)('Auto')], ['number', (0, _core.t)('Number')], ['percent', (0, _core.t)('Percent')], ['duration', (0, _core.t)('Duration')]]
      }
    }, {
      name: 'duration_unit',
      config: {
        type: 'SelectControl',
        label: (0, _core.t)('Duration unit'),
        default: _constants.DEFAULT_DURATION_UNIT,
        clearable: false,
        renderTrigger: true,
        description: (0, _core.t)('Used when duration values are numeric rather than already formatted as HH:MM:SS.'),
        choices: [['seconds', (0, _core.t)('Seconds')], ['milliseconds', (0, _core.t)('Milliseconds')]]
      }
    }], [{
      name: 'kpi_aggregation_mode',
      config: {
        type: 'SelectControl',
        label: (0, _core.t)('KPI aggregation mode'),
        default: _constants.DEFAULT_KPI_AGGREGATION_MODE,
        clearable: false,
        renderTrigger: true,
        description: (0, _core.t)('Applied when KPI source mode is set to time series. Direct metric mode uses the aggregate query result directly.'),
        choices: [['latest', (0, _core.t)('Latest')], ['sum', (0, _core.t)('Sum')], ['average', (0, _core.t)('Average')], ['min', (0, _core.t)('Min')], ['max', (0, _core.t)('Max')]]
      }
    }], [{
      name: 'enable_trend',
      config: {
        type: 'CheckboxControl',
        label: (0, _core.t)('Enable trend'),
        default: true,
        renderTrigger: true
      }
    }, {
      name: 'show_trend_label',
      config: {
        type: 'CheckboxControl',
        label: (0, _core.t)('Show trend label'),
        default: true,
        renderTrigger: true
      }
    }], [{
      name: 'trend_label_prefix',
      config: {
        type: 'TextControl',
        label: (0, _core.t)('Trend label prefix'),
        default: _constants.DEFAULT_TREND_LABEL_PREFIX,
        renderTrigger: true
      }
    }, {
      name: 'show_positive_plus_sign',
      config: {
        type: 'CheckboxControl',
        label: (0, _core.t)('Show plus sign for positive values'),
        default: true,
        renderTrigger: true
      }
    }], [{
      name: 'trend_calculation_mode',
      config: {
        type: 'SelectControl',
        label: (0, _core.t)('Trend calculation mode'),
        default: _constants.DEFAULT_TREND_CALCULATION_MODE,
        clearable: false,
        renderTrigger: true,
        choices: [['first_vs_last_percent', (0, _core.t)('First vs last percent')], ['previous_vs_latest_percent', (0, _core.t)('Previous vs latest percent')], ['absolute_difference', (0, _core.t)('Absolute difference')], ['secondary_metric', (0, _core.t)('Secondary metric')]]
      }
    }, {
      name: 'trend_meaning',
      config: {
        type: 'SelectControl',
        label: (0, _core.t)('Trend meaning'),
        default: _constants.DEFAULT_TREND_MEANING,
        clearable: false,
        renderTrigger: true,
        choices: [['higher_is_better', (0, _core.t)('Higher is better')], ['lower_is_better', (0, _core.t)('Lower is better')]]
      }
    }], [{
      name: 'neutral_threshold',
      config: {
        type: 'TextControl',
        label: (0, _core.t)('Neutral threshold'),
        default: 0,
        renderTrigger: true,
        description: (0, _core.t)('Absolute change at or below this threshold is treated as neutral.')
      }
    }], [{
      name: 'show_sparkline',
      config: {
        type: 'CheckboxControl',
        label: (0, _core.t)('Show sparkline'),
        default: true,
        renderTrigger: true
      }
    }, {
      name: 'sparkline_smooth',
      config: {
        type: 'CheckboxControl',
        label: (0, _core.t)('Smooth sparkline'),
        default: true,
        renderTrigger: true
      }
    }], [{
      name: 'sparkline_type',
      config: {
        type: 'SelectControl',
        label: (0, _core.t)('Sparkline type'),
        default: 'area',
        clearable: false,
        renderTrigger: true,
        choices: [['area', (0, _core.t)('Area')], ['line', (0, _core.t)('Line')]]
      }
    }, {
      name: 'sparkline_fill_opacity',
      config: {
        type: 'TextControl',
        label: (0, _core.t)('Sparkline fill opacity'),
        default: _constants.DEFAULT_SPARKLINE_FILL_OPACITY,
        renderTrigger: true
      }
    }, {
      name: 'sparkline_line_width',
      config: {
        type: 'TextControl',
        label: (0, _core.t)('Sparkline line width'),
        default: _constants.DEFAULT_SPARKLINE_LINE_WIDTH,
        renderTrigger: true
      }
    }], [{
      name: 'card_padding',
      config: {
        type: 'TextControl',
        label: (0, _core.t)('Padding'),
        default: _constants.DEFAULT_CARD_PADDING,
        isInt: true,
        renderTrigger: true
      }
    }, {
      name: 'border_radius',
      config: {
        type: 'TextControl',
        label: (0, _core.t)('Border radius'),
        default: _constants.DEFAULT_BORDER_RADIUS,
        isInt: true,
        renderTrigger: true
      }
    }], [{
      name: 'show_border',
      config: {
        type: 'CheckboxControl',
        label: (0, _core.t)('Show border'),
        default: true,
        renderTrigger: true
      }
    }, {
      name: 'show_shadow',
      config: {
        type: 'CheckboxControl',
        label: (0, _core.t)('Show shadow'),
        default: false,
        renderTrigger: true
      }
    }], [{
      name: 'title_font_size',
      config: {
        type: 'TextControl',
        label: (0, _core.t)('Title font size'),
        default: _constants.DEFAULT_TITLE_FONT_SIZE,
        isInt: true,
        renderTrigger: true
      }
    }, {
      name: 'kpi_value_font_size',
      config: {
        type: 'TextControl',
        label: (0, _core.t)('KPI value font size'),
        default: _constants.DEFAULT_KPI_VALUE_FONT_SIZE,
        isInt: true,
        renderTrigger: true
      }
    }, {
      name: 'trend_font_size',
      config: {
        type: 'TextControl',
        label: (0, _core.t)('Trend font size'),
        default: _constants.DEFAULT_TREND_FONT_SIZE,
        isInt: true,
        renderTrigger: true
      }
    }], [{
      name: 'value_column_width_percent',
      config: {
        type: 'TextControl',
        label: (0, _core.t)('Value column width %'),
        default: _constants.DEFAULT_VALUE_COLUMN_WIDTH_PERCENT,
        isInt: true,
        renderTrigger: true,
        description: (0, _core.t)('Controls the left-versus-right width split between the KPI text and the trend/sparkline area.')
      }
    }]]
  }, _extends({}, _chartControls.sections.annotationsAndLayersControls, {
    tabOverride: 'data'
  }), _extends({}, _chartControls.sections.advancedAnalyticsControls, {
    tabOverride: 'data'
  })]
};
var _default = exports.default = controlPanel;
"use strict";

exports.__esModule = true;
exports.default = void 0;
var _core = require("@superset-ui/core");
var _thumbnail = _interopRequireDefault(require("./images/thumbnail.png"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
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
var _default = exports.default = new _core.ChartMetadata({
  category: 'Report',
  credits: ['https://echarts.apache.org'],
  description: 'A reusable KPI card for manufacturing dashboards with title, value, trend indicator, status dot, and sparkline.',
  name: 'Universal KPI Card',
  tags: ['kpi', 'card', 'sparkline', 'manufacturing', 'oee', 'echarts'],
  thumbnail: _thumbnail.default
});
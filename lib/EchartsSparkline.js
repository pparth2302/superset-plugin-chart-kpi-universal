"use strict";

exports.__esModule = true;
exports.default = EchartsSparkline;
var _propTypes = _interopRequireDefault(require("prop-types"));
var _react = _interopRequireWildcard(require("react"));
var echarts = _interopRequireWildcard(require("echarts"));
var _styles = require("./styles");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
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

function buildSparklineOption(props) {
  var numericPointCount = props.data.filter(point => point.value !== null).length;
  var shouldFill = props.type === 'area' || props.fillOpacity > 0;
  return {
    animation: false,
    grid: {
      left: 0,
      right: 0,
      top: 4,
      bottom: 0,
      containLabel: false
    },
    tooltip: {
      show: false
    },
    xAxis: {
      type: 'time',
      show: false,
      boundaryGap: false
    },
    yAxis: {
      type: 'value',
      show: false,
      scale: true
    },
    series: [{
      type: 'line',
      data: props.data.map(point => [point.timestamp, point.value]),
      smooth: props.smooth,
      showSymbol: numericPointCount === 1,
      symbol: 'circle',
      symbolSize: numericPointCount === 1 ? 6 : 0,
      connectNulls: true,
      silent: true,
      lineStyle: {
        color: props.lineColor,
        width: props.lineWidth
      },
      itemStyle: {
        color: props.lineColor
      },
      areaStyle: shouldFill ? {
        color: (0, _styles.withOpacity)(props.lineColor, props.fillOpacity)
      } : undefined
    }]
  };
}
function EchartsSparkline(props) {
  var containerRef = (0, _react.useRef)(null);
  var chartRef = (0, _react.useRef)(null);
  var numericPointCount = props.data.filter(point => point.value !== null).length;
  (0, _react.useEffect)(() => {
    if (!containerRef.current || numericPointCount === 0) {
      return undefined;
    }
    if (!chartRef.current) {
      chartRef.current = echarts.init(containerRef.current, undefined, {
        renderer: 'canvas'
      });
    }
    var chart = chartRef.current;
    chart.setOption(buildSparklineOption(props), true);
    chart.resize();
    var resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => {
      chart.resize();
    }) : null;
    if (resizeObserver && containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    return () => {
      resizeObserver == null || resizeObserver.disconnect();
    };
  }, [numericPointCount, props]);
  (0, _react.useEffect)(() => () => {
    var _chartRef$current;
    (_chartRef$current = chartRef.current) == null || _chartRef$current.dispose();
    chartRef.current = null;
  }, []);
  return /*#__PURE__*/_react.default.createElement("div", {
    ref: containerRef,
    style: {
      height: '100%',
      width: '100%'
    }
  });
}
EchartsSparkline.propTypes = {
  data: _propTypes.default.array.isRequired,
  smooth: _propTypes.default.bool.isRequired,
  fillOpacity: _propTypes.default.number.isRequired,
  lineWidth: _propTypes.default.number.isRequired,
  lineColor: _propTypes.default.string.isRequired
};
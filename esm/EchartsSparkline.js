import _pt from "prop-types";
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

import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { withOpacity } from './styles';
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
        color: withOpacity(props.lineColor, props.fillOpacity)
      } : undefined
    }]
  };
}
export default function EchartsSparkline(props) {
  var containerRef = useRef(null);
  var chartRef = useRef(null);
  var numericPointCount = props.data.filter(point => point.value !== null).length;
  useEffect(() => {
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
  useEffect(() => () => {
    var _chartRef$current;
    (_chartRef$current = chartRef.current) == null || _chartRef$current.dispose();
    chartRef.current = null;
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    ref: containerRef,
    style: {
      height: '100%',
      width: '100%'
    }
  });
}
EchartsSparkline.propTypes = {
  data: _pt.array.isRequired,
  smooth: _pt.bool.isRequired,
  fillOpacity: _pt.number.isRequired,
  lineWidth: _pt.number.isRequired,
  lineColor: _pt.string.isRequired
};
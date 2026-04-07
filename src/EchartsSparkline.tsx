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
import type { EChartsOption } from 'echarts';
import { withOpacity } from './styles';
import type { SparklineDatum, SparklineType } from './types';

export interface EchartsSparklineProps {
  data: SparklineDatum[];
  type: SparklineType;
  smooth: boolean;
  fillOpacity: number;
  lineWidth: number;
  lineColor: string;
}

function buildSparklineOption(props: EchartsSparklineProps): EChartsOption {
  const numericPointCount = props.data.filter(point => point.value !== null).length;
  const shouldFill = props.type === 'area' || props.fillOpacity > 0;

  return {
    animation: false,
    grid: {
      left: 0,
      right: 0,
      top: 4,
      bottom: 0,
      containLabel: false,
    },
    tooltip: {
      show: false,
    },
    xAxis: {
      type: 'time',
      show: false,
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
      show: false,
      scale: true,
    },
    series: [
      {
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
          width: props.lineWidth,
        },
        itemStyle: {
          color: props.lineColor,
        },
        areaStyle: shouldFill
          ? {
              color: withOpacity(props.lineColor, props.fillOpacity),
            }
          : undefined,
      },
    ],
  };
}

export default function EchartsSparkline(props: EchartsSparklineProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<echarts.EChartsType | null>(null);
  const numericPointCount = props.data.filter(point => point.value !== null).length;

  useEffect(() => {
    if (!containerRef.current || numericPointCount === 0) {
      return undefined;
    }

    if (!chartRef.current) {
      chartRef.current = echarts.init(containerRef.current, undefined, {
        renderer: 'canvas',
      });
    }

    const chart = chartRef.current;
    chart.setOption(buildSparklineOption(props), true);
    chart.resize();

    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            chart.resize();
          })
        : null;

    if (resizeObserver && containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver?.disconnect();
    };
  }, [numericPointCount, props]);

  useEffect(
    () => () => {
      chartRef.current?.dispose();
      chartRef.current = null;
    },
    [],
  );

  return <div ref={containerRef} style={{ height: '100%', width: '100%' }} />;
}

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

import React from 'react';
import EchartsSparkline from './EchartsSparkline';
import { buildCardShellStyle, resolveThemeTokens } from './styles';
import type { KpiUniversalChartProps } from './types';

function InfoIcon({
  label,
  title,
  color,
  backgroundColor,
}: {
  label: string;
  title?: string;
  color: string;
  backgroundColor: string;
}) {
  return (
    <span
      aria-label={label}
      title={title}
      style={{
        alignItems: 'center',
        backgroundColor,
        borderRadius: '50%',
        color,
        display: 'inline-flex',
        fontSize: 11,
        fontWeight: 700,
        height: 20,
        justifyContent: 'center',
        minWidth: 20,
      }}
    >
      i
    </span>
  );
}

export default function KpiUniversalChart(props: KpiUniversalChartProps) {
  const themeTokens = resolveThemeTokens(props.theme);
  const sparklineVisible =
    props.showSparkline &&
    props.sparklineData.some(point => point.value !== null) &&
    props.width > 180;
  const rightColumnVisible = props.showTrend || sparklineVisible;

  const cardStyle = buildCardShellStyle({
    width: props.width,
    height: props.height,
    padding: props.padding,
    borderRadius: props.borderRadius,
    showBorder: props.showBorder,
    showShadow: props.showShadow,
    themeTokens,
  });

  if (props.noData) {
    return (
      <div style={cardStyle}>
        <div
          style={{
            alignItems: 'center',
            color: themeTokens.mutedTextColor,
            display: 'flex',
            flex: 1,
            fontSize: 13,
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          {props.noDataMessage}
        </div>
      </div>
    );
  }

  return (
    <div style={cardStyle}>
      {(props.showTitle || props.showInfoIcon) && (
        <div
          style={{
            alignItems: 'flex-start',
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <div
            style={{
              color: themeTokens.secondaryTextColor,
              fontSize: props.titleFontSize,
              fontWeight: 600,
              lineHeight: 1.2,
              marginRight: 12,
            }}
          >
            {props.showTitle ? props.title : ''}
          </div>
          {props.showInfoIcon && (
            <InfoIcon
              label={`${props.title} info`}
              title={props.infoTooltipText}
              color={themeTokens.iconColor}
              backgroundColor={themeTokens.iconBackgroundColor}
            />
          )}
        </div>
      )}
      <div
        style={{
          columnGap: 16,
          display: 'grid',
          flex: 1,
          gridTemplateColumns: rightColumnVisible
            ? `${props.valueColumnWidthPercent}% minmax(0, 1fr)`
            : '1fr',
          minHeight: 0,
        }}
      >
        <div
          style={{
            alignSelf: 'start',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            minWidth: 0,
          }}
        >
          <div
            style={{
              color: themeTokens.primaryTextColor,
              fontSize: props.kpiValueFontSize,
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              overflowWrap: 'anywhere',
            }}
          >
            {props.formattedValue}
          </div>
        </div>
        {rightColumnVisible && (
          <div
            style={{
              alignItems: 'stretch',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: 0,
              minWidth: 0,
            }}
          >
            {props.showTrend && props.trend && (
              <div
                style={{
                  alignItems: 'center',
                  color: themeTokens.secondaryTextColor,
                  display: 'flex',
                  fontSize: props.trendFontSize,
                  gap: 8,
                  justifyContent: 'flex-start',
                  lineHeight: 1.25,
                  minWidth: 0,
                }}
              >
                <span
                  style={{
                    backgroundColor: themeTokens.statusColors[props.trend.state],
                    borderRadius: '50%',
                    display: 'inline-block',
                    flex: '0 0 auto',
                    height: 8,
                    width: 8,
                  }}
                />
                <span
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {props.trend.label}
                </span>
              </div>
            )}
            {sparklineVisible && (
              <div
                style={{
                  height: Math.max(44, Math.round(props.height * 0.26)),
                  marginTop: 12,
                  width: '100%',
                }}
              >
                <EchartsSparkline
                  data={props.sparklineData}
                  type={props.sparklineType}
                  smooth={props.sparklineSmooth}
                  fillOpacity={props.sparklineFillOpacity}
                  lineWidth={props.sparklineLineWidth}
                  lineColor={themeTokens.sparklineColor}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

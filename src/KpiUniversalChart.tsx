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

function clamp(value: number, min: number, max: number) {
  const upper = Math.max(min, max);
  return Math.max(min, Math.min(upper, value));
}

function InfoIcon({
  label,
  title,
  color,
  backgroundColor,
  borderColor,
  size,
}: {
  label: string;
  title?: string;
  color: string;
  backgroundColor: string;
  borderColor: string;
  size: number;
}) {
  return (
    <span
      aria-label={label}
      title={title}
      style={{
        alignItems: 'center',
        backgroundColor,
        border: `1px solid ${borderColor}`,
        borderRadius: '50%',
        color,
        display: 'inline-flex',
        fontSize: Math.max(9, Math.round(size * 0.52)),
        fontWeight: 600,
        height: size,
        justifyContent: 'center',
        lineHeight: 1,
        minWidth: size,
      }}
    >
      i
    </span>
  );
}

export default function KpiUniversalChart(props: KpiUniversalChartProps) {
  const themeTokens = resolveThemeTokens(props.theme);
  const cardPadding = clamp(
    props.padding,
    12,
    Math.round(Math.min(props.width * 0.11, props.height * 0.17)),
  );
  const borderRadius = clamp(
    props.borderRadius,
    14,
    Math.round(Math.min(props.width * 0.14, props.height * 0.24)),
  );
  const titleFontSize = clamp(
    Math.min(
      props.titleFontSize,
      Math.round(Math.min(props.width * 0.068, props.height * 0.11)),
    ),
    10,
    16,
  );
  const trendFontSize = clamp(
    Math.min(
      props.trendFontSize,
      Math.round(Math.min(props.width * 0.065, props.height * 0.1)),
    ),
    10,
    15,
  );
  const kpiFontSize = clamp(
    Math.min(
      props.kpiValueFontSize,
      Math.round(Math.min(props.height * 0.34, props.width * 0.215)),
    ),
    24,
    props.kpiValueFontSize,
  );
  const sparklineVisible =
    props.showSparkline &&
    props.sparklineData.some(point => point.value !== null) &&
    props.width >= 170 &&
    props.height >= 108;
  const trendVisible = props.showTrend && Boolean(props.trend);
  const rightPanelVisible = trendVisible || sparklineVisible;
  const iconSize = clamp(Math.round(titleFontSize + 7), 16, 18);
  const headerSpacing =
    props.showTitle || props.showInfoIcon
      ? clamp(Math.round(props.height * 0.065), 8, 16)
      : 0;
  const contentColumnGap = clamp(Math.round(props.width * 0.045), 12, 22);
  const sparklineWidth = sparklineVisible
    ? clamp(
        Math.min(props.sparklineWidth, Math.round(props.width * 0.48)),
        74,
        Math.round(props.width * 0.48),
      )
    : 0;
  const sparklineHeight = sparklineVisible
    ? clamp(
        Math.min(props.sparklineHeight, Math.round(props.height * 0.36)),
        26,
        Math.round(props.height * 0.36),
      )
    : 0;
  const rightPanelWidth = rightPanelVisible
    ? clamp(
        Math.max(
          sparklineWidth,
          Math.round((props.width * (100 - props.valueColumnWidthPercent)) / 100),
        ),
        92,
        Math.round(props.width * 0.52),
      )
    : 0;

  const cardStyle = buildCardShellStyle({
    width: props.width,
    height: props.height,
    padding: cardPadding,
    borderRadius,
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
            marginBottom: headerSpacing,
            minHeight: titleFontSize + 4,
          }}
        >
          <div
            style={{
              color: themeTokens.secondaryTextColor,
              fontSize: titleFontSize,
              fontWeight: 600,
              letterSpacing: '0.01em',
              lineHeight: 1.25,
              marginRight: 12,
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
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
              borderColor={themeTokens.iconBorderColor}
              size={iconSize}
            />
          )}
        </div>
      )}
      <div
        style={{
          alignItems: 'center',
          columnGap: rightPanelVisible ? contentColumnGap : 0,
          display: 'grid',
          flex: 1,
          gridTemplateColumns: rightPanelVisible
            ? `minmax(0, 1fr) ${rightPanelWidth}px`
            : '1fr',
          minHeight: 0,
        }}
      >
        <div
          style={{
            alignItems: 'center',
            color: themeTokens.primaryTextColor,
            display: 'flex',
            minHeight: 0,
            minWidth: 0,
          }}
        >
          <div
            style={{
              fontSize: kpiFontSize,
              fontWeight: 800,
              letterSpacing: '-0.045em',
              lineHeight: 0.96,
              maxWidth: '100%',
              overflowWrap: 'anywhere',
            }}
          >
            {props.formattedValue}
          </div>
        </div>
        {rightPanelVisible && (
          <div
            style={{
              alignItems: 'flex-end',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              minHeight: 0,
              minWidth: 0,
              width: rightPanelWidth,
            }}
          >
            {trendVisible && props.trend && (
              <div
                style={{
                  alignItems: 'center',
                  color: themeTokens.secondaryTextColor,
                  display: 'flex',
                  fontSize: trendFontSize,
                  gap: 7,
                  justifyContent: 'flex-end',
                  lineHeight: 1.15,
                  marginBottom: sparklineVisible ? 8 : 0,
                  maxWidth: '100%',
                  minWidth: 0,
                  width: '100%',
                }}
              >
                <span
                  style={{
                    backgroundColor: themeTokens.statusColors[props.trend.state],
                    borderRadius: '50%',
                    boxShadow: `0 0 0 2px ${themeTokens.backgroundColor}`,
                    display: 'inline-block',
                    flex: '0 0 auto',
                    height: 7,
                    width: 7,
                  }}
                />
                <span
                  style={{
                    fontWeight: 600,
                    overflow: 'hidden',
                    textAlign: 'right',
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
                  alignSelf: 'flex-end',
                  height: sparklineHeight,
                  maxWidth: '100%',
                  width: sparklineWidth,
                }}
              >
                <EchartsSparkline
                  data={props.sparklineData}
                  type={props.sparklineType}
                  smooth={props.sparklineSmooth}
                  fillOpacity={props.sparklineFillOpacity}
                  lineWidth={props.sparklineLineWidth}
                  lineColor={themeTokens.sparklineLineColor}
                  fillColor={themeTokens.sparklineFillColor}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

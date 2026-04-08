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

import type { CSSProperties } from 'react';
import type { TrendState } from './types';

export interface KpiThemeTokens {
  backgroundColor: string;
  backgroundAccent: string;
  borderColor: string;
  primaryTextColor: string;
  secondaryTextColor: string;
  mutedTextColor: string;
  shadow: string;
  iconBackgroundColor: string;
  iconBorderColor: string;
  iconColor: string;
  sparklineLineColor: string;
  sparklineFillColor: string;
  statusColors: Record<TrendState, string>;
}

function hexToRgbParts(color: string): [number, number, number] | null {
  const normalized = color.trim().replace('#', '');
  if (!/^[0-9a-f]{3}([0-9a-f]{3})?$/i.test(normalized)) {
    return null;
  }

  const expanded =
    normalized.length === 3
      ? normalized
          .split('')
          .map(part => `${part}${part}`)
          .join('')
      : normalized;

  return [
    parseInt(expanded.slice(0, 2), 16),
    parseInt(expanded.slice(2, 4), 16),
    parseInt(expanded.slice(4, 6), 16),
  ];
}

export function withOpacity(color: string, opacity: number): string {
  if (color.startsWith('rgba(')) {
    return color.replace(
      /rgba\(([^)]+),\s*[\d.]+\)/,
      (_match, channels) => `rgba(${channels}, ${opacity})`,
    );
  }

  if (color.startsWith('rgb(')) {
    return color.replace('rgb(', 'rgba(').replace(')', `, ${opacity})`);
  }

  const rgb = hexToRgbParts(color);
  if (!rgb) {
    return color;
  }

  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity})`;
}

export function resolveThemeTokens(theme: Record<string, any>): KpiThemeTokens {
  const token = theme?.token ?? {};
  const colors = theme?.colors ?? {};
  const grayscale = colors.grayscale ?? {};
  const primary = colors.primary ?? {};
  const success = colors.success ?? {};
  const warning = colors.warning ?? {};
  const error = colors.error ?? {};

  const primaryTextColor =
    token.colorText ?? grayscale.dark2 ?? grayscale.base ?? '#111827';
  const secondaryTextColor =
    token.colorTextSecondary ?? grayscale.base ?? grayscale.light1 ?? '#475569';
  const mutedTextColor =
    token.colorTextTertiary ?? grayscale.light1 ?? '#64748b';
  const primaryAccent = primary.base ?? token.colorPrimary ?? '#3b82f6';

  return {
    backgroundColor:
      token.colorBgContainer ??
      token.colorFillAlter ??
      grayscale.light5 ??
      'rgba(255, 255, 255, 0.96)',
    backgroundAccent:
      token.colorFillSecondary ?? withOpacity(primaryTextColor, 0.022),
    borderColor:
      token.colorBorderSecondary ??
      token.colorBorder ??
      theme?.gridColor ??
      withOpacity(primaryTextColor, 0.12),
    primaryTextColor,
    secondaryTextColor,
    mutedTextColor,
    shadow:
      token.boxShadowSecondary ?? '0 12px 24px rgba(15, 23, 42, 0.08)',
    iconBackgroundColor:
      token.colorFillSecondary ?? withOpacity(primaryTextColor, 0.045),
    iconBorderColor:
      token.colorBorderSecondary ?? withOpacity(primaryTextColor, 0.08),
    iconColor: token.colorTextDescription ?? withOpacity(secondaryTextColor, 0.92),
    sparklineLineColor: withOpacity(primaryAccent, 0.78),
    sparklineFillColor: withOpacity(primaryAccent, 0.12),
    statusColors: {
      good: success.base ?? '#16a34a',
      bad: error.base ?? token.colorError ?? '#dc2626',
      neutral: warning.base ?? token.colorWarning ?? '#ca8a04',
      missing: token.colorTextQuaternary ?? withOpacity(mutedTextColor, 0.82),
    },
  };
}

export function buildCardShellStyle(options: {
  width: number;
  height: number;
  padding: number;
  borderRadius: number;
  showBorder: boolean;
  showShadow: boolean;
  themeTokens: KpiThemeTokens;
}): CSSProperties {
  return {
    backgroundColor: options.themeTokens.backgroundColor,
    backgroundImage: `linear-gradient(180deg, ${options.themeTokens.backgroundAccent} 0%, transparent 55%)`,
    border: options.showBorder ? `1px solid ${options.themeTokens.borderColor}` : 'none',
    borderRadius: options.borderRadius,
    boxShadow: options.showShadow ? options.themeTokens.shadow : 'none',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    height: options.height,
    overflow: 'hidden',
    padding: options.padding,
    position: 'relative',
    width: options.width,
  };
}

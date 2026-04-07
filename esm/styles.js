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

function hexToRgbParts(color) {
  var normalized = color.trim().replace('#', '');
  if (!/^[0-9a-f]{3}([0-9a-f]{3})?$/i.test(normalized)) {
    return null;
  }
  var expanded = normalized.length === 3 ? normalized.split('').map(part => "" + part + part).join('') : normalized;
  return [parseInt(expanded.slice(0, 2), 16), parseInt(expanded.slice(2, 4), 16), parseInt(expanded.slice(4, 6), 16)];
}
export function withOpacity(color, opacity) {
  if (color.startsWith('rgba(')) {
    return color.replace(/rgba\(([^)]+),\s*[\d.]+\)/, (_match, channels) => "rgba(" + channels + ", " + opacity + ")");
  }
  if (color.startsWith('rgb(')) {
    return color.replace('rgb(', 'rgba(').replace(')', ", " + opacity + ")");
  }
  var rgb = hexToRgbParts(color);
  if (!rgb) {
    return color;
  }
  return "rgba(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ", " + opacity + ")";
}
export function resolveThemeTokens(theme) {
  var _theme$token, _theme$colors, _colors$grayscale, _colors$primary, _colors$success, _colors$warning, _colors$error, _ref, _ref2, _token$colorText, _ref3, _ref4, _token$colorTextSecon, _ref5, _token$colorTextTerti, _ref6, _primary$base, _ref7, _ref8, _token$colorBgContain, _ref9, _ref0, _ref1, _token$colorBorderSec, _token$boxShadowSecon, _token$colorFillSecon, _token$colorTextDescr, _success$base, _ref10, _error$base, _ref11, _warning$base, _token$colorTextQuate;
  var token = (_theme$token = theme == null ? void 0 : theme.token) != null ? _theme$token : {};
  var colors = (_theme$colors = theme == null ? void 0 : theme.colors) != null ? _theme$colors : {};
  var grayscale = (_colors$grayscale = colors.grayscale) != null ? _colors$grayscale : {};
  var primary = (_colors$primary = colors.primary) != null ? _colors$primary : {};
  var success = (_colors$success = colors.success) != null ? _colors$success : {};
  var warning = (_colors$warning = colors.warning) != null ? _colors$warning : {};
  var error = (_colors$error = colors.error) != null ? _colors$error : {};
  var primaryTextColor = (_ref = (_ref2 = (_token$colorText = token.colorText) != null ? _token$colorText : grayscale.dark2) != null ? _ref2 : grayscale.base) != null ? _ref : '#111827';
  var secondaryTextColor = (_ref3 = (_ref4 = (_token$colorTextSecon = token.colorTextSecondary) != null ? _token$colorTextSecon : grayscale.base) != null ? _ref4 : grayscale.light1) != null ? _ref3 : '#475569';
  var mutedTextColor = (_ref5 = (_token$colorTextTerti = token.colorTextTertiary) != null ? _token$colorTextTerti : grayscale.light1) != null ? _ref5 : '#64748b';
  var sparklineColor = (_ref6 = (_primary$base = primary.base) != null ? _primary$base : token.colorPrimary) != null ? _ref6 : '#3b82f6';
  return {
    backgroundColor: (_ref7 = (_ref8 = (_token$colorBgContain = token.colorBgContainer) != null ? _token$colorBgContain : token.colorFillAlter) != null ? _ref8 : grayscale.light5) != null ? _ref7 : 'rgba(255, 255, 255, 0.96)',
    borderColor: (_ref9 = (_ref0 = (_ref1 = (_token$colorBorderSec = token.colorBorderSecondary) != null ? _token$colorBorderSec : token.colorBorder) != null ? _ref1 : theme == null ? void 0 : theme.gridColor) != null ? _ref0 : grayscale.light2) != null ? _ref9 : 'rgba(148, 163, 184, 0.35)',
    primaryTextColor,
    secondaryTextColor,
    mutedTextColor,
    shadow: (_token$boxShadowSecon = token.boxShadowSecondary) != null ? _token$boxShadowSecon : '0 10px 28px rgba(15, 23, 42, 0.12)',
    iconBackgroundColor: (_token$colorFillSecon = token.colorFillSecondary) != null ? _token$colorFillSecon : withOpacity(primaryTextColor, 0.08),
    iconColor: (_token$colorTextDescr = token.colorTextDescription) != null ? _token$colorTextDescr : secondaryTextColor,
    sparklineColor,
    sparklineFillColor: withOpacity(sparklineColor, 0.18),
    statusColors: {
      good: (_success$base = success.base) != null ? _success$base : '#16a34a',
      bad: (_ref10 = (_error$base = error.base) != null ? _error$base : token.colorError) != null ? _ref10 : '#dc2626',
      neutral: (_ref11 = (_warning$base = warning.base) != null ? _warning$base : token.colorWarning) != null ? _ref11 : '#ca8a04',
      missing: (_token$colorTextQuate = token.colorTextQuaternary) != null ? _token$colorTextQuate : mutedTextColor
    }
  };
}
export function buildCardShellStyle(options) {
  return {
    backgroundColor: options.themeTokens.backgroundColor,
    border: options.showBorder ? "1px solid " + options.themeTokens.borderColor : 'none',
    borderRadius: options.borderRadius,
    boxShadow: options.showShadow ? options.themeTokens.shadow : 'none',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    height: options.height,
    overflow: 'hidden',
    padding: options.padding,
    width: options.width
  };
}
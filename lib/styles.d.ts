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
    borderColor: string;
    primaryTextColor: string;
    secondaryTextColor: string;
    mutedTextColor: string;
    shadow: string;
    iconBackgroundColor: string;
    iconColor: string;
    sparklineColor: string;
    sparklineFillColor: string;
    statusColors: Record<TrendState, string>;
}
export declare function withOpacity(color: string, opacity: number): string;
export declare function resolveThemeTokens(theme: Record<string, any>): KpiThemeTokens;
export declare function buildCardShellStyle(options: {
    width: number;
    height: number;
    padding: number;
    borderRadius: number;
    showBorder: boolean;
    showShadow: boolean;
    themeTokens: KpiThemeTokens;
}): CSSProperties;
//# sourceMappingURL=styles.d.ts.map
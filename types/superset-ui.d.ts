/*
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

declare module '@superset-ui/core' {
  export type QueryFormData = Record<string, any>;
  export type QueryFormMetric = any;
  export type QueryFormColumn = any;
  export type QueryFormOrderBy = [any, boolean];
  export type QueryObject = Record<string, any>;
  export type TimeseriesDataRecord = Record<string, any>;

  export class ChartProps {
    width: number;

    height: number;

    formData: Record<string, any>;

    queriesData: Record<string, any>[];

    theme: Record<string, any>;

    constructor(config: Record<string, any>);
  }

  export class ChartMetadata {
    constructor(config: Record<string, any>);
  }

  export class ChartPlugin {
    constructor(config: Record<string, any>);
  }

  export function buildQueryContext(
    formData: Record<string, any>,
    buildFinalQueryObjects?: (
      baseQueryObject: Record<string, any>,
    ) => Record<string, any>[],
  ): Record<string, any>;

  export function getMetricLabel(metric: any): string;
  export function getNumberFormatter(format?: string): (value: number) => string;
  export function t(value: string): string;
}

declare module '@superset-ui/chart-controls' {
  export type ControlPanelConfig = {
    controlPanelSections: any[];
  };

  export const sections: Record<string, any>;
  export const sharedControls: Record<string, any>;
}

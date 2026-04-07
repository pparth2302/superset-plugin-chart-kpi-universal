# Superset Universal KPI Card

`@pparth2302/superset-plugin-chart-kpi-universal` is a reusable Apache Superset 6.0 chart plugin that renders compact manufacturing-style KPI cards with title, info icon, KPI value, trend indicator, status dot, and an ECharts sparkline.

## Features

- Reusable KPI card layout for OEE, downtime, reject count, quality, lost time, and similar metrics
- Superset 6.0-compatible query pipeline using `buildQuery`, `transformProps`, and a standard `ChartPlugin`
- Dual data usage modes:
  - time-series-derived KPI with sparkline and calculated trend
  - direct aggregate KPI with optional aggregate secondary trend metric
- Value formatting for numbers, percentages, decimals, prefixes, suffixes, and `HH:MM:SS` durations
- Trend modes for first-vs-last percent, previous-vs-latest percent, absolute difference, and direct secondary metric
- Theme-aware card styling with dark-mode and light-mode-safe defaults
- ECharts-based sparkline with line/area modes, smooth toggle, and fill opacity control

## Install

```bash
npm install
npm run build
```

## Register In Superset

```ts
import { SupersetPluginChartKpiUniversal } from '@pparth2302/superset-plugin-chart-kpi-universal';

new SupersetPluginChartKpiUniversal().configure({
  key: 'kpi-universal',
});
```

After registration, rebuild Superset frontend assets so the new chart appears in Explore.

## Build And Test

```bash
npm run build
npm run test
```

## Configuration Notes

- Use `KPI source mode` to choose whether the main KPI comes from the time series or from the aggregate query result.
- If `Value type mode` is `duration`, numeric values are interpreted using `Duration unit`.
- `Trend calculation mode = secondary_metric` reads the optional secondary metric from the aggregate query.
- The included thumbnail is a placeholder and can be replaced later without touching runtime code.
- Style defaults live mainly in `src/constants.ts`, `src/styles.ts`, and the Customize controls if you want to tune spacing, shadows, radius, fonts, or sparkline appearance.

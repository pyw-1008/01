# QA Checklist

## Automated Checks

The following commands were run from the project root.

| Command | Result |
| --- | --- |
| `pnpm run test` | Passed. Runs TypeScript checks and executes `severity.test.ts`, `stats.test.ts`, `timeAgo.test.ts`, and `usgsFeeds.test.ts` with Node type stripping. |
| `pnpm run lint` | Passed. |
| `pnpm run build` | Passed. Production build completed successfully. |

Production build output was generated under `dist/`.

## Feed Checks

The four USGS GeoJSON feeds were requested successfully during QA.

| Range | Result |
| --- | --- |
| `1H` | Success, returned 8 features at check time. |
| `24H` | Success, returned 238 features at check time. |
| `7D` | Success, returned 1919 features at check time. |
| `30D` | Success, returned 10719 features at check time. |

Feature counts are expected to change as USGS updates the feeds.

## Core Path Checklist

- Default page loads at `http://localhost:5173/`.
- First screen is the dark global map.
- Default time range is `24H`.
- Earthquake markers are rendered from USGS GeoJSON coordinates.
- Marker radius, color, and glow are driven by magnitude severity.
- Pulse ring animation is applied through `.quake-pulse-ring`.
- Marker popup shows place, magnitude, depth, time, and a USGS details link when available.
- Left statistics panel is calculated from the currently visible filtered events.
- Right event list is sorted newest first.
- Clicking an event list row selects it, calls `map.flyTo`, and opens the selected event popup.
- Minimum magnitude slider filters map markers, event list, and statistics together.
- `1H / 24H / 7D / 30D` time range buttons switch the active USGS feed.
- Automatic refresh runs every 60 seconds for the current time range.
- Manual `Refresh` button refreshes the current time range.
- Failed requests preserve the previous successful dataset and show an error state.

## Responsive Checklist

- At `1920x1080`, the top bar, left statistics panel, right event list, and map fit without page-level scrolling.
- On common laptop widths, the top bar can wrap and the side panels reduce width, while the map remains usable.
- On narrow screens, the top bar stacks, the statistics panel scrolls internally, and the event list becomes a bottom card.
- Long event place names are truncated with ellipsis inside the event list.
- Event list scrolls internally; the page itself remains fixed to the viewport.
- The map remains visible at all tested widths.

## Known Limits

- Data comes only from the USGS public GeoJSON feeds.
- No earthquake prediction, warning, risk scoring, or safety recommendation is provided.
- No backend service or database is used.
- When the network is unavailable, the app can only preserve the previous successful data in memory or show an error state.
- Mobile is basic responsive support, not a mobile-first design.
- `30D` can return many thousands of events, so marker rendering may be heavier than shorter ranges.

## Browser Verification Steps

1. Open `http://localhost:5173/`.
2. Confirm the dark world map fills the viewport.
3. Confirm markers pulse and clicking a marker opens a popup.
4. Confirm the top bar clock updates every second and `LIVE` remains visible.
5. Click `1H`, `24H`, `7D`, and `30D`; confirm map, statistics, and event list all update.
6. Drag `MIN M`; confirm markers, statistics, and event list filter together.
7. Click an event list row; confirm the map flies to that location and opens the popup.
8. Click `Refresh`; confirm the non-blocking updating state appears.
9. Resize the browser to desktop, laptop, and narrow widths; confirm no page-level scrolling or major text overlap.

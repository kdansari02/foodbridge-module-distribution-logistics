# Addendum 004 — Live Delivery Tracking (admin monitoring)

**Status:** accepted and released. Snapshotted as `../paths/distribution-logistics/versions/v2/` (rule R6).
**Path:** `../paths/distribution-logistics/screens/distribution/live-tracking.html`
**Inputs:** verbal brief — *"admin/owner management, you can view/monitor delivery movement …
how delivery is being executed — monitoring by admin in office, e.g. live status (co-ordinates),
map-based UX"*.

## Intent

A fourth screen under Distribution & Logistics, for the person in the office rather than the
person in the van.

## Why this screen has to exist

The two existing screens split cleanly, and the split leaves a hole.

| Screen | Who it serves | What it knows |
| ------ | ------------- | ------------- |
| Route Planning | office, before the day | intent — which customers, which staff, which beat |
| Delivery Management | driver, during the day | reality — stop by stop, cash, stock |
| **— missing —** | **office, during the day** | **nothing** |

Everything the office can currently see is *retrospective*: `route-report` only exists once the
driver has finished `settle-route`. Between "van leaves" and "route settled" the office is blind.
That window is the entire working day.

## What was read before designing

Not screenshots — the source and seed of both existing screens.

| Read | Learned |
| ---- | ------- |
| `distribution/assets/data.js` | `routeTemplates {name, customers[], staffs[], created}`, `customers`, `staff` |
| `delivery/assets/data.js` | `route {status, beatArea, startedAt, stockLoaded, openingCash, collected}`, `stop {status, collected, paymentMode, overPayment, credit, addedOnRoute}` |
| `delivery/assets/sections/*.js` (18 files) | the driver lifecycle, in order — see below |
| `settle-route.js` | `routeStats → {delivered, skipped, collected, outstanding}` — the office's end-of-day vocabulary |
| `distribution/assets/styles.css` | design tokens (`--emerald`, `--ink`, `--line`, `--radius`, Inter) |

The driver lifecycle this screen watches:

```
home → route-prestart → load-stock → cash-change → ready-start
     → delivery-queue → stop-detail → {edit-order | collect-payment
                                       | print-receipt | new-customer}
     → restock → settle-route → stock-count → cash-handover → route-report
```

**The design rule that follows:** every state on this screen must be a state the driver app can
actually produce. No invented statuses. `stop.status` stays `pending | delivered | skipped`;
route status maps to the lifecycle stages above.

## Design decisions

| # | Decision | Why |
| - | -------- | --- |
| D1 | Map-primary, with a route rail down the left | The dispatcher pattern across the category: the live map is the home screen, lists support it in a side rail rather than tabs. |
| D2 | An **exception strip** above everything, not a KPI row | The office's question is "what needs attention now?", not "how are we doing". KPIs are the end-of-day question and `route-report` already answers it. |
| D3 | Colour encodes **state, not identity** | Category convention. A van is green/amber/red by how it is doing, never by who is driving it. |
| D4 | The **stop-sequence bar** is the signature element | One segment per stop, coloured by outcome. A route's whole day reads at a glance, and it maps 1:1 onto `stop.status`, so it cannot drift from what the driver app reports. |
| D5 | **Cash and stock ladders** in the drawer | This is beat/van-sales, not courier dispatch. The van carries stock and collects cash, so reconciliation is a first-order owner concern — the thing generic fleet tools do not model. |
| D6 | **Last-ping age** is shown and is itself an exception | A stale map looks identical to a healthy one. Without ping age, silence reads as "all fine". |
| D7 | Real map tiles (Leaflet + OpenStreetMap) | Chosen over a drawn basemap for demo realism. Consistent with this repo already loading Google Fonts from a CDN. Costs an external dependency at view time — see divergences. |
| D8 | Interventions are **working**, not decorative | Reassign a stop, reorder, mark skipped, message the driver, acknowledge an exception — all mutate the seed and re-render, matching how the other screens in this module behave. |

## Deliberately not done

| Not done | Why |
| -------- | --- |
| Driver-identity colours, vehicle photos, avatars on the map | Competes with status for the same visual channel (D3). |
| A KPI band (on-time %, deliveries/hour) | Answers the wrong question for this screen (D2). |
| Route optimisation / re-routing | That is Route Planning's job, before the day starts. |
| Geofence and speeding alerts | Telematics, not delivery execution. Needs vehicle hardware this product does not assume. |

## Divergences from a production build

| # | Divergence | Why |
| - | ---------- | --- |
| V1 | Positions are **simulated**, advanced by a local clock | There is no GPS feed in discovery. Vans interpolate along their planned polyline so the screen genuinely animates. |
| V2 | Coordinates are **invented**, placed on real Pune geography | Customer names already exist in this repo's seed; their locations do not. Nothing here is a real address. |
| V3 | Leaflet and OSM tiles load from a CDN at view time | The screen needs a network to draw the basemap. Everything else still works offline. |
| V4 | ETAs are straight-line estimates from remaining distance and a fixed average speed | No traffic model in discovery. The *shape* of the calculation is what carries forward, not the number. |

## Outcome

Accepted and released 2026-08-14. Snapshotted as `../paths/distribution-logistics/versions/v2/`,
which is v1 plus this screen — the first version of this path to carry a screen with no live
counterpart.

### What shipped

| Region | State |
| ------ | ----- |
| Exception strip | Built. Behind schedule · no ping · skipped stop · uncollected cash · handover pending. Clicking one opens that route. |
| Route rail + stop-sequence bar | Built. One segment per stop, coloured by outcome, driven by `stop.status`. |
| Live map | Built. Leaflet + OSM, vans coloured by state, numbered stop pins, planned line, legend. |
| Route drawer | Built. Planned-vs-actual timeline, cash ladder, stock ladder, office messages. |
| Interventions | Built and working: reorder, mark skipped, reassign, message, acknowledge. |
| Mobile | Rail becomes a bottom sheet behind a footer button; chips scroll in two rows; map takes 68% of the viewport. |

### Defects found by clicking, not by reading

| Found | Cause | Fix |
| ----- | ----- | --- |
| Stock ladder showed 85 units sold from 60 loaded | Seed gave each route less stock than its own stops needed; the `Math.max(0, …)` clamp rendered "0 back" instead of a negative and hid it | Corrected the seed; all five routes now reconcile on both stock and cash |
| The map painted over the route drawer | Leaflet's own layers (panes 400, controls 800, `.leaflet-top` 1000) resolved in the **root** stacking context, because nothing between the map and `<body>` created one. They outranked the drawer at 151 | Gave the map wrapper its own stacking context, confining every Leaflet z-index to it. Raising the drawer instead would have broken this module's scale and only held until a plugin picked a bigger number |
| Drawer was 353px wide on a 375px phone | `width: 100%` lost to the base rule's `max-width: 94vw` | Released `max-width` at the phone breakpoint too |

### Carried into the SSOTs

| Decision | Feeds |
| -------- | ----- |
| Route stage vocabulary (`ready → loading → on-route → settling → done`) and its mapping onto the driver lifecycle | SSOT-01 state machine |
| `stop.status` stays `pending \| delivered \| skipped` across driver and office | SSOT-01, SSOT-02 |
| Schedule delta is derived from planned-vs-actual on a **completed** stop, never estimated | SSOT-05 workflow |
| Cash ladder (`opening + collected = expected at handover`) and stock ladder (`loaded − sold = expected back`) as the settlement contract | SSOT-02 domain model |
| Last-ping age is a first-class exception, not a display detail | SSOT-01, SSOT-05 |
| Office interventions that mutate a route mid-flight (reorder, reassign, skip) | SSOT-05 workflow, SSOT-07 collaboration contract |

# Addendum 004 — Live Delivery Tracking (admin monitoring)

**Status:** intent logged, iteration in progress (rule R4).
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

*Appended after the iteration is reviewed (rule R4).*

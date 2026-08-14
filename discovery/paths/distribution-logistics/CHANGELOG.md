# Changelog — `distribution-logistics` discovery path

All notable changes to this HTML replica are recorded here. Each accepted iteration
is snapshotted under `versions/vN/` and the working copy under `screens/distribution/`.

## v2 — live-delivery-tracking (2026-08-14)

A fourth screen, for the office rather than the driver. Route Planning holds the intent and
Delivery Management holds the reality, but nothing showed the office what was happening while
it happened — `route-report` only exists once the driver has finished `settle-route`.

- **Exception strip** — behind schedule, no ping, skipped stop, uncollected cash, handover
  pending. Clicking one opens that route.
- **Route rail** — a card per route with a **stop-sequence bar**: one segment per stop,
  coloured by outcome, mapped 1:1 onto `stop.status` so it cannot drift from the driver app.
- **Live map** — Leaflet + OpenStreetMap. Vans coloured by state, not identity; numbered stop
  pins; the planned line; a legend. Positions are simulated by a local clock.
- **Route drawer** — planned-vs-actual stop timeline, plus **cash** and **stock ladders**
  (opening → collected → expected handover; loaded → sold → expected back).
- **Working interventions** — reorder a stop, mark it skipped, reassign it to another route,
  message the driver, acknowledge alerts. All mutate the seed and re-render.

Mobile: the route rail becomes a bottom sheet behind a `Routes · N` footer button, the
exception chips scroll sideways in two rows, and the map takes 68% of the viewport.

Snapshotted as `versions/v2/`. Design decisions and divergences:
`discovery/instructions/addendum-004-live-delivery-tracking.md`.

## v1 — working-actions (2026-08-11)

First build of the Distribution & Logistics replica, mirroring the `products-directory`
path layout and the live "QA store" storefront-admin screens.

### Route Planning (`ManageRoutes.jsx`)
- Delivery Templates tab, search, and the `Name / Customers / Staff / Actions` table.
- Add/Edit **drawer** with a **multi-select Customers + Staff** picker.
- **"N templates" assignment badges** on each option and selected row (portal-style popover)
  showing which other templates already reference that customer/staff.
- Delete confirmation modal. Newest-first ordering by created date.

### Logistic Returns (`ReverseLogisticDashboard.jsx` + `ReturnableProducts.jsx`)
- Summary header — Total Outstanding Returns (`issued · returned · across N customers ·
  N assets`) and In Warehouse (`+ total assets`).
- **Asset Movement** tab — `Crate — N outstanding` pill, search, All-Assets / date / sort
  filters, per-customer table with **View Ledger** and **Record Movement**.
- **Asset Inventory** tab — `In Warehouse` / `With Customers` / `Total Assets` per asset.
- **Assets** tab — returnable-asset catalogue with **Add Asset** (same drawer + Unit&Price
  modal as Products), **view** (asset detail page + Inventory Summary tiles), **edit**, **delete**.
- **Record Asset Movement** wizard — Return / Issue toggle, 3-step (customer → asset →
  quantity), live max-quantity validation, and the `no outstanding returns` empty state.
- **Ledger** modal per customer (issue/return transaction history).
- All movements mutate warehouse / with-customers / outstanding and re-derive the header stats.

### Delivery Management (`route-delivery-app/`)
- Mobile-only Route Delivery execution view in a phone frame: route header (progress,
  collected total), stop cards with **Deliver / Skip / Undo**, Reset and Close/End route.

### Shell
- QA store sidebar (Distribution & Logistics group expanded), topbar, mobile drawer + footer,
  toast, generic modal / drawer / delete-confirm helpers shared across screens.

### v1 revision — ledger page + alignment (2026-08-11)
- **View Ledger now opens a full page** (was a modal), matching the live app: breadcrumb
  (`← / Returns / <Customer>`), customer header card with **+ Record Asset Movement**, per-asset
  outstanding stat card + Last Transaction card, and two tabs:
  - **Transaction History** — search, All Assets, All Types (Forward/Reverse), date-from → date-to,
    and the `Date · Type · Asset · Qty · Balance After · Invoice/Order · Delivery By · Remarks`
    table. Ledger entries carry `FORWARD`/`REVERSE` type, time, and a derived **running balance**.
  - **Balance Summary** — per-asset Running Balance card (Total Issued / Total Returned / Outstanding).
  - Recording a movement from the ledger stays on the ledger and refreshes it.
- Kunal Sweet Shop ledger aligned to the reference screenshot (10 issued · 9 returned · 1
  outstanding; FORWARD +10 → REVERSE −5 → −3 → −1, running balance 10→5→2→1); Shubham rebalanced
  so module totals stay 111 / 101 / 10.
- Record-movement wizard: reverse asset options now read `Crate — N outstanding` with an
  `N asset(s) with outstanding balance` hint; issue options read `Crate — N in warehouse`.
- Outstanding badges unified to amber (including `0 Crate`), matching the live table.

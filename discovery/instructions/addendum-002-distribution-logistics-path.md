# Addendum 002 — `distribution-logistics` discovery path (v1)

> Linked from [instructions.md](./instructions.md)
> Status: Accepted → snapshotted as `../paths/distribution-logistics/versions/v1`
> Created: 2026-08-11
> Inputs: live "QA store" storefront-admin screenshots (Route Planning, Logistic
> Returns record-movement/asset flows) provided in-chat; source components under
> `storefront-frontend/src` (see table).

## Intent

Build the Distribution & Logistics module UI to the same "proper setup" as the
`products-directory` path in `foodbridge-modules-products` — a no-build, click-through
HTML replica of the three live admin screens, with every action working against seed data.

## Scope (this iteration)

| Screen | Live route | Source component replicated |
| ------ | ---------- | --------------------------- |
| Route Planning | `/manage-routes` | `pages/ManageRoutes.jsx` (tabs, table, `SearchSelect` multi-select, `AssignmentBadge`, delete confirm) |
| Logistic Returns | `/reverse-logistics/dashboard` | `pages/reverseLogistics/ReverseLogisticDashboard.jsx` (summary + 3 tabs + record-movement wizard + ledger) and `ReturnableProducts.jsx` + `ReturnableProductDrawer` (Assets tab, add/edit/detail) |
| Delivery Management | `/route-delivery` | `route-delivery-app/` (mobile-only Route Delivery execution) |

## Decisions (feed which SSOT)

| # | Decision | Feeds |
| - | -------- | ----- |
| D1 | Three sibling screens under one module shell; Logistic Returns owns three internal tabs (Asset Movement / Asset Inventory / Assets). | SSOT-1 state-machine, SSOT-5 workflow |
| D2 | Route template = `{ name, customers[], staffs[] }`; customer/staff pickers surface an "N templates" assignment badge = other templates referencing that entity (excluding the one being edited). | SSOT-2 domain-model |
| D3 | Returns arithmetic is derived, never stored: `outstanding = issued − returned`; header re-derives `issued/returned/customers/assets` and `in-warehouse (+ total = warehouse + outstanding)`. Seed reconciles to 111/101/10 and 104/114. | SSOT-2 domain-model |
| D4 | Movement is one flow with two modes — Return (from customer, max = outstanding balance) and Issue (to customer, max = available warehouse stock); a 3-step wizard (customer → asset → quantity) with live max validation. | SSOT-1, SSOT-5 |
| D5 | Delivery Management is mobile-only (phone frame); stops move pending → delivered/skipped and roll up progress + collected total. | SSOT-3 UX component library, SSOT-5 |

## Outcome

Accepted. Built under `../paths/distribution-logistics/` (mirrors `products-directory`
layout: `index.html` launcher, `screens/distribution/{index,route-planning,logistic-returns,delivery-management}.html`
+ `assets/{styles.css,data.js,app.js}`, canonical `seed-data/*.json`, snapshot `versions/v1/`).
Verified via a jsdom smoke pass: all three screens mount; route add/edit/update/delete,
multi-select + badges, the three returns tabs, add-asset drawer + Unit&Price modal, asset
detail tiles, the Return/Issue wizard (incl. `Cannot exceed …` validation and `no outstanding
returns` empty state), the ledger, and delivery deliver/skip all behave and mutate correctly.

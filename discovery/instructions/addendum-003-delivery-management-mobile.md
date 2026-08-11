# Addendum 003 — `delivery-management` mobile Route Delivery app (v1)

> Linked from [instructions.md](./instructions.md)
> Status: Accepted → snapshotted as `../paths/delivery-management/versions/v1`
> Created: 2026-08-11
> Inputs: live "QA store" `route-delivery-app` screenshots (~40 screens: Home, route
> pre-start, load stock, cash for change, ready-to-start, delivery queue, stop detail,
> edit order, collect payment, print receipt, new customer, restock, settle route, stock
> count, cash handover, route intelligence, reports) provided in-chat.

## Intent

Rebuild **Delivery Management** (the third Distribution & Logistics screen) as the full
**mobile-only** Route Delivery app the driver uses on their phone, organised as a
**section-per-file** structure — replacing the earlier single-screen placeholder.

## Decisions (feed which SSOT)

| # | Decision | Feeds |
| - | -------- | ----- |
| D1 | Delivery Management is a separate discovery path (`paths/delivery-management`), mobile-only (phone frame on desktop, full-bleed on phones). The desktop `distribution-logistics` path's `delivery-management.html` redirects here. | SSOT-3 UX library |
| D2 | One framework file (`app.js`: seed→state, back-stack router, phone shell, shared UI) + **17 section files**, each registering `DM.sections[<name>]`. This is the "section-wise file" structure. | SSOT-3, SSOT-5 workflow |
| D3 | The route lifecycle is a linear workflow with branch points (Restock, Add Customer, Skip): pre-start checklist gates start; settlement gates (Stock Count → Cash Handover) gate the report. | SSOT-1 state-machine, SSOT-5 |
| D4 | Money model: per-stop over-payment **credit** reduces today's due (Dinesh: ₹376 order − ₹428 credit ⇒ ₹0 due, ₹52 over-payment left); stock count derives Expected = Loaded − Delivered; cash handover reconciles Opening + Cash Collected − Expenses vs Actual counted (discrepancy). | SSOT-2 domain-model |
| D5 | Route Intelligence score = mean(coverage, productivity, collection, time) → label bands (≥80 Excellent / ≥60 Good Beat / ≥40 Average / else Needs Work). | SSOT-2, SSOT-5 |

## Outcome

Accepted. Built under `../paths/delivery-management/` (mirrors the products-directory
layout: launcher `index.html`, `screens/delivery/{index.html, assets/{styles.css, data.js,
app.js, sections/*.js}}`, canonical `seed-data/*.json`, snapshot `versions/v1/`). Verified
with a jsdom end-to-end smoke pass (18 checks) covering every screen: load 47 → confirm,
opening cash ₹500, start, stop detail (₹0 due / over-payment note), edit order, collect →
success + receipt preview → delivered, restock +3 units, settle stock-count match, cash
handover with a **+₹400** discrepancy, and a **60 · Good Beat** route report; New Customer
add and Home filter/Continue also pass.

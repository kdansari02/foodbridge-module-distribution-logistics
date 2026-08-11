# Changelog — `delivery-management` discovery path

## v1 — route-delivery-app (2026-08-11)

First build of the Delivery Management **mobile** Route Delivery app, replacing the earlier
single-screen placeholder. Mobile only; renders in a phone frame on desktop for preview.

- **Section-per-file** architecture: `app.js` provides the DM store, a back-stack router, the
  phone shell and shared UI (topbar, bottom nav, sheets, steppers, numeric keypad, toast);
  17 section files under `sections/` each register one screen.
- **Full route lifecycle**: Home → pre-start checklist → Load Stock (proxy auto-fill) → Cash
  for Change → Ready to Start → Delivery Queue → Stop detail (over-payment credit) → Edit
  Order → Collect Payment (Cash/UPI) → success + Print Receipt → Restock (Load Additional
  Stock) → Settle Route → Stock Count (Loaded/Expected/Actual + Match) → Cash Handover
  (expenses, denomination breakdown, discrepancy, sign-off) → Route Intelligence report →
  Reports history. Plus New Customer (discovered on route).
- Seed reconciles through the flow; a full jsdom smoke pass drives all 17 screens
  (18 checks) — load/confirm, collect, restock +3, stock-count match, +₹400 cash
  discrepancy, and a **60 · Good Beat** report score.
- The desktop `distribution-logistics` path's `delivery-management.html` now redirects here,
  since this screen is mobile-only.

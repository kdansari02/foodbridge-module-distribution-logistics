# Discovery path — `delivery-management`

Static **HTML replica** of the storefront-frontend **Route Delivery mobile app**
(`route-delivery-app`), built for the `foodbridge-module-distribution-logistics`
discovery workflow. **Mobile only** — it renders inside a phone frame on desktop for
preview and goes full-bleed on real phones.

This is the third screen of the Distribution & Logistics module (Route Planning and
Logistic Returns are the desktop-admin `distribution-logistics` path). Delivery
Management is the driver's on-route app, so it is broken out into its own path with a
**section-per-file** structure.

## The flow (each screen = one file under `screens/delivery/assets/sections/`)

| # | Section file | Screen |
| - | ------------ | ------ |
| 1 | `home.js` | Home — greeting, headline tiles (All Deliveries / Target / Customers / Outstanding), today's routes with search + status filter (All / Ready / Stock Requested / In Progress / Closed). |
| 2 | `route-prestart.js` | Route pre-start — **Before You Start** checklist (Stock Loaded → Opening Cash → Staff Sign-Off) + Route Summary. |
| 3 | `load-stock.js` | Load Stock — quantities auto-filled from proxy orders, adjustable, confirm sheet. |
| 4 | `cash-change.js` | Cash for Change — opening float via numpad + quick amounts. |
| 5 | `ready-start.js` | Ready to Start — confirmation summary, Start Later / Start Route Now. |
| 6 | `delivery-queue.js` | Delivery queue — stop list with the current stop, Add Customer, ☰ menu (Restock / Return & Settle). |
| 7 | `stop-detail.js` | Stop detail — total due (with over-payment credit), today's order, Collect / Edit / Skip. |
| 8 | `edit-order.js` | Edit Order — adjust lines and add on-truck products. |
| 9 | `collect-payment.js` | Collect Payment — Cash / UPI numpad + a success screen (WhatsApp / Print Receipt). |
| 10 | `print-receipt.js` | Print Receipt — printer type, paper size, live receipt preview (bottom sheet). |
| 11 | `new-customer.js` | New Customer — discovered on route, quick order from on-truck stock. |
| 12 | `restock.js` | Restock — pause, Load Additional Stock (On Truck / Add Now), success. |
| 13 | `settle-route.js` | Settle Route — Delivered / Skipped / Collected / Outstanding tiles + Stock Count / Cash Handover steps. |
| 14 | `stock-count.js` | Stock Count — Loaded / Expected / Actual with Match, running total. |
| 15 | `cash-handover.js` | Cash Handover — expenses, denomination breakdown, discrepancy, sign-off. |
| 16 | `route-report.js` | Route Intelligence — score ring, performance bars, stops/stock/expense/collection summaries. |
| 17 | `reports-list.js` | Reports — history of completed route reports. |

`app.js` is the framework: seed → working state, a tiny **router with a back-stack**, the
phone shell (status bar + scrollable screen), and shared UI (topbar, bottom nav, bottom
sheets, steppers, numeric keypad, toast, money). Each section registers
`DM.sections[<name>](body, params)` and owns its own header + footer.

Everything mutates `DM` state and re-renders — a discovery prototype, not a wired backend.
Counts reconcile through the flow (e.g. Morning Route 66: load 47 → deliver → restock +3 →
stock count matches → cash handover shows a +₹400 discrepancy → report scores **60 · Good Beat**).

## Layout

```
delivery-management/
├── index.html                     # launcher → screens/delivery (current)
├── README.md
├── CHANGELOG.md
├── screens/
│   └── delivery/
│       ├── index.html             # phone frame + loads app.js and every section
│       └── assets/
│           ├── styles.css         # mobile design system
│           ├── data.js            # seed (window.DM_SEED)
│           ├── app.js             # DM namespace: store + router + shell + UI helpers
│           └── sections/*.js      # one file per screen (see table)
├── seed-data/                     # canonical seed JSON (generated from data.js)
└── versions/
    └── v1/                        # snapshot — "route-delivery-app" (== screens/delivery)
```

## Run it locally

No dependencies. Open `screens/delivery/index.html`, or serve the folder:

```bash
python3 -m http.server 4173
#   → http://localhost:4173/screens/delivery/index.html
```

Best viewed narrow (or with the browser devtools device toolbar) — it is a phone app.

## Versioning

The live/current version is never edited in place. Each iteration is a full snapshot under
`versions/`. This is **v1** (`route-delivery-app`).

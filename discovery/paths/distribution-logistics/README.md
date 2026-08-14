# Discovery path — `distribution-logistics`

Static **HTML replica** of the storefront-frontend **Distribution & Logistics module**,
built for the `foodbridge-module-distribution-logistics` discovery workflow. It reproduces
the three live admin screens as a no-build, click-through prototype for both **desktop and mobile**,
plus a fourth screen — **Live Delivery Tracking** — which has no live counterpart yet and was
designed here.

| Screen | Route (live app) | Source component |
| --- | --- | --- |
| Route Planning | `/manage-routes` | `storefront-frontend/src/pages/ManageRoutes.jsx` |
| Logistic Returns | `/reverse-logistics/dashboard` | `pages/reverseLogistics/ReverseLogisticDashboard.jsx` + `ReturnableProducts.jsx` |
| Delivery Management | `/route-delivery` | `storefront-frontend/src/route-delivery-app/` |
| Live Delivery Tracking | *new — no live counterpart yet* | designed in `discovery/instructions/addendum-004-live-delivery-tracking.md` |

## What it replicates

- **Shared app shell** — QA store sidebar with the expanded **Distribution & Logistics**
  group (Route Planning / Delivery Management / Logistic Returns), topbar with page title
  and the Mahesh / Admin user, and clickable navigation between screens.
- **Route Planning** — Delivery Templates tab, searchable table (`Name`, `Customers`,
  `Staff`, `Actions`), and an add/edit **drawer** with a **multi-select Customers + Staff**
  picker. Each option shows an **"N templates"** assignment badge (which other templates
  already use that customer/staff), matching `SearchSelect`/`AssignmentBadge`. Delete confirm.
- **Logistic Returns** — the summary header (**Total Outstanding Returns** with
  `issued · returned · across N customers · N assets`, **In Warehouse** with total assets)
  and three tabs:
  - **Asset Movement** — the `Crate — N outstanding` pill, search, asset/date/sort filters,
    and the per-customer table (`Customer`, `Asset`, `Outstanding`, `Last Transaction`,
    `Delivery By`) with **View Ledger** + **Record Movement**.
  - **Asset Inventory** — `In Warehouse` / `With Customers` / `Total Assets` per asset.
  - **Assets** — the returnable-asset catalogue (`Article No`, `Barcode`, `Unit`, `Status`)
    with **Add Asset** (same drawer + Unit&Price modal as the Products module), **view**
    (asset detail page with the Inventory Summary tiles), **edit** and **delete**.
  - **Record Asset Movement** — a **Return (from customer) / Issue (to customer)** wizard
    (customer → asset → quantity) with live max-quantity validation
    (`Cannot exceed available warehouse stock / outstanding balance of N units`) and the
    `This customer has no outstanding returns` empty state.
- **Delivery Management** — the **mobile-only** Route Delivery execution view: a phone frame
  with the route header (progress, collected), stop cards, and deliver / skip / undo actions.

Interactive actions mutate the in-memory seed and re-render — this is a discovery prototype,
not a wired backend. All counts reconcile: `issued 111 · returned 101 · outstanding 10 ·
in-warehouse 104 · total 114`.

## Layout

Mirrors the other discovery paths (e.g. `products-directory`): a `screens/` folder for the
current working copy, `seed-data/` for canonical JSON, and `versions/` for snapshots.

```
distribution-logistics/
├── index.html                 # launcher → screens/distribution (current)
├── README.md
├── CHANGELOG.md
├── screens/
│   └── distribution/          # ← current working screens (v1)
│       ├── index.html         # path overview + screen cards
│       ├── route-planning.html
│       ├── logistic-returns.html
│       ├── delivery-management.html
│       └── assets/
│           ├── styles.css     # emerald / Windmill-UI design system
│           ├── data.js        # seed data (window.SEED)
│           └── app.js         # shell + screens + working actions
├── seed-data/                 # canonical seed JSON (generated from data.js)
└── versions/
    └── v1/                    # snapshot — "working-actions" (== screens/distribution)
```

## Run it locally

No dependencies. Either open `screens/distribution/index.html` directly, or serve the folder:

```bash
python3 -m http.server 4173
#   → http://localhost:4173/screens/distribution/index.html
```

Then click **Route Planning / Delivery Management / Logistic Returns** in the sidebar.

## Versioning

The live/current version is never edited in place. Each iteration is a full snapshot under
`versions/`. This is **v1** (`working-actions`); the next change ships as `v2`, and so on.

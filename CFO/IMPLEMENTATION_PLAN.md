# CFO Bot — Implementation Plan

---

## 1. Overview

This plan breaks down the CFO Bot into specific components and tasks. It was generated from the SSOT document before any UI code was written, to ensure the implementation matches the specification exactly.

---

## 2. Component Breakdown

| Component | File | Responsibility |
|-----------|------|----------------|
| Pricing Constants | `app.js` → `PRICING` object | Single source of all rate values |
| Input Reader | `app.js` → `runCalculation()` | Read and validate all form fields |
| Validator | `app.js` → validation block | Reject empty, negative, non-numeric inputs |
| Calculator | `app.js` → `costs` object | Apply formulas from SSOT Section 3 |
| Renderer | `app.js` → `renderResult()` | Display breakdown, subtotal, total, insight |
| Error Handler | `app.js` → `showError()` | Show error bubble in chat window |
| UI Layout | `index.html` + `styles.css` | Sidebar, chat window, form panel |
| Deployment | `firebase.json` | Point Firebase Hosting to root directory |

---

## 3. Task Breakdown

### Task 1 — `PRICING` Constants (`app.js`)
> Build this first. All other tasks depend on it.

```js
const PRICING = {
    COMPUTE_HOURLY:  0.05,   // from SSOT Section 2
    STORAGE_GB:      0.02,
    BANDWIDTH_GB:    0.08,
    AI_REQUEST:      0.002,
    DATABASE_TIERS: {
        'Basic':    15,
        'Standard': 40,
        'Premium':  100
    }
};
```

- Values must exactly match SSOT Section 2
- Object must be defined at module level (not inside a function)
- No magic numbers anywhere else in the code — always reference `PRICING`

---

### Task 2 — Input Validation

Validation must run **before** any calculation. Order of checks:

1. Check all 4 required fields are not empty → highlight `.invalid` + show error
2. Parse all values to `float` / `int`
3. Check for `NaN` → show error
4. Check for negative values → show error
5. Check database tier is one of: `Basic`, `Standard`, `Premium`

---

### Task 3 — Calculation Logic

```js
const costs = {
    Compute:   computeHours * PRICING.COMPUTE_HOURLY,
    Storage:   storageGB    * PRICING.STORAGE_GB,
    Bandwidth: bandwidthGB  * PRICING.BANDWIDTH_GB,
    Database:  PRICING.DATABASE_TIERS[dbTier],
    AI:        aiRequests   * PRICING.AI_REQUEST
};

const subtotal        = Object.values(costs).reduce((a, b) => a + b, 0);
const contingencyCost = subtotal * (contingencyPct / 100);
const total           = subtotal + contingencyCost;
```

- Must match SSOT Section 3.1 and 3.2 exactly
- Round all display values to 2 decimal places using `.toFixed(2)`

---

### Task 4 — Top Driver Detection

```js
let topDriver = '';
let topValue  = -1;
for (const [key, val] of Object.entries(costs)) {
    if (val > topValue) { topValue = val; topDriver = key; }
}
```

---

### Task 5 — Result Rendering (`renderResult`)

The result must appear inside `#result-area` as a chat bubble containing:
- `.result-intro` — label line: `// monthly cost projection`
- `.breakdown` — all line items + subtotal + contingency + total
- `.insight-box` — top driver message

---

### Task 6 — HTML Form (`index.html`)

Required form fields (all `id` values must match `app.js`):

| HTML `id` | Type | Notes |
|-----------|------|-------|
| `compute` | `input[type=number]` | required |
| `storage` | `input[type=number]` | required |
| `bandwidth` | `input[type=number]` | required |
| `ai` | `input[type=number]` | required |
| `database` | `select` | options: Basic, Standard, Premium |
| `contingency` | `input[type=number]` | optional |
| `calc-form` | `form` | submit triggers calculation |
| `result-area` | `div` | result renders here |

---

### Task 7 — Firebase Deployment

```json
{
  "hosting": {
    "public": ".",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"]
  }
}
```

- Public dir is `.` (root) — all files served from project root
- Run `firebase deploy` to publish

---

## 4. Recommended Build Order

| Step | Task | Done when... |
|------|------|-------------|
| 1 | Write `PRICING` constants in `app.js` | Values match SSOT exactly |
| 2 | Write HTML form in `index.html` | All field IDs exist, form renders |
| 3 | Write validation logic | All 5 test cases from Section 6 of SSOT pass |
| 4 | Write calculation logic | All math test cases pass |
| 5 | Write `renderResult()` | Result displays correctly in browser |
| 6 | Write `styles.css` | Layout matches spec, responsive on mobile |
| 7 | Deploy to Firebase | Public URL works, shows correct results |

---

## 5. Division of Work (4 people)

| Person | Task |
|--------|------|
| Person 1 | `app.js` — PRICING constants, calculation logic, top driver |
| Person 2 | `app.js` — validation, error handling, reset |
| Person 3 | `index.html` — form structure, chat window, layout |
| Person 4 | `styles.css` — visual design + Firebase deployment |

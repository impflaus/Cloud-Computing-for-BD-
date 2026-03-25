# CFO Bot — System Specification (SSOT)

---

## 1. What is this project?

CFO Bot is a **cloud cost estimation web app** that calculates monthly GCP infrastructure costs based on user inputs. The user fills in a form with usage parameters and the bot instantly shows an itemized cost breakdown.

The app is a **static single-page application** deployed to **Google Firebase Hosting**. All calculations run in the browser — no backend required.

> ⚠️ This document is the Single Source of Truth (SSOT). All code must follow the formulas and rules defined here.

---

## 2. Supported Services & Pricing

These are the **exact prices** the app uses. No other values are allowed.

| Service | Pricing Model | Rate |
|---------|--------------|------|
| Compute | Per compute-hour | **$0.05 / hour** |
| Storage | Per GB stored | **$0.02 / GB** |
| Bandwidth | Per GB transferred | **$0.08 / GB** |
| AI Requests | Per API call | **$0.002 / request** |
| Database — Basic | Flat monthly fee | **$15.00 / month** |
| Database — Standard | Flat monthly fee | **$40.00 / month** |
| Database — Premium | Flat monthly fee | **$100.00 / month** |

---

## 3. Pricing Formulas

### 3.1 Line Item Costs

```
compute_cost   = compute_hours  × 0.05
storage_cost   = storage_gb     × 0.02
bandwidth_cost = bandwidth_gb   × 0.08
ai_cost        = ai_requests    × 0.002
database_cost  = flat_rate (15 | 40 | 100)
```

### 3.2 Subtotal & Contingency

```
subtotal         = compute_cost + storage_cost + bandwidth_cost + database_cost + ai_cost
contingency_cost = subtotal × (contingency_pct / 100)
total            = subtotal + contingency_cost
```

### 3.3 Top Cost Driver

```
top_driver = service with the highest individual cost value
```

---

## 4. Input Fields

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Compute Hours/mo | Number | ✅ Yes | >= 0, not empty |
| Storage (GB) | Number | ✅ Yes | >= 0, not empty |
| Bandwidth (GB) | Number | ✅ Yes | >= 0, not empty |
| AI Requests | Number | ✅ Yes | >= 0, not empty |
| Database Tier | Select | ✅ Yes | Basic / Standard / Premium |
| Contingency (%) | Number | ❌ No | 0–100, defaults to 0 if empty |

**Validation rules:**
- All required fields must be filled before calculation runs
- No negative numbers allowed in any field
- Non-numeric input must be rejected with an error message
- Invalid database tier selection must be rejected

---

## 5. Output Requirements

When the calculation runs, the result must display:

1. **Line items** — one row per service: label + `$XX.XX`
2. **Subtotal row** — sum of all line items
3. **Contingency row** — `Contingency (X%) — $XX.XX`
4. **Total row** — final monthly cost, prominently displayed
5. **Insight message** — identifies the top cost driver

Format: `"Your largest cost driver is [Service] ($XX.XX). Focus optimization efforts here to reduce monthly burn."`

All monetary values must be formatted to **2 decimal places**.

---

## 6. Architecture

| Layer | Technology | Responsibility |
|-------|-----------|----------------|
| UI | HTML5 + CSS3 | Form inputs, layout, result display |
| Logic | `app.js` (vanilla JS) | Validation, calculation, rendering |
| Styling | `styles.css` | Visual design, responsive layout |
| Hosting | Firebase Hosting | Static file serving, HTTPS, CDN |

**Constraints:**
- `PRICING` constants in `app.js` must not be changed without updating this document
- All calculations happen client-side — no external API calls
- App must work without a backend or database
- Must be deployable with `firebase deploy`

---

## 7. UI/UX Requirements

- **Layout:** Sidebar (pricing legend) + main area (chat window + form)
- **Form:** Two-column grid on desktop, single column on mobile (`< 520px`)
- **Result:** Displayed inside the chat window as a bot message
- **Error state:** Invalid inputs highlighted in red, error message shown in chat
- **Reset:** Clears all inputs and result area
- **Responsive:** Works on screens >= 320px wide

---

## 8. Glossary

| Term | Meaning |
|------|---------|
| SSOT | Single Source of Truth — this document |
| SDD | Spec-Driven Development — spec before code |
| Contingency | Buffer percentage added on top of subtotal for unexpected costs |
| Top Driver | The single service with the highest monthly cost |
| Firebase Hosting | Google's static website hosting with free HTTPS |
| Line Item | One row in the cost breakdown (service + amount) |

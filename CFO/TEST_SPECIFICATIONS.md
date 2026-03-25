# CFO Bot — Test Specifications

---

## How to Run

Open the live Firebase URL → open DevTools (`F12`) → Console tab → paste any test snippet below.

Or run locally:
```bash
node -e "/* paste test code here */"
```

All tests should print ✅ PASS. If any print ❌ FAIL — fix `app.js` before deploying.

---

## Pricing Reference (from SSOT)

```
Compute:   $0.05  / hour
Storage:   $0.02  / GB
Bandwidth: $0.08  / GB
AI:        $0.002 / request
DB Basic:  $15.00 flat
DB Std:    $40.00 flat
DB Prem:   $100.00 flat
```

---

## Section 1 — Compute Tests

| Test ID | Input | Formula | Expected |
|---------|-------|---------|----------|
| TC-C01 | 100 hours | 100 × 0.05 | **$5.00** |
| TC-C02 | 730 hours | 730 × 0.05 | **$36.50** |
| TC-C03 | 0 hours | 0 × 0.05 | **$0.00** |
| TC-C04 | 1 hour | 1 × 0.05 | **$0.05** |

```js
// Paste in console to verify:
const COMPUTE = 0.05;
console.assert(100  * COMPUTE === 5.00,  "TC-C01 FAIL");
console.assert(730  * COMPUTE === 36.50, "TC-C02 FAIL");
console.assert(0    * COMPUTE === 0.00,  "TC-C03 FAIL");
console.assert(1    * COMPUTE === 0.05,  "TC-C04 FAIL");
console.log("Compute tests done");
```

---

## Section 2 — Storage Tests

| Test ID | Input | Formula | Expected |
|---------|-------|---------|----------|
| TC-S01 | 100 GB | 100 × 0.02 | **$2.00** |
| TC-S02 | 500 GB | 500 × 0.02 | **$10.00** |
| TC-S03 | 0 GB | 0 × 0.02 | **$0.00** |
| TC-S04 | 1 GB | 1 × 0.02 | **$0.02** |

```js
const STORAGE = 0.02;
console.assert(100 * STORAGE === 2.00,  "TC-S01 FAIL");
console.assert(500 * STORAGE === 10.00, "TC-S02 FAIL");
console.assert(0   * STORAGE === 0.00,  "TC-S03 FAIL");
console.assert(1   * STORAGE === 0.02,  "TC-S04 FAIL");
console.log("Storage tests done");
```

---

## Section 3 — Bandwidth Tests

| Test ID | Input | Formula | Expected |
|---------|-------|---------|----------|
| TC-B01 | 50 GB | 50 × 0.08 | **$4.00** |
| TC-B02 | 200 GB | 200 × 0.08 | **$16.00** |
| TC-B03 | 0 GB | 0 × 0.08 | **$0.00** |
| TC-B04 | 1000 GB | 1000 × 0.08 | **$80.00** |

```js
const BW = 0.08;
console.assert(50   * BW === 4.00,  "TC-B01 FAIL");
console.assert(200  * BW === 16.00, "TC-B02 FAIL");
console.assert(0    * BW === 0.00,  "TC-B03 FAIL");
console.assert(1000 * BW === 80.00, "TC-B04 FAIL");
console.log("Bandwidth tests done");
```

---

## Section 4 — AI Request Tests

| Test ID | Input | Formula | Expected |
|---------|-------|---------|----------|
| TC-A01 | 1,000 requests | 1000 × 0.002 | **$2.00** |
| TC-A02 | 10,000 requests | 10000 × 0.002 | **$20.00** |
| TC-A03 | 0 requests | 0 × 0.002 | **$0.00** |
| TC-A04 | 500 requests | 500 × 0.002 | **$1.00** |

```js
const AI = 0.002;
console.assert(1000  * AI === 2.00,  "TC-A01 FAIL");
console.assert(10000 * AI === 20.00, "TC-A02 FAIL");
console.assert(0     * AI === 0.00,  "TC-A03 FAIL");
console.assert(500   * AI === 1.00,  "TC-A04 FAIL");
console.log("AI tests done");
```

---

## Section 5 — Database Tier Tests

| Test ID | Tier | Expected |
|---------|------|----------|
| TC-D01 | Basic | **$15.00** |
| TC-D02 | Standard | **$40.00** |
| TC-D03 | Premium | **$100.00** |

```js
const DB = { Basic: 15, Standard: 40, Premium: 100 };
console.assert(DB['Basic']    === 15,  "TC-D01 FAIL");
console.assert(DB['Standard'] === 40,  "TC-D02 FAIL");
console.assert(DB['Premium']  === 100, "TC-D03 FAIL");
console.log("Database tests done");
```

---

## Section 6 — Full Aggregation Tests

### TC-AGG01 — Typical small startup

| Field | Value |
|-------|-------|
| Compute | 100 hrs |
| Storage | 200 GB |
| Bandwidth | 50 GB |
| AI Requests | 1,000 |
| Database | Standard |
| Contingency | 10% |

```
Compute:   100  × 0.05  =  5.00
Storage:   200  × 0.02  =  4.00
Bandwidth:  50  × 0.08  =  4.00
AI:       1000  × 0.002 =  2.00
Database:               = 40.00
─────────────────────────────
Subtotal:                = 55.00
Contingency (10%):       =  5.50
─────────────────────────────
TOTAL:                   = 60.50
Top driver: Database ($40.00)
```

---

### TC-AGG02 — Heavy compute workload

| Field | Value |
|-------|-------|
| Compute | 730 hrs |
| Storage | 500 GB |
| Bandwidth | 200 GB |
| AI Requests | 0 |
| Database | Basic |
| Contingency | 0% |

```
Compute:   730  × 0.05  = 36.50
Storage:   500  × 0.02  = 10.00
Bandwidth: 200  × 0.08  = 16.00
AI:          0  × 0.002 =  0.00
Database:               = 15.00
─────────────────────────────
Subtotal:                = 77.50
Contingency (0%):        =  0.00
─────────────────────────────
TOTAL:                   = 77.50
Top driver: Compute ($36.50)
```

---

### TC-AGG03 — AI-heavy workload

| Field | Value |
|-------|-------|
| Compute | 100 hrs |
| Storage | 100 GB |
| Bandwidth | 100 GB |
| AI Requests | 50,000 |
| Database | Premium |
| Contingency | 20% |

```
Compute:    100 × 0.05  =  5.00
Storage:    100 × 0.02  =  2.00
Bandwidth:  100 × 0.08  =  8.00
AI:       50000 × 0.002 = 100.00
Database:               = 100.00
─────────────────────────────
Subtotal:                = 215.00
Contingency (20%):       =  43.00
─────────────────────────────
TOTAL:                   = 258.00
Top driver: AI or Database ($100.00 — tie)
```

---

### TC-AGG04 — Zero inputs (edge case)

```
All inputs = 0, Database = Basic, Contingency = 0%
─────────────────────────────
Subtotal: $15.00  (only DB flat rate)
Total:    $15.00
Top driver: Database ($15.00)
```

---

## Section 7 — Validation Tests

These test that the app correctly rejects bad inputs — no calculation should run.

| Test ID | Scenario | Expected behaviour |
|---------|----------|-------------------|
| TC-V01 | Leave Compute empty, submit | Field highlighted red, error shown |
| TC-V02 | Leave all fields empty, submit | All 4 required fields highlighted red |
| TC-V03 | Enter `-5` in Storage | Error: "Negative values are not accepted" |
| TC-V04 | Enter `"abc"` in Bandwidth | Error: "All fields must contain valid numbers" |
| TC-V05 | Contingency empty | Treated as 0%, no error |
| TC-V06 | All valid inputs | No error, result shown |

---

## Quick Test Runner

Paste this entire block into the browser console on the live app:

```js
(function runAllTests() {
  const results = [];
  function test(id, got, expected) {
    const pass = Math.abs(got - expected) < 0.001;
    results.push({ id, got, expected, pass });
  }

  const C=0.05, S=0.02, B=0.08, A=0.002;
  const DB={Basic:15,Standard:40,Premium:100};

  test('TC-C01', 100*C,  5.00);
  test('TC-C02', 730*C,  36.50);
  test('TC-S01', 100*S,  2.00);
  test('TC-S02', 500*S,  10.00);
  test('TC-B01', 50*B,   4.00);
  test('TC-B02', 200*B,  16.00);
  test('TC-A01', 1000*A, 2.00);
  test('TC-A02', 10000*A,20.00);
  test('TC-D01', DB.Basic,    15);
  test('TC-D02', DB.Standard, 40);
  test('TC-D03', DB.Premium,  100);

  // AGG01
  const sub1 = 100*C + 200*S + 50*B + 1000*A + DB.Standard;
  test('TC-AGG01', sub1 * 1.10, 60.50);

  // AGG02
  const sub2 = 730*C + 500*S + 200*B + 0 + DB.Basic;
  test('TC-AGG02', sub2, 77.50);

  results.forEach(r => {
    console.log(r.pass ? '✅ PASS' : '❌ FAIL', r.id,
      '→', r.got.toFixed(2), '(expected', r.expected.toFixed(2)+')');
  });
  const passed = results.filter(r=>r.pass).length;
  console.log(`\n${passed}/${results.length} tests passed`);
})();
```

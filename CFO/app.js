// ─────────────────────────────────────────────
//  CFO Bot — Pricing Engine
//  Deterministic model (SSOT v1.0)
// ─────────────────────────────────────────────

const PRICING = {
    COMPUTE_HOURLY:   0.05,
    STORAGE_GB:       0.02,
    BANDWIDTH_GB:     0.08,
    AI_REQUEST:       0.002,
    DATABASE_TIERS: {
        'Basic':    15,
        'Standard': 40,
        'Premium':  100
    }
};

// ── DOM Ready ──────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

    const form        = document.getElementById('calc-form');
    const resultArea  = document.getElementById('result-area');
    const messagesBox = document.getElementById('messages');

    // Submit
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearInvalid();
        runCalculation();
    });

    // Reset
    form.addEventListener('reset', () => {
        clearInvalid();
        resultArea.innerHTML = '';
    });

    // ── Main Calculation ───────────────────
    function runCalculation() {

        // 1. Read raw values
        const computeRaw     = document.getElementById('compute').value.trim();
        const storageRaw     = document.getElementById('storage').value.trim();
        const bandwidthRaw   = document.getElementById('bandwidth').value.trim();
        const aiRaw          = document.getElementById('ai').value.trim();
        const dbTier         = document.getElementById('database').value;
        const contingencyRaw = document.getElementById('contingency').value.trim();

        // 2. Required-field check
        const requiredMap = {
            compute:   computeRaw,
            storage:   storageRaw,
            bandwidth: bandwidthRaw,
            ai:        aiRaw
        };

        let missingFields = false;
        for (const [id, val] of Object.entries(requiredMap)) {
            if (val === '') {
                document.getElementById(id).classList.add('invalid');
                missingFields = true;
            }
        }

        if (missingFields) {
            showError('Please fill in all required fields before running the estimate.');
            return;
        }

        // 3. Parse to numbers
        const computeHours      = parseFloat(computeRaw);
        const storageGB         = parseFloat(storageRaw);
        const bandwidthGB       = parseFloat(bandwidthRaw);
        const aiRequests        = parseFloat(aiRaw);
        const contingencyPct    = contingencyRaw === '' ? 0 : parseFloat(contingencyRaw);

        // 4. NaN check
        if ([computeHours, storageGB, bandwidthGB, aiRequests, contingencyPct].some(isNaN)) {
            showError('All fields must contain valid numbers.');
            return;
        }

        // 5. Negative value check
        if (computeHours < 0 || storageGB < 0 || bandwidthGB < 0 || aiRequests < 0 || contingencyPct < 0) {
            showError('Negative values are not accepted. Please correct your inputs.');
            return;
        }

        // 6. Database tier check
        if (!Object.prototype.hasOwnProperty.call(PRICING.DATABASE_TIERS, dbTier)) {
            showError('Invalid database tier selected.');
            return;
        }

        // 7. Compute line items
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

        // 8. Find top cost driver
        let topDriver = '';
        let topValue  = -1;
        for (const [key, val] of Object.entries(costs)) {
            if (val > topValue) {
                topValue  = val;
                topDriver = key;
            }
        }

        // 9. Render
        renderResult(costs, subtotal, contingencyCost, total, contingencyPct, topDriver);
    }

    // ── Render Result ──────────────────────
    function renderResult(costs, subtotal, contingency, total, pct, driver) {

        const lineItems = Object.entries(costs).map(([name, amount]) => `
            <div class="line-item">
                <span class="label">${name}</span>
                <span class="value">$${amount.toFixed(2)}</span>
            </div>
        `).join('');

        resultArea.innerHTML = `
            <div class="result-msg enter">
                <div class="msg-avatar">$</div>
                <div class="result-bubble">
                    <div class="result-intro">// monthly cost projection</div>
                    <div class="breakdown">
                        ${lineItems}
                        <div class="line-item line-subtotal">
                            <span class="label">Subtotal</span>
                            <span class="value">$${subtotal.toFixed(2)}</span>
                        </div>
                        <div class="line-item">
                            <span class="label">Contingency (${pct}%)</span>
                            <span class="value">$${contingency.toFixed(2)}</span>
                        </div>
                        <div class="line-item line-total">
                            <span class="label">Total / month</span>
                            <span class="value">$${total.toFixed(2)}</span>
                        </div>
                    </div>
                    <div class="insight-box">
                        <strong>Insight:</strong> Your largest cost driver is <strong>${driver}</strong>
                        ($${costs[driver].toFixed(2)}).
                        Focus optimization efforts here to reduce monthly burn.
                    </div>
                </div>
            </div>
        `;

        // Scroll results into view
        resultArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // ── Show Error ─────────────────────────
    function showError(message) {
        resultArea.innerHTML = `
            <div class="result-msg enter">
                <div class="msg-avatar" style="background:#fee2e2;color:#dc2626;">!</div>
                <div class="error-bubble">
                    <span>⚠ ${message}</span>
                </div>
            </div>
        `;
    }

    // ── Clear invalid state ────────────────
    function clearInvalid() {
        document.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
    }

});

/**
 * Water Resources and Management - Interactive Water Usage Calculator
 * Real-time calculation, WHO benchmark comparison, SVG circle gauge, and DB logging
 */

document.addEventListener('DOMContentLoaded', () => {
    initWaterCalculator();
});

function initWaterCalculator() {
    // Inputs & Sliders
    const familySizeInput = document.getElementById('calcFamilySize');
    const showerMinutesInput = document.getElementById('calcShowerMin');
    const flushCountInput = document.getElementById('calcFlushes');
    const tapMinutesInput = document.getElementById('calcTapMin');
    const dishMethodSelect = document.getElementById('calcDishes');
    const laundryLoadsInput = document.getElementById('calcLaundry');
    const gardenMinutesInput = document.getElementById('calcGarden');
    const leakCheck = document.getElementById('calcLeaks');

    // Display Badges for live sliders
    const familyBadge = document.getElementById('valFamilySize');
    const showerBadge = document.getElementById('valShowerMin');
    const flushBadge = document.getElementById('valFlushes');
    const tapBadge = document.getElementById('valTapMin');
    const laundryBadge = document.getElementById('valLaundry');
    const gardenBadge = document.getElementById('valGarden');

    // Results elements
    const gaugeNumber = document.getElementById('calcDailyTotal');
    const perCapitaDisplay = document.getElementById('calcPerCapita');
    const monthlyDisplay = document.getElementById('calcMonthly');
    const annualDisplay = document.getElementById('calcAnnual');
    const gradeBadge = document.getElementById('calcGradeBadge');
    const gaugeBar = document.getElementById('gaugeCircleBar');
    const tipsBox = document.getElementById('calcPersonalizedTips');

    // Buttons
    const saveAuditBtn = document.getElementById('saveAuditBtn');
    const printAuditBtn = document.getElementById('printAuditBtn');

    if (!familySizeInput || !gaugeNumber) return;

    function recalculate() {
        const family = parseInt(familySizeInput.value) || 1;
        const showerMin = parseInt(showerMinutesInput.value) || 0;
        const flushes = parseInt(flushCountInput.value) || 0;
        const tapMin = parseInt(tapMinutesInput.value) || 0;
        const dishMethod = dishMethodSelect ? dishMethodSelect.value : 'hand';
        const laundryLoads = parseInt(laundryLoadsInput.value) || 0;
        const gardenMin = parseInt(gardenMinutesInput.value) || 0;
        const hasLeaks = leakCheck && leakCheck.checked;

        // Update Slider Badges
        if (familyBadge) familyBadge.textContent = `${family} Member${family > 1 ? 's' : ''}`;
        if (showerBadge) showerBadge.textContent = `${showerMin} min/day`;
        if (flushBadge) flushBadge.textContent = `${flushes} flushes/day`;
        if (tapBadge) tapBadge.textContent = `${tapMin} min/day`;
        if (laundryBadge) laundryBadge.textContent = `${laundryLoads} loads/wk`;
        if (gardenBadge) gardenBadge.textContent = `${gardenMin} min/day`;

        // Mathematical Breakdown (in Liters)
        const showerLiters = family * (showerMin * 9); // Average shower head = 9 L/min
        const flushLiters = family * (flushes * 7);    // Modern dual-flush avg = 7 L/flush
        const tapLiters = family * (tapMin * 6);       // Running sink tap = 6 L/min
        const dishLiters = dishMethod === 'dishwasher' ? 14 : 32; // Daily dish cycle
        const laundryLiters = Math.round((laundryLoads * 55) / 7); // 55L per load distributed daily
        const gardenLiters = gardenMin * 11;           // Outdoor garden hose = 11 L/min
        const leakLiters = hasLeaks ? 28 : 0;          // Continuous dripping faucet avg 28 L/day

        const totalDaily = showerLiters + flushLiters + tapLiters + dishLiters + laundryLiters + gardenLiters + leakLiters;
        const perCapitaDaily = Math.round(totalDaily / family);
        const monthlyTotal = Math.round(totalDaily * 30);
        const annualTotal = Math.round(totalDaily * 365);
        const annualCubicMeters = (annualTotal / 1000).toFixed(1);

        // Update UI
        gaugeNumber.textContent = totalDaily.toLocaleString();
        if (perCapitaDisplay) perCapitaDisplay.textContent = `${perCapitaDaily} L / person`;
        if (monthlyDisplay) monthlyDisplay.textContent = `${(monthlyTotal / 1000).toFixed(1)} m³ (${monthlyTotal.toLocaleString()} L)`;
        if (annualDisplay) annualDisplay.textContent = `${annualCubicMeters} m³ (${annualTotal.toLocaleString()} L)`;

        // SVG Gauge Circle Offset (Circumference ~ 565)
        // Benchmark: 0 to 600 Liters per capita or 0 to 1200 household
        const maxExpected = 1000;
        const percentage = Math.min(1, totalDaily / maxExpected);
        const offset = 565 - (565 * percentage);
        if (gaugeBar) {
            gaugeBar.style.strokeDashoffset = offset;
        }

        // Efficiency Grading (WHO benchmark is 135 L/person/day)
        let gradeText = '';
        let gradeClass = '';
        let primaryTip = '';

        if (perCapitaDaily <= 85) {
            gradeText = 'Eco Hero (Highly Efficient)';
            gradeClass = 'grade-excellent';
            primaryTip = '🌟 Stellar performance! Your water usage is well below national averages. Consider inspiring your campus community to adopt similar habits.';
        } else if (perCapitaDaily <= 135) {
            gradeText = 'Sustainable (Within WHO Norm)';
            gradeClass = 'grade-moderate';
            primaryTip = '💧 Great job! You conform to the WHO recommended benchmark of 135 Liters/person/day. Installing tap aerators could lower this by another 15%.';
        } else if (perCapitaDaily <= 220) {
            gradeText = 'Elevated Consumption (Action Needed)';
            gradeClass = 'grade-high';
            primaryTip = '⚠️ Noticeable water loss detected. Cutting your shower time by 3 minutes and turning off the tap while lathering can save over 40 Liters daily.';
        } else {
            gradeText = 'Critical Wastage (Immediate Attention)';
            gradeClass = 'grade-critical';
            primaryTip = '🚨 Heavy water footprint alert! Your consumption is over 60% above the international benchmark. Inspect pipe leaks and avoid running hosepipes for cleaning.';
        }

        if (gradeBadge) {
            gradeBadge.textContent = gradeText;
            gradeBadge.className = `calc-grade-badge ${gradeClass}`;
        }

        if (tipsBox) {
            tipsBox.innerHTML = `
                <div style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6;">
                    <strong style="color: var(--aqua-primary);">Auditor Analysis:</strong> ${primaryTip}
                </div>
            `;
        }

        // Store last calculation in session
        window.lastWaterAudit = {
            family_members: family,
            daily_liters: totalDaily,
            monthly_liters: monthlyTotal,
            annual_liters: annualTotal,
            per_capita_daily: perCapitaDaily,
            efficiency_grade: gradeText,
            breakdown: {
                shower: showerLiters,
                flush: flushLiters,
                taps: tapLiters,
                kitchen: dishLiters,
                laundry: laundryLiters,
                garden: gardenLiters,
                leaks: leakLiters
            }
        };
    }

    // Attach real-time input listeners
    const allInputs = [
        familySizeInput, showerMinutesInput, flushCountInput,
        tapMinutesInput, dishMethodSelect, laundryLoadsInput,
        gardenMinutesInput, leakCheck
    ];

    allInputs.forEach(input => {
        if (input) {
            input.addEventListener('input', recalculate);
            input.addEventListener('change', recalculate);
        }
    });

    // Initial run
    recalculate();

    // Save Audit to Database button
    if (saveAuditBtn) {
        saveAuditBtn.addEventListener('click', () => {
            const auditData = window.lastWaterAudit;
            if (!auditData) return;

            saveAuditBtn.disabled = true;
            saveAuditBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving Audit...';

            window.ApiClient.saveWaterRecord(auditData)
                .then(res => {
                    alert('✅ Success! Your water footprint audit has been saved to the MySQL database.');
                    saveAuditBtn.disabled = false;
                    saveAuditBtn.innerHTML = '<i class="fas fa-check-circle"></i> Audit Saved Successfully';
                    setTimeout(() => {
                        saveAuditBtn.innerHTML = '<i class="fas fa-database"></i> Save Audit to Database';
                    }, 3500);
                })
                .catch(err => {
                    console.warn('API notice:', err);
                    alert('ℹ️ Audit recorded in local session! Connect to MySQL/PHP backend to persist permanently.');
                    saveAuditBtn.disabled = false;
                    saveAuditBtn.innerHTML = '<i class="fas fa-database"></i> Save Audit to Database';
                });
        });
    }

    // Print / Export Water Audit
    if (printAuditBtn) {
        printAuditBtn.addEventListener('click', () => {
            const audit = window.lastWaterAudit;
            if (!audit) return;

            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Water Footprint Audit Certificate</title>
                    <style>
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #0a2540; }
                        .cert { border: 3px solid #0077b6; padding: 30px; border-radius: 12px; max-width: 650px; margin: 0 auto; }
                        h1 { color: #0077b6; margin-bottom: 5px; }
                        .tag { color: #555; font-size: 14px; margin-bottom: 25px; }
                        .metric-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px dashed #ccc; }
                        .bold { font-weight: bold; }
                        .grade { background: #e0f7fa; color: #006064; padding: 6px 14px; border-radius: 20px; display: inline-block; font-weight: bold; margin-top: 15px; }
                        .footer { margin-top: 30px; font-size: 12px; color: #777; text-align: center; }
                    </style>
                </head>
                <body>
                    <div class="cert">
                        <h1>WATER RESOURCES & MANAGEMENT</h1>
                        <div class="tag">B.Tech CSE Project Environmental Water Audit Report</div>
                        <hr style="border: 0; border-top: 1px solid #0077b6; margin-bottom: 20px;">
                        <div class="metric-row"><span class="bold">Household Members:</span> <span>${audit.family_members}</span></div>
                        <div class="metric-row"><span class="bold">Total Daily Consumption:</span> <span>${audit.daily_liters} Liters</span></div>
                        <div class="metric-row"><span class="bold">Per-Capita Daily Usage:</span> <span>${audit.per_capita_daily} Liters / person / day</span></div>
                        <div class="metric-row"><span class="bold">Monthly Projected Volume:</span> <span>${audit.monthly_liters} Liters (${(audit.monthly_liters/1000).toFixed(1)} m³)</span></div>
                        <div class="metric-row"><span class="bold">Annual Projected Volume:</span> <span>${audit.annual_liters} Liters (${(audit.annual_liters/1000).toFixed(1)} m³)</span></div>
                        <div class="metric-row"><span class="bold">WHO Standard Benchmark:</span> <span>135 Liters / person / day</span></div>
                        <div style="text-align: center; margin-top: 20px;">
                            <div class="grade">Efficiency Rating: ${audit.efficiency_grade}</div>
                        </div>
                        <div class="footer">
                            Generated by Water Resources & Management Engineering Portal<br>
                            "Every Drop Counts. Every Action Matters."
                        </div>
                    </div>
                    <script>window.onload = function() { window.print(); };</script>
                </body>
                </html>
            `);
            printWindow.document.close();
        });
    }
}

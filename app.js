/* ═══════════════════════════════════════════════════════════════════
   APP.JS — UI Logic, Particles, Animations
   ═══════════════════════════════════════════════════════════════════ */

// ── State ────────────────────────────────────────────────────────────
let varCount = 2;
let conCount = 2;
let isMax = true;

// ── Particle System ──────────────────────────────────────────────────
(function initParticles() {
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.4 + 0.1;
            this.hue = Math.random() > 0.5 ? 240 : 270; // indigo or purple
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Mouse attraction
            if (mouse.x !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 200) {
                    this.x += dx * 0.002;
                    this.y += dy * 0.002;
                    this.opacity = Math.min(0.7, this.opacity + 0.01);
                }
            }

            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 80%, 70%, ${this.opacity})`;
            ctx.fill();
        }
    }

    const count = Math.min(120, Math.floor(window.innerWidth * window.innerHeight / 12000));
    for (let i = 0; i < count; i++) particles.push(new Particle());

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(99, 102, 241, ${0.08 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        connectParticles();
        requestAnimationFrame(animate);
    }
    animate();
})();

// ── Header Scroll ────────────────────────────────────────────────────
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    header.classList.toggle('scrolled', window.scrollY > 50);
});

// ── Scroll to input ──────────────────────────────────────────────────
function scrollToInput() {
    document.getElementById('input-section').scrollIntoView({ behavior: 'smooth' });
}

// ── Toggle Max/Min ───────────────────────────────────────────────────
document.getElementById('btn-max').addEventListener('click', function() {
    isMax = true;
    this.classList.add('active');
    document.getElementById('btn-min').classList.remove('active');
    updatePreview();
});
document.getElementById('btn-min').addEventListener('click', function() {
    isMax = false;
    this.classList.add('active');
    document.getElementById('btn-max').classList.remove('active');
    updatePreview();
});

// ── Steppers ─────────────────────────────────────────────────────────
function adjustVar(delta) {
    const el = document.getElementById('var-count');
    const v = Math.max(1, Math.min(10, parseInt(el.value) + delta));
    el.value = v;
    varCount = v;
    // Pulsar effect
    el.style.color = '#6366f1';
    setTimeout(() => el.style.color = 'white', 300);
}
function adjustCon(delta) {
    const el = document.getElementById('con-count');
    const v = Math.max(1, Math.min(10, parseInt(el.value) + delta));
    el.value = v;
    conCount = v;
    el.style.color = '#6366f1';
    setTimeout(() => el.style.color = 'white', 300);
}

// ── Generate Inputs ──────────────────────────────────────────────────
function generateInputs(silent) {
    varCount = parseInt(document.getElementById('var-count').value);
    conCount = parseInt(document.getElementById('con-count').value);

    const card = document.getElementById('coeff-card');
    card.classList.remove('hidden');
    card.style.animation = 'scaleIn 0.5s ease-out';

    const form = document.getElementById('coeff-form');
    let html = '';

    // Objective function
    html += '<div class="obj-section">';
    html += `<div class="section-label">${t('objFn')}</div>`;
    html += '<div class="coeff-row">';
    html += `<span class="op-label" style="color:var(--indigo);font-weight:700;">${isMax ? 'max' : 'min'} Z =</span>`;
    for (let j = 0; j < varCount; j++) {
        if (j > 0) html += '<span class="op-label">+</span>';
        html += `<div class="coeff-input-wrap">
            <input type="number" class="coeff-input" id="obj-${j}" value="0" step="any" oninput="updatePreview()">
            <span class="var-label">x<sub>${j + 1}</sub></span>
        </div>`;
    }
    html += '</div></div>';

    // Constraints
    html += '<div class="con-section">';
    html += `<div class="section-label">${t('consLeq')}</div>`;
    for (let i = 0; i < conCount; i++) {
        html += `<div class="coeff-row">`;
        html += `<span class="con-label">C${i + 1} :</span>`;
        for (let j = 0; j < varCount; j++) {
            if (j > 0) html += '<span class="op-label">+</span>';
            html += `<div class="coeff-input-wrap">
                <input type="number" class="coeff-input" id="con-${i}-${j}" value="0" step="any" oninput="updatePreview()">
                <span class="var-label">x<sub>${j + 1}</sub></span>
            </div>`;
        }
        html += '<span class="leq-symbol">≤</span>';
        html += `<input type="number" class="bi-input" id="bi-${i}" value="0" step="any" oninput="updatePreview()">`;
        html += '</div>';
    }
    html += '</div>';

    form.innerHTML = html;

    // Show preview card
    const preview = document.getElementById('preview-card');
    preview.classList.remove('hidden');
    preview.style.animation = 'fadeInUp 0.5s ease-out';

    updatePreview();
    if (!silent) showToast(t('formGenerated'), 'success');

    // Scroll to form
    setTimeout(() => card.scrollIntoView({ behavior: 'smooth', block: 'center' }), 200);
}

// ── Update Preview ───────────────────────────────────────────────────
function updatePreview() {
    const preview = document.getElementById('problem-preview');
    if (!preview) return;

    let html = '';

    // Objective
    html += `<div style="margin-bottom:8px;"><span style="color:var(--indigo);font-weight:700;">${isMax ? 'max' : 'min'}</span> Z = `;
    for (let j = 0; j < varCount; j++) {
        const v = parseFloat(document.getElementById(`obj-${j}`)?.value || 0);
        if (j > 0 && v >= 0) html += ' + ';
        else if (j > 0 && v < 0) html += ' ';
        html += `<span style="color:var(--cyan)">${fmtCoeff(v, j === 0)}</span>x<sub>${j + 1}</sub>`;
    }
    html += '</div>';

    // s.c.
    html += '<div style="margin-bottom:4px;color:var(--text-muted);font-size:0.85rem;">s.c.</div>';

    for (let i = 0; i < conCount; i++) {
        html += '<div style="padding-left:24px;">';
        for (let j = 0; j < varCount; j++) {
            const v = parseFloat(document.getElementById(`con-${i}-${j}`)?.value || 0);
            if (j > 0 && v >= 0) html += ' + ';
            else if (j > 0 && v < 0) html += ' ';
            html += `<span style="color:var(--purple)">${fmtCoeff(v, j === 0)}</span>x<sub>${j + 1}</sub>`;
        }
        const bi = parseFloat(document.getElementById(`bi-${i}`)?.value || 0);
        html += ` <span style="color:var(--emerald)">≤</span> <span style="color:var(--amber)">${bi}</span>`;
        html += '</div>';
    }

    // Non-negativity
    html += '<div style="padding-left:24px;margin-top:4px;">';
    for (let j = 0; j < varCount; j++) {
        html += `x<sub>${j + 1}</sub>`;
        if (j < varCount - 1) html += ', ';
    }
    html += ' <span style="color:var(--emerald)">≥</span> <span style="color:var(--amber)">0</span>';
    html += '</div>';

    preview.innerHTML = html;
}

function fmtCoeff(v, first) {
    if (first) return v.toString();
    if (v < 0) return `- ${Math.abs(v)}`;
    return v.toString();
}

// ── Load Example ─────────────────────────────────────────────────────
function loadExample(index = 1) {
    let vars = 2, cons = 2, max = true;
    let obj = [], cData = [], bi = [];

    switch(index) {
        case 1: // Cas Standard : Solution Unique
            vars = 2; cons = 2; max = true;
            obj = [5, 4];
            cData = [[6, 4], [1, 2]];
            bi = [24, 6];
            showToast(t('demoStd'), 'info');
            break;
        case 2: // Cas Non Borné (Unbounded)
            vars = 2; cons = 2; max = true;
            obj = [2, 1];
            cData = [[1, -1], [2, 0]];
            bi = [10, 40];
            showToast(t('demoUnb'), 'warning');
            break;
        case 3: // Cas : Infinité de Solutions
            vars = 2; cons = 1; max = true;
            obj = [4, 10];
            cData = [[2, 5]];
            bi = [10];
            showToast(t('demoMulti'), 'info');
            break;
        case 4: // Cas : Dégénérescence
            vars = 2; cons = 2; max = true;
            obj = [3, 9];
            cData = [[1, 4], [1, 2]];
            bi = [8, 4];
            showToast(t('demoDegen'), 'warning');
            break;
    }

    // Set UI
    document.getElementById('var-count').value = vars;
    document.getElementById('con-count').value = cons;
    varCount = vars;
    conCount = cons;
    isMax = max;
    
    if (max) {
        document.getElementById('btn-max').classList.add('active');
        document.getElementById('btn-min').classList.remove('active');
    } else {
        document.getElementById('btn-max').classList.remove('active');
        document.getElementById('btn-min').classList.add('active');
    }

    generateInputs();

    // Fill Objective
    for (let j = 0; j < vars; j++) {
        document.getElementById(`obj-${j}`).value = obj[j];
    }

    // Fill Constraints
    for (let i = 0; i < cons; i++) {
        for (let j = 0; j < vars; j++) {
            document.getElementById(`con-${i}-${j}`).value = cData[i][j];
        }
        document.getElementById(`bi-${i}`).value = bi[i];
    }

    updatePreview();
}


// ── Build tab from inputs ────────────────────────────────────────────
function buildTab() {
    const tab = [];

    // Objective
    const obj = [];
    for (let j = 0; j < varCount; j++) {
        obj.push(parseFloat(document.getElementById(`obj-${j}`).value) || 0);
    }
    tab.push(obj);

    // Constraints
    for (let i = 0; i < conCount; i++) {
        const c = [];
        for (let j = 0; j < varCount; j++) {
            c.push(parseFloat(document.getElementById(`con-${i}-${j}`).value) || 0);
        }
        const bi = parseFloat(document.getElementById(`bi-${i}`).value) || 0;
        c.push('<=');
        c.push(Math.abs(bi)); // ensure bi >= 0
        if (bi < 0) {
            for (let j = 0; j < varCount; j++) c[j] = -c[j];
        }
        tab.push(c);
    }

    return tab;
}

// ── SOLVE ────────────────────────────────────────────────────────────
async function solve() {
    const tab = buildTab();

    // Validate
    const allZeroObj = tab[0].every(v => v === 0);
    if (allZeroObj) {
        showToast(t('objNull'), 'error');
        return;
    }

    // Show sections
    const solveSection = document.getElementById('solve-section');
    const resultsSection = document.getElementById('results-section');
    solveSection.classList.remove('hidden');
    resultsSection.classList.add('hidden');

    // Update nav
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.querySelector('[data-section="solve"]').classList.add('active');

    // Scroll
    solveSection.scrollIntoView({ behavior: 'smooth' });

    // Clear
    document.getElementById('iterations-container').innerHTML = '';
    document.getElementById('progress-fill').style.width = '0%';
    document.getElementById('progress-label').textContent = t('standardizing');

    // Run simplex
    const result = runSimplex(tab, varCount, conCount, isMax);

    // Animate steps
    await animateSteps(result);

    // Show results
    showResults(result);
}

// ── Animate Steps ────────────────────────────────────────────────────
async function animateSteps(result) {
    const container = document.getElementById('iterations-container');
    const progressFill = document.getElementById('progress-fill');
    const progressLabel = document.getElementById('progress-label');
    const steps = result.steps;

    for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        const progress = ((i + 1) / steps.length) * 100;

        progressFill.style.width = progress + '%';
        progressLabel.textContent = step.message;

        const card = createIterationCard(step, i);
        container.appendChild(card);

        // Scroll to card
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Delay between steps
        await delay(step.final ? 300 : 800);
    }

    progressFill.style.width = '100%';
    progressLabel.textContent = t('done');
}

function createIterationCard(step, index) {
    const card = document.createElement('div');
    card.className = 'iteration-card';
    card.style.animationDelay = `${index * 0.1}s`;

    // Header
    const header = document.createElement('div');
    header.className = 'iter-header';
    header.onclick = function() {
        this.classList.toggle('collapsed');
        body.classList.toggle('collapsed');
    };

    let titleText = step.final
        ? t('finalTable')
        : step.degenerate
            ? t('degeneracy')
            : `${t('iteration')} ${step.iteration}`;

    header.innerHTML = `
        <div class="iter-title">
            <span class="iter-badge">${step.final ? '✓' : step.degenerate ? '!' : step.iteration}</span>
            <span>${titleText}</span>
        </div>
        <div class="iter-info">
            ${step.entering ? `<span class="iter-tag entering">↑ ${step.entering}</span>` : ''}
            ${step.leaving ? `<span class="iter-tag leaving">↓ ${step.leaving}</span>` : ''}
            <svg class="iter-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
        </div>
    `;
    card.appendChild(header);

    // Body
    const body = document.createElement('div');
    body.className = 'iter-body';

    // Table
    const table = buildTableHTML(step);
    body.innerHTML = table;

    // Bland notice
    if (step.degenerate) {
        const notice = document.createElement('div');
        notice.className = 'bland-notice';
        notice.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            ${step.message}
        `;
        body.appendChild(notice);
    }

    card.appendChild(body);
    return card;
}

function buildTableHTML(step) {
    const { tableau, colSymb, ligneSymb, pivotCol, pivotRow } = step;
    let html = '<table class="simplex-table">';

    // THead
    html += '<thead><tr>';
    html += '<th>Base</th>';
    for (let j = 0; j < colSymb.length; j++) {
        const isPivotCol = pivotCol === j;
        html += `<th class="${isPivotCol ? 'pivot-col' : ''}">${colSymb[j]}</th>`;
    }
    if (pivotRow !== null && pivotRow >= 0) {
        html += '<th style="color:var(--text-muted);font-size:0.75rem;">θ</th>';
    }
    html += '</tr></thead>';

    // TBody
    html += '<tbody>';
    for (let i = 0; i < tableau.length; i++) {
        const isObj = i === tableau.length - 1;
        const isPivotRow = pivotRow === i;
        html += `<tr class="${isObj ? 'obj-row' : ''} ${isPivotRow ? 'pivot-row' : ''}">`;

        // Base column
        html += `<td class="base-cell">${ligneSymb[i]}</td>`;

        for (let j = 0; j < tableau[i].length; j++) {
            const isPivot = pivotCol === j && pivotRow === i;
            const isPCol = pivotCol === j && !isObj;
            const isBi = j === tableau[i].length - 1;
            let cls = '';
            if (isPivot) cls = 'pivot-cell';
            else if (isPCol) cls = 'pivot-col';
            if (isBi && !isObj) cls += ' bi-cell';

            html += `<td class="${cls}">${formatNum(tableau[i][j])}</td>`;
        }

        // Ratio column
        if (pivotRow !== null && pivotRow >= 0) {
            if (!isObj && pivotCol !== null) {
                const cp = tableau[i][pivotCol];
                if (cp > EPSILON) {
                    const ratio = tableau[i][tableau[i].length - 1] / cp;
                    html += `<td class="ratio-cell">${formatNum(ratio)}</td>`;
                } else {
                    html += '<td class="ratio-cell" style="color:var(--rose)">—</td>';
                }
            } else {
                html += '<td></td>';
            }
        }

        html += '</tr>';
    }
    html += '</tbody></table>';

    return html;
}

function formatNum(n) {
    if (Math.abs(n) < 1e-10) return '0';
    if (Number.isInteger(n)) return n.toString();
    // Check if it's close to a simple fraction
    const rounded = Math.round(n * 100) / 100;
    if (Math.abs(rounded - Math.round(rounded)) < 0.001) return Math.round(rounded).toString();
    return rounded.toFixed(2);
}

// ── Show Results ─────────────────────────────────────────────────────
function showResults(result) {
    const section = document.getElementById('results-section');
    section.classList.remove('hidden');

    // Update nav
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.querySelector('[data-section="results"]').classList.add('active');

    const grid = document.getElementById('results-grid');
    let html = '';

    // Status card
    const statusInfo = {
        OPTIMAL: { icon: '✔', label: t('optUnique'), color: 'success', desc: t('optUniqueDesc') },
        MULTI_OPTIMAL: { icon: '∞', label: t('optMulti'), color: 'success', desc: t('optMultiDesc') },
        NON_BORNE: { icon: '⚠', label: t('unbounded'), color: 'error', desc: t('unboundedDesc') },
    };
    const info = statusInfo[result.status] || statusInfo.OPTIMAL;

    html += `
    <div class="result-card status-card" style="animation-delay: 0s;">
        <div class="status-icon ${info.color}">
            <span style="font-size:1.5rem;">${info.icon}</span>
        </div>
        <div class="result-label">${t('status')}</div>
        <div class="result-value status-val">${info.label}</div>
        <div class="result-sub">${info.desc}</div>
    </div>`;

    if (result.status !== 'NON_BORNE') {
        // Z* card
        html += `
        <div class="result-card z-card" style="animation-delay: 0.15s;">
            <div class="status-icon success">
                <span style="font-size:1.5rem;">🎯</span>
            </div>
            <div class="result-label">${t('zStar')}</div>
            <div class="result-value z-val">Z* = ${formatNum(result.zStar)}</div>
            <div class="result-sub">${isMax ? t('maxFound') : t('minFound')}</div>
        </div>`;

        // Solution card
        const sol1Str = result.solution.map((v, i) => `x<sub>${i + 1}</sub> = ${formatNum(v)}`).join(', ');
        let solHTML = `<div class="result-value var-val" style="font-size:1.1rem; text-align:left;">`;
        solHTML += `<div style="margin-bottom:8px;"><span style="color:var(--indigo)">${t('vertexA')}</span> (${sol1Str})</div>`;
        
        if (result.solution2) {
            const sol2Str = result.solution2.map((v, i) => `x<sub>${i + 1}</sub> = ${formatNum(v)}`).join(', ');
            solHTML += `<div style="margin-bottom:12px;"><span style="color:var(--indigo)">${t('vertexB')}</span> (${sol2Str})</div>`;
            solHTML += `<div style="font-size:0.75rem; color:var(--text-muted); line-height:1.4; font-weight:500;">
                ${t('combo')}<br>
                <span style="color:var(--emerald)">X* = αA + (1-α)B, α ∈ [0, 1]</span>
            </div>`;
        }
        solHTML += `</div>`;

        html += `
        <div class="result-card var-card" style="animation-delay: 0.3s;">
            <div class="status-icon success">
                <span style="font-size:1.5rem;">📐</span>
            </div>
            <div class="result-label">${t('optSol')}</div>
            ${solHTML}
        </div>`;

        // Iterations count card
        const iterCount = result.steps.filter(s => !s.degenerate && !s.final).length;
        html += `
        <div class="result-card" style="animation-delay: 0.45s;">
            <div class="status-icon" style="background: rgba(99, 102, 241, 0.15);">
                <span style="font-size:1.5rem;">🔄</span>
            </div>
            <div class="result-label">${t('iters')}</div>
            <div class="result-value" style="color:var(--indigo);">${iterCount}</div>
            <div class="result-sub">${t('pivots')}</div>
        </div>`;
    }

    grid.innerHTML = html;

    // Scroll to results
    setTimeout(() => section.scrollIntoView({ behavior: 'smooth' }), 500);

    showToast(t('doneToast'), 'success');
}

// ── Dropdown Toggle ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    const trigger = document.getElementById('btn-example-trigger');
    const content = document.querySelector('.dropdown-content');

    if (!trigger || !content) return;

    document.addEventListener('click', (e) => {
        const isTrigger = trigger.contains(e.target);
        const isContent = content.contains(e.target);
        const isLink = e.target.tagName === 'A' && content.contains(e.target);

        if (isTrigger) {
            content.classList.toggle('show');
        } else if (!isContent || isLink) {
            content.classList.remove('show');
        }
    });
});

// ── Toast ────────────────────────────────────────────────────────────
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');

    const icons = {
        success: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
        error: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
        info: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `${icons[type] || icons.info}<span>${message}</span>`;
    container.appendChild(toast);

    // Auto remove
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(40px)';
        toast.style.transition = '0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// ── Utility ──────────────────────────────────────────────────────────
function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

// ── Intersection Observer for sections ───────────────────────────────
const observerOptions = { threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.toggle('active', link.getAttribute('data-section') === id.replace('-section', ''));
            });
        }
    });
}, observerOptions);

document.querySelectorAll('.section').forEach(s => observer.observe(s));

// ── Keyboard shortcut ────────────────────────────────────────────────
document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 'Enter') {
        solve();
    }
});

// ── Init ─────────────────────────────────────────────────────────────
console.log('%c✨ SimplexSolver — Ready', 'color: #6366f1; font-size: 14px; font-weight: bold;');

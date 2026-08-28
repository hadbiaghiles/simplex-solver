/* ═══════════════════════════════════════════════════════════════════
   SIMPLEX ENGINE — Pure JS Simplex Algorithm
   Ported from Simplexe_Regle.py
   ═══════════════════════════════════════════════════════════════════ */

const EPSILON = 1e-9;

/**
 * Standardize the problem: add slack variables for <= constraints.
 * @param {number[][]} tab - [objective_coeffs, ...constraints]
 *   where each constraint = [a1, a2, ..., an, "<=", bi]
 * @param {number} varNbr - number of decision variables
 * @param {number} conNbr - number of constraints
 * @returns {{ tableau, colSymb, ligneSymb }}
 */
function standardiser(tab, varNbr, conNbr) {
    const colSymb = [];
    for (let i = 0; i < varNbr; i++) colSymb.push(`x${i + 1}`);
    for (let i = 0; i < conNbr; i++) colSymb.push(`e${i + 1}`);
    colSymb.push('bi');

    const tableau = [];
    const ligneSymb = [];

    for (let i = 1; i <= conNbr; i++) {
        const c = tab[i];
        const ligne = [];
        for (let j = 0; j < varNbr; j++) ligne.push(c[j]);
        for (let j = 0; j < conNbr; j++) ligne.push(0);
        ligne.push(c[c.length - 1]); // bi is last element
        ligne[varNbr + (i - 1)] = 1.0; // slack variable
        tableau.push(ligne);
        ligneSymb.push(`e${i}`);
    }

    // Objective row
    const obj = [];
    for (let i = 0; i < varNbr; i++) obj.push(tab[0][i]);
    for (let i = 0; i < conNbr; i++) obj.push(0);
    obj.push(0);
    ligneSymb.push('-Z');
    tableau.push(obj);

    return { tableau, colSymb, ligneSymb };
}

/**
 * Check if the current tableau is optimal.
 */
function isOptimal(tableau, maxim) {
    const obj = tableau[tableau.length - 1];
    for (let j = 0; j < obj.length - 1; j++) {
        if (maxim && obj[j] > EPSILON) return false;
        if (!maxim && obj[j] < -EPSILON) return false;
    }
    return true;
}

/**
 * Choose pivot column and row.
 * @returns {{ col, row }} — row = -1 if unbounded, null/null if optimal
 */
function choosePivot(tableau, maxim, bland) {
    const obj = tableau[tableau.length - 1];
    let col = null;

    if (bland) {
        for (let j = 0; j < obj.length - 1; j++) {
            if ((maxim && obj[j] > EPSILON) || (!maxim && obj[j] < -EPSILON)) {
                col = j;
                break;
            }
        }
    } else {
        let ext = maxim ? -Infinity : Infinity;
        for (let j = 0; j < obj.length - 1; j++) {
            if (maxim && obj[j] > ext) { ext = obj[j]; col = j; }
            if (!maxim && obj[j] < ext) { ext = obj[j]; col = j; }
        }
        if (col !== null) {
            if (maxim && ext <= EPSILON) col = null;
            if (!maxim && ext >= -EPSILON) col = null;
        }
    }

    if (col === null) return { col: null, row: null };

    // Minimum ratio test
    const ratios = [];
    for (let i = 0; i < tableau.length - 1; i++) {
        const cp = tableau[i][col];
        ratios.push(cp > EPSILON ? tableau[i][tableau[i].length - 1] / cp : null);
    }

    const admissible = ratios.filter(r => r !== null && r >= -EPSILON);
    if (admissible.length === 0) return { col, row: -1 };

    const minRatio = Math.min(...admissible);
    const row = ratios.findIndex(r => r !== null && Math.abs(r - minRatio) < EPSILON);

    return { col, row };
}

/**
 * Perform pivot operation.
 */
function pivoter(tableau, pc, pl, ligneSymb, colSymb) {
    const sortant = ligneSymb[pl];
    ligneSymb[pl] = colSymb[pc];

    const pv = tableau[pl][pc];
    // Normalize pivot row
    for (let j = 0; j < tableau[pl].length; j++) {
        tableau[pl][j] /= pv;
    }
    // Eliminate column in other rows
    for (let i = 0; i < tableau.length; i++) {
        if (i === pl) continue;
        const f = tableau[i][pc];
        for (let j = 0; j < tableau[i].length; j++) {
            tableau[i][j] -= f * tableau[pl][j];
        }
    }

    return sortant;
}

/**
 * Round tableau values.
 */
function corrigerArrondi(tableau) {
    for (let i = 0; i < tableau.length; i++) {
        for (let j = 0; j < tableau[i].length; j++) {
            tableau[i][j] = Math.round(tableau[i][j] * 1e10) / 1e10;
        }
    }
}

/**
 * Deep copy a 2D array.
 */
function deepCopy(arr) {
    return arr.map(row => [...row]);
}

/**
 * Check for multiple optimal solutions.
 */
function multiOptimal(tableau, colSymb, ligneSymb) {
    const base = new Set(ligneSymb);
    const obj = tableau[tableau.length - 1];
    for (let j = 0; j < colSymb.length - 1; j++) {
        if (Math.abs(obj[j]) < EPSILON && !base.has(colSymb[j])) return true;
    }
    return false;
}

/**
 * Run the full Simplex algorithm.
 * Returns an array of iteration steps for visualization.
 */
function runSimplex(tab, varNbr, conNbr, maxim) {
    const { tableau, colSymb, ligneSymb } = standardiser(tab, varNbr, conNbr);
    const steps = [];
    let bland = false;
    let k = 0;

    // Record initial (standardized) tableau
    steps.push({
        iteration: k,
        tableau: deepCopy(tableau),
        colSymb: [...colSymb],
        ligneSymb: [...ligneSymb],
        pivotCol: null,
        pivotRow: null,
        entering: null,
        leaving: null,
        message: t('stepInitial'),
        bland: false,
        degenerate: false,
    });

    while (!isOptimal(tableau, maxim)) {
        const copie = deepCopy(tableau);
        const ligneSymbCopy = [...ligneSymb];

        const { col: pc, row: pl } = choosePivot(tableau, maxim, bland);

        if (pc === null) break;

        if (pl === -1) {
            steps.push({
                iteration: k,
                tableau: deepCopy(tableau),
                colSymb: [...colSymb],
                ligneSymb: [...ligneSymb],
                pivotCol: pc,
                pivotRow: null,
                entering: colSymb[pc],
                leaving: null,
                message: t('stepUnbounded', { v: colSymb[pc] }),
                status: 'NON_BORNE',
                bland: bland,
                degenerate: false,
            });
            return {
                steps,
                status: 'NON_BORNE',
                solution: null,
                zStar: null,
                colSymb,
                ligneSymb,
            };
        }

        const entering = colSymb[pc];
        const leaving = ligneSymb[pl];

        // Record step BEFORE pivot
        steps.push({
            iteration: k,
            tableau: deepCopy(tableau),
            colSymb: [...colSymb],
            ligneSymb: [...ligneSymb],
            pivotCol: pc,
            pivotRow: pl,
            entering,
            leaving,
            message: t('stepPivot', { enter: entering, leave: leaving }),
            bland,
            degenerate: false,
        });

        const sortant = pivoter(tableau, pc, pl, ligneSymb, colSymb);
        k++;

        // Check degeneracy
        const degen = tableau.slice(0, -1).some(row => Math.abs(row[row.length - 1]) < EPSILON);

        if (!bland && degen && !isOptimal(tableau, maxim)) {
            // Record degenerate notice
            steps.push({
                iteration: k,
                tableau: deepCopy(tableau),
                colSymb: [...colSymb],
                ligneSymb: [...ligneSymb],
                pivotCol: null,
                pivotRow: null,
                entering: null,
                leaving: null,
                message: t('stepDegen', { k }),
                bland: true,
                degenerate: true,
            });

            // Restore tableau
            for (let i = 0; i < tableau.length; i++) {
                tableau[i] = copie[i].slice();
            }
            ligneSymb[pl] = sortant;
            k--;
            bland = true;
        } else if (!degen) {
            bland = false;
        }

        corrigerArrondi(tableau);
    }

    // Final tableau
    steps.push({
        iteration: k,
        tableau: deepCopy(tableau),
        colSymb: [...colSymb],
        ligneSymb: [...ligneSymb],
        pivotCol: null,
        pivotRow: null,
        entering: null,
        leaving: null,
        message: t('stepStop'),
        bland,
        degenerate: false,
        final: true,
    });

    const status = multiOptimal(tableau, colSymb, ligneSymb) ? 'MULTI_OPTIMAL' : 'OPTIMAL';

    // Function to extract solution from a tableau
    const extractSol = (tab, lSymb) => {
        const s = new Array(varNbr).fill(0);
        for (let i = 0; i < lSymb.length; i++) {
            if (lSymb[i].startsWith('x')) {
                const idx = parseInt(lSymb[i].substring(1)) - 1;
                if (idx >= 0 && idx < varNbr) {
                    s[idx] = tab[i][tab[i].length - 1];
                }
            }
        }
        return s;
    };

    const solution = extractSol(tableau, ligneSymb);
    let solution2 = null;

    if (status === 'MULTI_OPTIMAL') {
        // Find a non-basic variable with coefficient 0 in objective row
        const base = new Set(ligneSymb);
        const obj = tableau[tableau.length - 1];
        let pc2 = -1;
        for (let j = 0; j < colSymb.length - 1; j++) {
            if (Math.abs(obj[j]) < EPSILON && !base.has(colSymb[j])) {
                pc2 = j;
                break;
            }
        }

        if (pc2 !== -1) {
            // Find pivot row (ratio test) to get another vertex
            const ratios = [];
            for (let i = 0; i < tableau.length - 1; i++) {
                const val = tableau[i][pc2];
                ratios.push(val > EPSILON ? tableau[i][tableau[i].length - 1] / val : null);
            }
            const admissible = ratios.filter(r => r !== null && r >= -EPSILON);
            if (admissible.length > 0) {
                const minRatio = Math.min(...admissible);
                const pl2 = ratios.findIndex(r => r !== null && Math.abs(r - minRatio) < EPSILON);
                
                // Create second solution by pivoting in a clone
                const tab2 = deepCopy(tableau);
                const lSymb2 = [...ligneSymb];
                pivoter(tab2, pc2, pl2, lSymb2, colSymb);
                solution2 = extractSol(tab2, lSymb2);
            }
        }
    }

    const zStar = -tableau[tableau.length - 1][tableau[0].length - 1];

    return { steps, status, solution, solution2, zStar, colSymb, ligneSymb };
}

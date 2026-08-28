/* ═══════════════════════════════════════════════════════════════════
   I18N — French / English
   ═══════════════════════════════════════════════════════════════════ */
const I18N = {
  fr: {
    docTitle: "Simplex Solver — Résolution de Programmes Linéaires",
    docDesc: "Outil interactif et animé de résolution de programmes linéaires par la méthode du Simplexe. Visualisez chaque itération en temps réel.",
    navProblem: "Problème",
    navSolve: "Résolution",
    navResults: "Résultats",
    heroBadge: "Méthode du Simplexe",
    heroTitle: "Résolvez vos <span class=\"gradient-text\">programmes linéaires</span><br>en temps réel",
    heroSub: "Interface interactive avec visualisation étape par étape de l'algorithme du Simplexe.<br>Saisissez votre problème et regardez la magie opérer.",
    heroCta: "Commencer",
    inputTitle: "Définir le Problème",
    inputDesc: "Configurez les dimensions du problème puis saisissez les coefficients",
    config: "Configuration",
    optType: "Type d'optimisation",
    maximize: "Maximiser",
    minimize: "Minimiser",
    variables: "Variables (n)",
    constraints: "Contraintes (m)",
    generate: "Générer le formulaire",
    coefficients: "Coefficients",
    preview: "Aperçu du Problème",
    loadDemo: "Charger une démo",
    demo1: "1. Cas Standard (Unique)",
    demo2: "2. Cas Non Borné",
    demo3: "3. Solutions Multiples",
    demo4: "4. Dégénérescence",
    solve: "Résoudre",
    solveTitle: "Résolution Pas à Pas",
    solveDesc: "Suivez chaque itération de l'algorithme du Simplexe",
    standardizing: "Standardisation...",
    resultsTitle: "Résultats",
    resultsDesc: "Solution optimale de votre programme linéaire",
    footer: "Simplex<span class=\"logo-accent\">Solver</span> — Algorithme du Simplexe interactif",
    objFn: "Fonction Objectif",
    consLeq: "Contraintes (≤)",
    formGenerated: "Formulaire généré !",
    demoStd: "Démo : Cas Standard (Unique)",
    demoUnb: "Démo : Cas Non Borné",
    demoMulti: "Démo : Solutions Multiples",
    demoDegen: "Démo : Dégénérescence",
    objNull: "La fonction objectif ne peut pas être nulle.",
    done: "Résolution terminée ✓",
    doneToast: "Résolution terminée !",
    finalTable: "🏁 Tableau Final",
    degeneracy: "⚠️ Dégénérescence",
    iteration: "Itération",
    status: "Statut",
    optUnique: "Solution Unique Optimale",
    optUniqueDesc: "Le problème admet une solution unique.",
    optMulti: "Infinité de Solutions",
    optMultiDesc: "Plusieurs solutions optimales existent.",
    unbounded: "Problème Non Borné",
    unboundedDesc: "Le domaine n'est pas borné.",
    zStar: "Valeur Optimale",
    maxFound: "Maximum trouvé",
    minFound: "Minimum trouvé",
    vertexA: "Sommet A :",
    vertexB: "Sommet B :",
    combo: "Toute combinaison linéaire de ces points est optimale :",
    optSol: "Solution Optimale",
    iters: "Itérations",
    pivots: "Pivots effectués",
    stepInitial: "Tableau initial standardisé",
    stepUnbounded: "Problème non borné ! La variable {v} ne peut pas entrer en base.",
    stepPivot: "Pivot : {enter} entre, {leave} sort",
    stepDegen: "Dégénérescence détectée à l'itération {k}. Application de la règle de Bland.",
    stepStop: "Critère d'arrêt atteint.",
  },
  en: {
    docTitle: "Simplex Solver — Linear Program Solver",
    docDesc: "Interactive animated tool for solving linear programs with the Simplex method. Watch every iteration in real time.",
    navProblem: "Problem",
    navSolve: "Solving",
    navResults: "Results",
    heroBadge: "Simplex Method",
    heroTitle: "Solve your <span class=\"gradient-text\">linear programs</span><br>in real time",
    heroSub: "Interactive interface with step-by-step visualization of the Simplex algorithm.<br>Enter your problem and watch it unfold.",
    heroCta: "Get started",
    inputTitle: "Define the Problem",
    inputDesc: "Set the problem size, then enter the coefficients",
    config: "Setup",
    optType: "Optimization type",
    maximize: "Maximize",
    minimize: "Minimize",
    variables: "Variables (n)",
    constraints: "Constraints (m)",
    generate: "Generate form",
    coefficients: "Coefficients",
    preview: "Problem Preview",
    loadDemo: "Load a demo",
    demo1: "1. Standard case (unique)",
    demo2: "2. Unbounded case",
    demo3: "3. Multiple solutions",
    demo4: "4. Degeneracy",
    solve: "Solve",
    solveTitle: "Step-by-step Solving",
    solveDesc: "Follow each iteration of the Simplex algorithm",
    standardizing: "Standardizing...",
    resultsTitle: "Results",
    resultsDesc: "Optimal solution of your linear program",
    footer: "Simplex<span class=\"logo-accent\">Solver</span> — Interactive Simplex algorithm",
    objFn: "Objective Function",
    consLeq: "Constraints (≤)",
    formGenerated: "Form generated!",
    demoStd: "Demo: Standard case (unique)",
    demoUnb: "Demo: Unbounded case",
    demoMulti: "Demo: Multiple solutions",
    demoDegen: "Demo: Degeneracy",
    objNull: "The objective function cannot be all zeros.",
    done: "Solving complete ✓",
    doneToast: "Solving complete!",
    finalTable: "🏁 Final Tableau",
    degeneracy: "⚠️ Degeneracy",
    iteration: "Iteration",
    status: "Status",
    optUnique: "Unique Optimal Solution",
    optUniqueDesc: "The problem has a unique solution.",
    optMulti: "Infinitely Many Solutions",
    optMultiDesc: "Several optimal solutions exist.",
    unbounded: "Unbounded Problem",
    unboundedDesc: "The feasible region is unbounded.",
    zStar: "Optimal Value",
    maxFound: "Maximum found",
    minFound: "Minimum found",
    vertexA: "Vertex A:",
    vertexB: "Vertex B:",
    combo: "Any linear combination of these points is optimal:",
    optSol: "Optimal Solution",
    iters: "Iterations",
    pivots: "Pivots performed",
    stepInitial: "Initial standardized tableau",
    stepUnbounded: "Unbounded problem! Variable {v} cannot enter the basis.",
    stepPivot: "Pivot: {enter} enters, {leave} leaves",
    stepDegen: "Degeneracy detected at iteration {k}. Applying Bland's rule.",
    stepStop: "Stopping criterion reached.",
  }
};

let currentLang = localStorage.getItem("simplex-lang") || "fr";

function t(key, vars) {
  const dict = I18N[currentLang] || I18N.fr;
  let s = dict[key] || I18N.fr[key] || key;
  if (vars) {
    Object.keys(vars).forEach(k => {
      s = s.replaceAll("{" + k + "}", vars[k]);
    });
  }
  return s;
}

function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem("simplex-lang", lang);
  document.documentElement.lang = lang;

  const dict = I18N[lang] || I18N.fr;
  document.title = dict.docTitle;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute("content", dict.docDesc);

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.textContent = dict[key];
  });
  document.querySelectorAll("[data-i18n-html]").forEach(el => {
    const key = el.getAttribute("data-i18n-html");
    if (dict[key]) el.innerHTML = dict[key];
  });

  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });

  if (typeof generateInputs === "function" && document.getElementById("coeff-form")?.innerHTML) {
    const keep = {};
    document.querySelectorAll(".coeff-input, .bi-input").forEach(inp => keep[inp.id] = inp.value);
    generateInputs(true);
    Object.entries(keep).forEach(([id, val]) => {
      const el = document.getElementById(id);
      if (el) el.value = val;
    });
    if (typeof updatePreview === "function") updatePreview();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", () => applyLang(btn.dataset.lang));
  });
  applyLang(currentLang);
});

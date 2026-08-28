# Simplex Solver

**[Open the app →](https://hadbiaghiles.github.io/simplex-solver/)**

Interactive solver for linear programs using the Simplex method. Enter an objective and constraints, run the solver, and watch every iteration as a tableau: pivots, degeneracy, Bland's rule, and the final solution.

The UI starts in **English**. Switch to French anytime from the EN / FR toggle in the header.

## Live demo

https://hadbiaghiles.github.io/simplex-solver/

## Features

- Maximize and minimize
- Animated Simplex tableaux, step by step
- Unique solution, multiple solutions, unbounded problems, and degeneracy
- Built-in demos (standard, unbounded, multiple solutions, degeneracy)
- English / French interface

## Run locally

No build step. Open `index.html` in a browser.

## Files

| File | Role |
| --- | --- |
| `index.html` | UI |
| `app.js` | Interface logic and animations |
| `simplex.js` | Simplex algorithm |
| `i18n.js` | EN / FR translations |
| `style.css` | Styles |
| `Simplexe_Regle.py` | Python reference implementation |

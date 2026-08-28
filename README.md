# Simplex Solver

Interactive web app that solves linear programs with the Simplex method, step by step.

Switch the UI between **French** and **English** from the header. Enter an objective and constraints, or load a demo, then watch each pivot, degeneracy check, and the final solution.

## Run locally

Open `index.html` in a browser. No build step.

## Features

- Max / min linear programs
- Animated tableau iterations
- Unique, multiple, unbounded, and degenerate cases
- FR / EN interface

## Files

- `index.html` — UI
- `app.js` — interface logic
- `simplex.js` — Simplex algorithm
- `i18n.js` — translations
- `style.css` — styles
- `Simplexe_Regle.py` — Python reference of the algorithm

# Simplex Solver

[![Live demo](https://img.shields.io/badge/Live_demo-open-6366f1?style=for-the-badge)](https://hadbiaghiles.github.io/simplex-solver/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)
[![Stars](https://img.shields.io/github/stars/hadbiaghiles/simplex-solver?style=for-the-badge)](https://github.com/hadbiaghiles/simplex-solver/stargazers)

**[Open the app →](https://hadbiaghiles.github.io/simplex-solver/)**

Interactive solver for linear programs using the Simplex method. Enter an objective and constraints, run the solver, and watch every iteration as a tableau: pivots, degeneracy, Bland's rule, and the final solution.

The UI starts in **English**. Switch to French anytime from the EN / FR toggle in the header.

Author: **Hadbi Aghiles**

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

## License

MIT — see [LICENSE](LICENSE).

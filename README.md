# Simplex Solver

**[Ouvrir l’app →](https://hadbiaghiles.github.io/simplex-solver/)**

Solveur interactif de programmes linéaires par la méthode du Simplexe. Tu saisis l’objectif et les contraintes, tu lances la résolution, et chaque itération s’affiche en tableau (pivots, dégénérescence, règle de Bland, solution finale).

Interface **FR / EN** (bouton en haut à droite).

## Live demo

https://hadbiaghiles.github.io/simplex-solver/

## Fonctionnalités

- Maximisation et minimisation
- Tableaux Simplexe animés, étape par étape
- Cas gérés : solution unique, solutions multiples, problème non borné, dégénérescence
- Demos prêtes à charger (standard, non borné, solutions multiples, dégénérescence)
- Switch français / anglais

## Lancer en local

Aucun build. Ouvre `index.html` dans un navigateur.

## Fichiers

| Fichier | Rôle |
| --- | --- |
| `index.html` | Interface |
| `app.js` | Logique UI, animations |
| `simplex.js` | Algorithme du Simplexe |
| `i18n.js` | Traductions FR / EN |
| `style.css` | Styles |
| `Simplexe_Regle.py` | Version Python de référence |

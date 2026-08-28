import os, re, time, copy

# ── Constantes ───────────────────────────────────────────────────────────────
EPSILON = 1e-9

# ── Utilitaires I/O ───────────────────────────────────────────────────────────
_reel     = re.compile(r'^-?[0-9]+(\.[0-9]+)?$')
_fraction = re.compile(r'^-?[0-9]+/[1-9][0-9]*$')

def clear(): os.system('cls' if os.name == 'nt' else 'clear')
def pause(): input("Tapez sur Entree pour continuer...")

def entrer_valeur(msg):
    while True:
        v = input(msg).strip()
        if _reel.match(v):     return float(v)
        if _fraction.match(v): n, d = v.split('/'); return float(n)/float(d)
        print("Valeur incorrecte.")

def entrer_entier(msg, mini=1):
    while True:
        v = input(msg).strip()
        if v.isdigit() and int(v) >= mini: return int(v)
        print(f"Entrez un entier >= {mini}.")

def entrer_choix(msg, debut, fin):
    while True:
        v = input(msg).strip()
        if v.lstrip('-').isdigit() and debut <= int(v) <= fin: return int(v)
        print(f"Entrez un nombre entre {debut} et {fin}.")

def corriger_arrondi(tableau):
    for ligne in tableau:
        for j in range(len(ligne)):
            ligne[j] = round(ligne[j], 10)

# ── Affichage ─────────────────────────────────────────────────────────────────
def fmt(num, premier=True, bi=False):
    """Formate un coefficient pour l'affichage d'une expression linéaire."""
    s, n = "", abs(num)
    if premier: s = "-" if num < 0 else ""
    else:       s = "- " if num < 0 else "+ "
    if n == 1 and not bi: return s
    s += str(int(n)) if n == int(n) else f"{n:.2f}"
    return s

def afficher_probleme(tab, var_nbr, con_nbr, maxim):
    clear()
    print("/")
    print("| " + ("max" if maxim else "min") + " Z = ", end="")
    for i in range(var_nbr):
        print(f"{fmt(tab[0][i], i==0)}x{i+1} ", end="")
    print("\n|\n|  s.c    ", end="")
    for i in range(1, con_nbr + 1):
        c = tab[i]
        first = True
        for j in range(var_nbr):
            if c[j] != 0:
                print(f"{fmt(c[j], first)}x{j+1} ", end="")
                first = False
        print(f"<= {fmt(c[var_nbr+1], True, True)}")
        print("|         ", end="")
    for i in range(var_nbr):
        print(f"x{i+1}" + (", " if i < var_nbr-1 else " "), end="")
    print(">= 0\n\\")

def afficher_tableau(tableau, col_symb, ligne_symb):
    w = max(len(f"{n:.2f}") for ligne in tableau for n in ligne) + 2
    sep = "+" + ("-"*w + "+") * (len(col_symb) + 1)
    print(sep)
    print("|" + "Base".center(w) + "|" + "".join(s.center(w)+"|" for s in col_symb))
    print(sep)
    for i, ligne in enumerate(tableau):
        print("|" + ligne_symb[i].center(w) + "|" +
              "".join(f"{n:.2f}".center(w)+"|" for n in ligne))
        print(sep)

def afficher_solution(tableau, ligne_symb, var_nbr):
    sol = [0.0] * var_nbr
    for i, v in enumerate(ligne_symb):
        if v.startswith('x'):
            try:
                idx = int(v[1:]) - 1
                if 0 <= idx < var_nbr: sol[idx] = tableau[i][-1]
            except ValueError: pass
    print("x* = (" + ", ".join(f"{v:.2f}" for v in sol) + ")")
    print(f"Z* = {-tableau[-1][-1]:.2f}")

# ── Saisie des données ────────────────────────────────────────────────────────
def entrer_les_donnees():
    clear()
    print("Bienvenue !!")
    var_nbr = entrer_entier("Nombre de variables de decision : ", 1)
    clear()
    maxim = entrer_choix("(1) Maximiser  (2) Minimiser ?\nEntrer : ", 1, 2) == 1

    # Fonction objective
    coff = []
    for j in range(1, var_nbr + 1):
        clear()
        print("Z = " + " + ".join(
            (f"{coff[i-1]:.2f}" if len(coff)>=i else f"\033[34m[{i}]\033[0m") + f"x{i}"
            for i in range(1, var_nbr+1)))
        coff.append(entrer_valeur(f"Coefficient \033[34m[{j}]\033[0m : "))

    tab = [coff]

    # Contraintes (seulement <=)
    nbr_con = entrer_entier("Nombre de contraintes : ", 1)
    for i in range(1, nbr_con + 1):
        clear()
        print(f"Contrainte {i} (type <=) :")
        c = [entrer_valeur(f"  Coeff x{j} : ") for j in range(1, var_nbr+1)]
        bi = entrer_valeur("  Membre droit (bi >= 0) : ")
        if bi < 0:
            print("Attention : bi < 0 invalide pour <=. Les coefficients sont inversés.")
            c = [-v for v in c]
            bi = -bi
        tab.append(c + ["<=", bi])

    return tab, var_nbr, nbr_con, maxim

# ── Modification ──────────────────────────────────────────────────────────────
def modifier_fonction(fonction, var_nbr, maxim):
    maxLocal = maxim
    while True:
        clear()
        print(f"\033[34m[1]\033[0m {'max' if maxLocal else 'min'}  Z = " +
              "  ".join(f"\033[34m[{i+2}]\033[0m {fonction[i]:.2f}x{i+1}"
                        for i in range(var_nbr)))
        choix = entrer_choix("Numero a changer (0=sortir) : ", 0, var_nbr+1)
        if choix == 0: return maxLocal
        if choix == 1:
            maxLocal = entrer_choix("[1]Max [2]Min : ", 1, 2) == 1
        else:
            fonction[choix-2] = entrer_valeur("Nouvelle valeur : ")

def modifier_contraint(contraints, var_nbr, con_nbr):
    clear()
    for i, c in enumerate(contraints):
        print(f"\033[34m[{i+1}]\033[0m " +
              " + ".join(f"{c[j]:.2f}x{j+1}" for j in range(var_nbr)) +
              f" <= {c[var_nbr+1]:.2f}")
    choix = entrer_choix("Numero du contraint : ", 1, con_nbr)
    c = contraints[choix-1]
    while True:
        clear()
        print("  ".join(f"\033[34m[{j+1}]\033[0m {c[j]:.2f}x{j+1}" for j in range(var_nbr))
              + f"  \033[34m[{var_nbr+1}]\033[0m bi={c[var_nbr+1]:.2f}")
        ch = entrer_choix("Numero a changer (0=sortir) : ", 0, var_nbr+1)
        if ch == 0: break
        if ch <= var_nbr: c[ch-1] = entrer_valeur("Nouvelle valeur : ")
        else: c[var_nbr+1] = entrer_valeur("Nouveau bi (>= 0) : ")

# ── Standardisation (uniquement <=) ─────────────────────────────────────────
def standardiser(tab, var_nbr, con_nbr):
    col_symb   = [f"x{i+1}" for i in range(var_nbr)]
    col_symb  += [f"e{i+1}" for i in range(con_nbr)]
    col_symb  += ["bi"]
    n_cols     = len(col_symb)

    tableau    = []
    ligne_symb = []

    for i in range(1, con_nbr + 1):
        c    = tab[i]
        ligne = [c[j] for j in range(var_nbr)] + [0.0]*con_nbr + [c[var_nbr+1]]
        ligne[var_nbr + (i-1)] = 1.0      # variable d'écart ei
        tableau.append(ligne)
        ligne_symb.append(f"e{i}")

    # Ligne objectif
    obj = [tab[0][i] for i in range(var_nbr)] + [0.0]*con_nbr + [0.0]
    ligne_symb.append("-Z")
    tableau.append(obj)

    return tableau, col_symb, ligne_symb

# ── Simplexe ────────────────────────────────────────────────────────────────
def optimal(tableau, maxim):
    obj = tableau[-1][:-1]
    return all(v <= EPSILON for v in obj) if maxim else all(v >= -EPSILON for v in obj)

def choisir_pivot(tableau, maxim, bland):
    obj = tableau[-1][:-1]
    col = None
    if bland:
        col = next((i for i, v in enumerate(obj) if (v > EPSILON if maxim else v < -EPSILON)), None)
    else:
        ext = max(obj) if maxim else min(obj)
        if (ext > EPSILON if maxim else ext < -EPSILON): col = obj.index(ext)
    if col is None: return None, None
    
    ratios = []
    for i in range(len(tableau)-1):
        Cp = tableau[i][col]
        ratios.append(tableau[i][-1]/Cp if Cp > EPSILON else None)

    adm = [r for r in ratios if r is not None]
    if not adm: return col, -1
    mn   = min(adm)
    ligne = next(i for i, r in enumerate(ratios) if r == mn)
    return col, ligne

def pivoter(tableau, pc, pl, ligne_symb, col_symb):
    sortant = ligne_symb[pl]
    ligne_symb[pl] = col_symb[pc]
    pv = tableau[pl][pc]
    tableau[pl] = [v/pv for v in tableau[pl]]
    for i in range(len(tableau)):
        if i == pl: continue
        f = tableau[i][pc]
        tableau[i] = [tableau[i][j] - f*tableau[pl][j] for j in range(len(tableau[i]))]
    return sortant

def multi_optimal(tableau, col_symb, ligne_symb):
    base = set(ligne_symb)
    return any(abs(tableau[-1][j]) < EPSILON and s not in base
               for j, s in enumerate(col_symb[:-1]))

def simplexe(tableau, col_symb, ligne_symb, maxim):
    print("\nSimplexe :\n")
    bland, k = False, 0

    while not optimal(tableau, maxim):
        copie = copy.deepcopy(tableau)
        print(f"iteration {k} :")
        afficher_tableau(tableau, col_symb, ligne_symb)

        pc, pl = choisir_pivot(tableau, maxim, bland)
        if pc is None: break
        if pl == -1:
            print(f"\nVBnew : {col_symb[pc]}")
            print("Probleme non borne.\n")
            print(f"iteration {k+1} :")
            afficher_tableau(tableau, col_symb, ligne_symb)
            return "NON_BORNE"

        print(f"VBnew  : {col_symb[pc]}\nVHBnew : {ligne_symb[pl]}\n")
        sortant = pivoter(tableau, pc, pl, ligne_symb, col_symb)
        k += 1
        time.sleep(0.5)

        # Dégénérescence → Bland
        degen = any(abs(tableau[i][-1]) < EPSILON for i in range(len(tableau)-1))
        if not bland and degen and not optimal(tableau, maxim):
            print(f"iteration {k} :")
            afficher_tableau(tableau, col_symb, ligne_symb)
            print(f"Solution degeneree → retour iter {k-1}, regle de Bland.\n")
            for i in range(len(tableau)):
                tableau[i] = copie[i][:]
            ligne_symb[pl] = sortant
            k -= 1; bland = True
        elif not degen: bland = False

        corriger_arrondi(tableau)

    print(f"iteration {k} :")
    afficher_tableau(tableau, col_symb, ligne_symb)
    print("Critere d'arret atteint.\n")

    return "MULTI_OPTIMAL" if multi_optimal(tableau, col_symb, ligne_symb) else "OPTIMAL"

# ── Menu + Main ─────────────────────────────────────────────────────────────
def menu():
    tab, var_nbr, con_nbr, maxim = entrer_les_donnees()
    while True:
        clear()
        print("[1] Afficher le probleme\n[2] Modifier la fonction objective"
              "\n[3] Modifier une contrainte\n[4] Resoudre")
        choix = entrer_choix("Entrer : ", 1, 4)
        if   choix == 1: afficher_probleme(tab, var_nbr, con_nbr, maxim); pause()
        elif choix == 2: maxim = modifier_fonction(tab[0], var_nbr, maxim)
        elif choix == 3: modifier_contraint(tab[1:con_nbr+1], var_nbr, con_nbr)
        else: break
    return tab, var_nbr, con_nbr, maxim

def main():
    tab, var_nbr, con_nbr, maxim = menu()
    tableau, col_symb, ligne_symb = standardiser(tab, var_nbr, con_nbr)

    clear()
    print("Standardisation (variables d'ecart ajoutees)...\n")
    time.sleep(1.0)

    statut = simplexe(tableau, col_symb, ligne_symb, maxim)

    print("\n" + "═"*50)
    msgs = {
        "OPTIMAL":      "  ✔  Solution unique optimale.",
        "MULTI_OPTIMAL":"  ∞  Infinite de solutions (l'une d'elles est affichee).",
        "NON_BORNE":    "  ⚠  Probleme non borne.",
    }
    print(msgs.get(statut, ""))
    print("═"*50)
    if statut in ("OPTIMAL", "MULTI_OPTIMAL"):
        afficher_solution(tableau, ligne_symb, var_nbr)
    print()

if __name__ == "__main__":
    main()

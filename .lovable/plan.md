# Analyse d'offre d'emploi + variantes de CV

## Ce que l'utilisateur obtient
1. **Analyser une offre** : dans l'éditeur, un bouton « Analyser une offre » ouvre un panneau. On colle le lien de l'annonce (ou le texte, en secours si le site bloque la lecture).
2. **Résultat de l'analyse** : poste, entreprise, compétences clés demandées, mots-clés ATS, score de correspondance avec le CV actuel, compétences présentes / manquantes, et suggestions concrètes (sans inventer d'expériences).
3. **Créer une variante** : bouton « Créer une variante pour cette offre ». Un sous-CV est créé à partir du CV parent : titre « CV — Poste @ Entreprise », sections réordonnées selon l'offre, compétences pertinentes mises en avant, contenu original conservé (seuls ordre/sélection changent, pas de réalisations inventées).
4. **Tableau de bord** : les variantes apparaissent regroupées sous leur CV parent (badge « Variante », lien vers le parent, offre associée). On peut aussi créer une variante vide manuellement (« Créer une variante ») depuis une carte CV.

## Détails techniques
- `types.ts` : ajout optionnel `parentId?: string` et `jobTarget?: { url, title, company, keywords[], score, analyzedAt }` sur `Resume` (rétrocompatible localStorage).
- Lecture de la page : connecteur Firecrawl (scrape markdown), via une fonction serveur `src/lib/cv/job.functions.ts`.
- Analyse : Lovable AI (modèle Gemini par défaut) avec sortie structurée JSON, prompt recevant l'offre + un résumé texte du CV ; renvoie mots-clés, correspondance, suggestions, ordre de sections recommandé et compétences à prioriser.
- Calcul de variante côté client (`src/lib/cv/variant.ts`) : clone du parent, applique ordre de sections, filtre/trie compétences et technos par pertinence, enregistre `parentId` et `jobTarget`.
- UI : `JobAnalysisDialog.tsx` dans l'éditeur ; dashboard groupé par parent.
- Petit test unitaire sur la création de variante (le parent reste intact, `parentId` correct, aucun contenu ajouté).
- Nécessite la connexion Firecrawl (carte de connexion affichée pendant l'implémentation).

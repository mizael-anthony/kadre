# Label de stack technique + assistant IA (Pro)

## 1. Petit label devant les technologies

Chaque expérience affiche aujourd'hui ses technologies sans intitulé. On ajoute un petit label bilingue devant la liste, dans les trois modèles (Classic, Modern, Minimal), avec le même traitement discret que le texte existant (petite taille, couleur atténuée, label en gras/majuscules selon le modèle).

- Label FR : « Compétences » — EN : « Skills » (ajouté au dictionnaire i18n, donc traduit automatiquement selon FR/EN).
- Appliqué aussi aux technologies des projets pour rester cohérent.

## 2. Assistant IA de rédaction (fonctionnalité payante)

Ajout d'une aide à la rédaction dans l'éditeur, présentée comme une fonctionnalité Pro avec paywall visuel (aucun paiement ni compte pour l'instant).

Où : un bouton discret « IA » à côté de chaque champ texte long de l'éditeur — résumé du CV, chaque puce d'expérience (et l'ensemble des puces d'une expérience), intitulés de poste, descriptions de projets.

Comportement :
- Clic sur le bouton → ouverture d'une modale « Assistant de rédaction · Pro » qui montre ce que l'IA ferait (améliorer l'impact, verbes d'action, formulation ATS) et un aperçu grisé/flouté.
- Appel à l'action « Passer à Pro » + note « Bientôt disponible ». Aucune génération réelle, aucun texte modifié.
- Badge « Pro » visible sur les boutons IA, et une petite bannière dans l'éditeur présentant la fonctionnalité, masquable.
- L'IA n'agit que sur la langue en cours d'édition (pas de traduction automatique FR/EN).

## Détails techniques

- `src/lib/cv/i18n.ts` : nouvelles entrées `techLabel`, plus les libellés du paywall.
- `src/components/cv/templates/{Classic,Modern,Minimal}Template.tsx` : préfixe label devant `tech.join(...)` pour expériences et projets.
- Nouveau `src/components/cv/AiAssistButton.tsx` : bouton + `Dialog` shadcn du paywall, réutilisable (props : label du champ, langue).
- `src/components/cv/BuilderForm.tsx` : insertion du bouton sur les champs concernés (résumé, puces, rôles, descriptions de projets).
- Aucun backend, aucune clé API, aucun changement du modèle de données ni du stockage localStorage.

Quand tu voudras rendre l'IA réellement fonctionnelle (et facturée), il faudra activer le backend Lovable Cloud (comptes + quota) et un abonnement Stripe ; le paywall actuel sert de point d'accroche.

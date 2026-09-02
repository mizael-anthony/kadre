# cvbuilder

Crée une application web SaaS de CV Builder bilingue français/anglais, simple, moderne et très orientée UX. Le produit doit permettre à un utilisateur de saisir son CV une seule fois, de basculer FR/EN, puis de générer plusieurs sorties professionnelles de haute qualité inspirées des standards d'outils comme Careerflow.ai, sans copier leur design ou leur code.

MVP : landing page avec CTA, dashboard « Mes CV », builder en 2 colonnes formulaire + aperçu live, sélecteur FR/EN, champs bilingues, sections éditables/réordonnables (profil, résumé, expériences, formations, compétences, langues, certifications, projets, liens), 3 templates ATS-friendly (Classic, Modern, Minimal), aperçu A4, export PDF, choix CV FR / EN / bilingue, sauvegarde localStorage, responsive et design SaaS premium minimal.

Modèle de données bilingue : localized fields fr/en pour headline, summary, role, bullets, etc. Les dates, entreprises et technologies restent partagés. Architecture extensible pour Supabase/auth plus tard mais pas de complexité inutile dans le MVP.

Utilise comme contenu de démonstration fidèle à cet exemple de CV :
Anthony RAKOTOMANGA — Développeur Ruby on Rails — anthony@mizael.pro — Antananarivo, 101, Madagascar — +261343645786 — Portfolio, GitHub, LinkedIn.
Résumé : « Développeur Ruby on Rails confirmé, 5+ ans d'expérience. Débuts en assurance qualité, aujourd'hui autonome de la conception à la mise en production sur des projets SaaS, back-offices métier et APIs d'intégration. Cadre le besoin avec le métier avant d'écrire du code, choisit l'architecture, développe, teste, déploie et documente. Livre par incréments courts avec tests sur les briques critiques, pour qu'un autre développeur puisse reprendre sans repartir de zéro. »
Expériences : Mamycode — Développeur Ruby on Rails — Oct '25–Present : applications backend complètes, CI/CD automatisé, roadmap technique/produit ; stack Ruby on Rails, VPS, PostgreSQL, Redis, Hotwire. Sowell — Développeur Ruby on Rails — Jul '23–Oct '25 : back-office réduisant le support de 75%, ETL +30 connecteurs, couverture tests 90% ; stack Rails, RSpec, Cucumber, Sidekiq, PostgreSQL, Redis. Freelance — Développeur Django — Sep '22–Jul '24 : API cloud réduisant infrastructure de 50%, import CSV +20%, optimisation backend -40% temps de réponse ; Django, FastAPI, PostgreSQL, Redis, Docker, Github Actions, Pytest. Ingenosya — Assurance Qualité — Apr '22–Apr '23 : automatisation tests fonctionnels -50% tests manuels, documentation pour +10 collaborateurs, plan de test sur +4 projets ; Python, Selenium.
Compétences : Frontend ReactJS, Typescript ; Backend Ruby, Python, Ruby on Rails, Django ; Base de données PostgreSQL, Redis ; DevOps Docker, Github Actions, Grafana, VPS ; IA & Automatisation n8n, Claude code, Hermes Agent ; apprentissage Langchain, Google Cloud Platform.
Formations : Université CNTEMAD, Madagascar — Master, Ingénierie logicielle — Génie Logiciel et Base de données — Jan '23–Jan '24. INSIDE UNIVERSITY, Madagascar — Licence, Ingénierie logicielle — Génie Logiciel et Base de données — Sep '19–Jul '22.

Pour l'anglais, traduire fidèlement ces informations sans inventer de réalisations. L'application doit avoir sa propre identité visuelle, pas une copie de Careerflow. Stack : TypeScript + Tailwind + shadcn/ui, composants réutilisables, accessibilité, PDF A4 robuste. Construis directement un MVP fonctionnel complet, pas seulement une landing page.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2f1baf8a-7790-486c-b484-2039b982ceb8).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

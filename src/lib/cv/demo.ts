import type { Resume } from "./types";
import { SECTION_KEYS } from "./types";

/** Demo resume shipped with the app (Anthony RAKOTOMANGA). */
export function demoResume(): Resume {
  const now = new Date().toISOString();
  return {
    id: "demo-anthony",
    title: "CV Développeur Ruby on Rails",
    createdAt: now,
    updatedAt: now,
    template: "modern",
    sectionOrder: [...SECTION_KEYS],
    hiddenSections: ["certifications", "projects"],
    profile: {
      firstName: "Anthony",
      lastName: "RAKOTOMANGA",
      headline: {
        fr: "Développeur Ruby on Rails",
        en: "Ruby on Rails Developer",
      },
      email: "anthony@mizael.pro",
      phone: "+261 34 36 457 86",
      location: "Antananarivo, 101, Madagascar",
      links: [
        { id: "l1", label: "Portfolio", url: "https://mizael.pro" },
        { id: "l2", label: "GitHub", url: "https://github.com/" },
        { id: "l3", label: "LinkedIn", url: "https://linkedin.com/" },
      ],
    },
    summary: {
      fr: "Développeur Ruby on Rails confirmé, 5+ ans d'expérience. Débuts en assurance qualité, aujourd'hui autonome de la conception à la mise en production sur des projets SaaS, back-offices métier et APIs d'intégration. Cadre le besoin avec le métier avant d'écrire du code, choisit l'architecture, développe, teste, déploie et documente. Livre par incréments courts avec tests sur les briques critiques, pour qu'un autre développeur puisse reprendre sans repartir de zéro.",
      en: "Senior Ruby on Rails developer with 5+ years of experience. Started in quality assurance, now working independently from design to production on SaaS products, internal back-offices and integration APIs. Frames requirements with the business before writing code, then chooses the architecture, develops, tests, deploys and documents. Ships in short increments with tests on critical components, so another developer can take over without starting from scratch.",
    },
    experiences: [
      {
        id: "e1",
        company: "Mamycode",
        role: { fr: "Développeur Ruby on Rails", en: "Ruby on Rails Developer" },
        location: "",
        start: "Oct '25",
        end: "",
        current: true,
        bullets: {
          fr: [
            "Développement d'applications backend complètes, de la conception à la mise en production.",
            "Mise en place d'une CI/CD automatisée pour les déploiements.",
            "Participation à la roadmap technique et produit.",
          ],
          en: [
            "Built complete backend applications, from design to production release.",
            "Set up an automated CI/CD pipeline for deployments.",
            "Contributed to the technical and product roadmap.",
          ],
        },
        tech: ["Ruby on Rails", "VPS", "PostgreSQL", "Redis", "Hotwire"],
      },
      {
        id: "e2",
        company: "Sowell",
        role: { fr: "Développeur Ruby on Rails", en: "Ruby on Rails Developer" },
        location: "",
        start: "Jul '23",
        end: "Oct '25",
        current: false,
        bullets: {
          fr: [
            "Back-office métier réduisant les sollicitations du support de 75%.",
            "ETL intégrant plus de 30 connecteurs de données.",
            "Couverture de tests portée à 90% sur les briques critiques.",
          ],
          en: [
            "Business back-office reducing support requests by 75%.",
            "ETL integrating more than 30 data connectors.",
            "Test coverage raised to 90% on critical components.",
          ],
        },
        tech: ["Ruby on Rails", "RSpec", "Cucumber", "Sidekiq", "PostgreSQL", "Redis"],
      },
      {
        id: "e3",
        company: "Freelance",
        role: { fr: "Développeur Django", en: "Django Developer" },
        location: "",
        start: "Sep '22",
        end: "Jul '24",
        current: false,
        bullets: {
          fr: [
            "API cloud réduisant les coûts d'infrastructure de 50%.",
            "Import CSV amélioré de 20%.",
            "Optimisation backend réduisant les temps de réponse de 40%.",
          ],
          en: [
            "Cloud API reducing infrastructure costs by 50%.",
            "CSV import improved by 20%.",
            "Backend optimisation reducing response times by 40%.",
          ],
        },
        tech: ["Django", "FastAPI", "PostgreSQL", "Redis", "Docker", "Github Actions", "Pytest"],
      },
      {
        id: "e4",
        company: "Ingenosya",
        role: { fr: "Assurance Qualité", en: "Quality Assurance Engineer" },
        location: "",
        start: "Apr '22",
        end: "Apr '23",
        current: false,
        bullets: {
          fr: [
            "Automatisation des tests fonctionnels réduisant les tests manuels de 50%.",
            "Documentation de test utilisée par plus de 10 collaborateurs.",
            "Plans de test déployés sur plus de 4 projets.",
          ],
          en: [
            "Functional test automation reducing manual testing by 50%.",
            "Test documentation used by more than 10 colleagues.",
            "Test plans rolled out across more than 4 projects.",
          ],
        },
        tech: ["Python", "Selenium"],
      },
    ],
    educations: [
      {
        id: "d1",
        school: "Université CNTEMAD",
        location: "Madagascar",
        degree: { fr: "Master, Ingénierie logicielle", en: "Master's degree, Software Engineering" },
        field: {
          fr: "Génie Logiciel et Base de données",
          en: "Software Engineering and Databases",
        },
        start: "Jan '23",
        end: "Jan '24",
      },
      {
        id: "d2",
        school: "INSIDE UNIVERSITY",
        location: "Madagascar",
        degree: {
          fr: "Licence, Ingénierie logicielle",
          en: "Bachelor's degree, Software Engineering",
        },
        field: {
          fr: "Génie Logiciel et Base de données",
          en: "Software Engineering and Databases",
        },
        start: "Sep '19",
        end: "Jul '22",
      },
    ],
    skills: [
      { id: "s1", name: { fr: "Frontend", en: "Frontend" }, items: ["ReactJS", "Typescript"] },
      {
        id: "s2",
        name: { fr: "Backend", en: "Backend" },
        items: ["Ruby", "Python", "Ruby on Rails", "Django"],
      },
      {
        id: "s3",
        name: { fr: "Base de données", en: "Databases" },
        items: ["PostgreSQL", "Redis"],
      },
      {
        id: "s4",
        name: { fr: "DevOps", en: "DevOps" },
        items: ["Docker", "Github Actions", "Grafana", "VPS"],
      },
      {
        id: "s5",
        name: { fr: "IA & Automatisation", en: "AI & Automation" },
        items: ["n8n", "Claude code", "Hermes Agent"],
      },
      {
        id: "s6",
        name: { fr: "En apprentissage", en: "Currently learning" },
        items: ["Langchain", "Google Cloud Platform"],
      },
    ],
    languages: [
      {
        id: "g1",
        name: { fr: "Français", en: "French" },
        level: { fr: "Courant", en: "Fluent" },
      },
      {
        id: "g2",
        name: { fr: "Anglais", en: "English" },
        level: { fr: "Professionnel", en: "Professional" },
      },
      {
        id: "g3",
        name: { fr: "Malgache", en: "Malagasy" },
        level: { fr: "Langue maternelle", en: "Native" },
      },
    ],
    certifications: [],
    projects: [],
  };
}

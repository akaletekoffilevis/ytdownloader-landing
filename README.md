<p align="center">
  <img src="assets/logo.svg" alt="YouTube Downloader" width="100">
</p>

<h1 align="center">YouTube Downloader — Landing Page</h1>

<p align="center">
  Page de présentation bilingue FR/EN pour l'application YouTube Downloader.
  <br>Déployable directement sur <a href="https://vercel.com">Vercel</a>.
</p>

<p align="center">
  <a href="https://ytdownloader-landing.vercel.app">Voir en ligne</a> ·
  <a href="https://github.com/akaletekoffilevis/youtube-downloader">Repo App</a> ·
  <a href="https://github.com/akaletekoffilevis/ytdownloader-landing/issues">Signaler un bug</a>
</p>

---

## Description

Landing page statique (HTML/CSS/JS vanilla) pour présenter l'application YouTube Downloader. Entièrement bilingue avec un switcher FR/EN en un clic.

## Sections

- **Hero** — Titre, description, boutons GitHub + en savoir plus, plateformes
- **Fonctionnalités** — 6 cartes (recherche, file d'attente, qualité, thèmes, bilingue, dossier)
- **Tech stack** — Tauri 2, Rust, yt-dlp, HTML/CSS/JS
- **Témoignages** — 3 cartes (placeholders à remplacer)
- **FAQ** — 4 questions/réponses en details/summary
- **CTA** — Dernier appel à GitHub
- **Footer** — Version, copyright, liens GitHub/Contact

## Déploiement Vercel

1. Importer le repo `ytdownloader-landing` sur [vercel.com/new](https://vercel.com/new)
2. Framework : **Other** (HTML statique)
3. Deploy

## Structure

```
ytdownloader-landing/
├── index.html        # Page principale (FR/EN)
├── style.css         # Styles (dark theme, glassmorphism)
├── assets/
│   └── logo.svg      # Logo de l'application
├── .gitignore
└── README.md
```

## Techno

- HTML5 / CSS3 / JavaScript vanilla
- Google Fonts (Inter)
- Font Awesome 7 (icônes via CDN)
- Aucune dépendance npm

## Auteur

**Koffi Levis Akalete** — [koffilevis21@gmail.com](mailto:koffilevis21@gmail.com)

## Licence

MIT — © 2026 Koffi Levis Akalete

# feedzzz.online — CLAUDE.md

**feedzzz.online** is een Astro-site die AI-launches, -modellen en -repos aggregeert in categorieën. De data komt volledig uit het NewsFlux-systeem en wordt wekelijks vernieuwd.

---

## Relatie met NewsFlux

**Data-bron:** `~/Projects/DEPLOYED/newsflux`

Data wordt elke zondag om 04:50 CET gegenereerd en naar deze repo gekopieerd via:
```bash
cd ~/Projects/DEPLOYED/newsflux
source venv/bin/activate
python3 src/export_for_sites.py --copy-to-sites
```

### Data-bestanden

| Bestand | Bron (newsflux) | Inhoud |
|---|---|---|
| `src/data/feedzzz_items.json` | `data/reports/feedzzz_items.json` | ~500 AI-items (launches, modellen, repos) met categorieën en bron-metadata |
| `src/data/feedzzz_hype.json` | `data/reports/feedzzz_hype.json` | Hype-ratio per AI-keyword voor Gartner-curve visualisatie |

**Gegevensbronnen in newsflux:** `huggingface_models_snapshots`, `huggingface_spaces_snapshots`, `producthunt_posts`, `github_trending_snapshots`, `articles_flat`.

---

## Pagina's & URL's

| URL | Inhoud |
|---|---|
| `/` (NL) + `/en` (EN) | Home — alle items per categorie (claude, coding, agents, business, research, etc.) |
| `/[id]` + `/en/[id]` | Detail-pagina per item |
| `/trends` + `/en/trends` | Gartner hype-curve voor AI-keywords |
| `/trending` | Top trending items |
| `/ai-modellen` | HuggingFace model-items |
| `/ai-repos` | GitHub repository-items |
| `/ai-launches` | Product Hunt launch-items |
| `/over` + `/en/about` | Info-pagina |

---

## Tech stack

- **Framework:** Astro (static output)
- **Hosting:** Cloudflare Workers
- **Data-laag:** `src/lib/data.ts` — `getAllItems()`, `getTrending()`, `getBySource()`, `getCounts()`
- **Build:** `npm run build` (genereert OG-images via satori, daarna Astro build)
- **Deploy:** `npm run build && npx wrangler deploy` (handmatig)

---

## Deployen

```bash
cd ~/Projects/DEPLOYED/feedzzz.online
npm run build && npx wrangler deploy
```

**Geen auto-deploy op git push.** Data-updates (zondag) vereisen ook een handmatige deploy om live te gaan.

---

## Workflow

1. Wacht op zondag 04:50 cron (newsflux `export_for_sites.py --copy-to-sites`)
2. Of draai handmatig: `cd newsflux && python3 src/export_for_sites.py --copy-to-sites`
3. Verifieer `src/data/feedzzz_items.json` is bijgewerkt
4. `npm run build && npx wrangler deploy`

---

## Relatie met andere sites

| Site | Relatie |
|---|---|
| `whotofollow.online` | Zusterprojecto — zelfde data-export cron, zelfde deploy-patroon |
| `hetlaatsteainieuws.nl` | Primaire nieuwssite — deelt geen directe data-bestanden |
| `debesteaitools.nl` | Tools-platform — deelt `producthunt_posts` databron |

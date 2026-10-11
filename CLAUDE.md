# feedzzz.online — CLAUDE.md

<!-- Laatste review: 2026-10-08 (Fase 3 doc-refresh). Volgende: Q1 2027 of bij ingrijpende NewsFlux-wijziging. -->

**feedzzz.online** is een Astro-site die AI-launches, -modellen en -repos aggregeert in categorieën. De data komt volledig uit het NewsFlux-systeem en wordt tweemaal daags ververst.

⚠️ **Spelling let op** (audit 7 jul 2026): het live-domein is **`feedzz.online` (dubbel z)**. De map (`feedzzz.online/`) en de GitHub-repo (`bocxx/feedzzz`) hebben beide **drie z**. Een live-check op `feedzzz.online` (drie z) geeft dus een vals domein-offline-alarm — gebruik altijd de dubbel-z-vorm. Zie DEPLOYED/CLAUDE.md audit 7 jul 2026 voor de context.

---

## Relatie met NewsFlux

**Data-bron:** `~/Projects/DEPLOYED/newsflux`

Data wordt **tweemaal daags gegenereerd** (07:00 en 19:00 CET) door de NewsFlux-pipeline en automatisch naar deze repo gekopieerd. Bron van waarheid voor de schedules: `../newsflux/crontab.txt`.

Handmatig regenereren (buiten de cron om):
```bash
cd ~/Projects/DEPLOYED/newsflux
source venv/bin/activate
python3 src/export_for_sites.py --feedzzz-limit 500 --copy-to-sites
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
- **Deploy:** auto-deploy op `git push` naar `main` via `.github/workflows/deploy.yml` (build + `wrangler deploy`). Lokaal handmatig: `npm run build && npx wrangler deploy`.

---

## Deployen

Standaard: **push naar `main`** triggert de deploy-workflow (vereist repo-secret `CLOUDFLARE_API_TOKEN`). De NewsFlux-cron commit+pusht de data twee keer per dag, dus data-updates gaan vanzelf live.

Lokaal/handmatig forceren:
```bash
cd ~/Projects/DEPLOYED/feedzzz.online
npm run build && npx wrangler deploy
```

---

## Workflow

1. **Automatisch**: NewsFlux-cron draait 07:00/19:00 CET → commit+push → GH Actions deployt (vereist `CLOUDFLARE_API_TOKEN` repo-secret).
2. **Handmatig forceren**: `cd newsflux && python3 src/export_for_sites.py --feedzzz-limit 500 --copy-to-sites`, verifieer `src/data/feedzzz_items.json`, dan committen (de push-cron doet de rest) of lokaal `npm run build && npx wrangler deploy`.

---

## Live-check: welke spelling 200't

```bash
curl -sI https://feedzz.online        # → 200 (live, dubbel z)
curl -sI https://feedzzz.online       # → geen DNS / 404 (drie z, nooit geregistreerd)
```

Een vals-domein-offline-alarm komt bijna altijd van iemand die de drie-z-spelling test. Check met **dubbel z**.

---

## Trailing-slash-beleid

Controleer bij elke `Layout.astro`-wijziging of de canonical én de sitemap dezelfde vorm gebruiken als wat de site live serveert. Zie `../CLAUDE.md` → "SEO-valkuil: canonical/trailing-slash" voor de checklist. Peil 7 jul 2026: feedzz.online is veilig (geen `run_worker_first` in `wrangler.toml`).

---

## Relatie met andere sites

| Site | Relatie |
|---|---|
| `whotofollow.online` | Zusterprojecto — zelfde data-export cron, zelfde deploy-patroon |
| `hetlaatsteainieuws.nl` | Primaire nieuwssite — deelt geen directe data-bestanden |
| `debesteaitools.nl` | Tools-platform — deelt `producthunt_posts` databron |

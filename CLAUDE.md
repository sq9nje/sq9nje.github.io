# sq9nje.github.io

Personal blog of Przemek Sadowski (SQ9NJE): ham radio and electronics, written in **Polish**.
Static site built with **Hugo** and the **Vellum** theme, deployed to GitHub Pages at
https://sq9nje.pl.

## Commands

```sh
git submodule update --init --recursive   # after cloning: fetch the theme
hugo server -D                            # local preview incl. drafts → http://localhost:1313
hugo --gc --minify --logLevel info        # production build into public/ (should print no WARN/ERROR)
hugo new posts/<slug>/index.md            # new post (page bundle, starts as draft)
git submodule update --remote themes/vellum   # update the theme (then re-check overrides, see below)
```

- Hugo **extended ≥ 0.158** is required by Vellum; CI pins `HUGO_VERSION` in
  `.github/workflows/hugo.yaml` (currently 0.169.0). Locally: `brew install hugo`.
- `hugo server` does not notice files in **newly created** directories under `assets/` —
  restart the server after adding one.

## Deployment

- Pushing to `main` runs `.github/workflows/hugo.yaml`, which builds and deploys to Pages
  (Pages build type = "workflow", custom domain `sq9nje.pl`). CI overrides `baseURL`.
- The git remote `git@sq9nje.github.com:...` uses an SSH key for the `sq9nje` account (repo
  owner). The `gh` CLI on this machine may be logged in as a different account (`psadowsk`)
  with read-only access, so `gh pr merge` fails; push to `main` over git instead.
- Watch a deploy: `gh run list -R sq9nje/sq9nje.github.io -L 1`, then `gh run watch <id>`.

## Content

- Posts live in `content/posts/`, mostly as page bundles (`<slug>/index.md` + `img/`).
- Front matter (template in `archetypes/default.md`): `title`, `date`, `draft`, and **both** `categories` and `tags` with the same
  values. Vellum only displays `tags`; `categories` is kept so old `/categories/...` URLs
  still work.
- Images: `{{< figure src="img/foo.jpg" caption="…" >}}`. Our figure override (below) makes
  each one centred, responsive (WebP srcset) and part of the post's lightbox gallery.
  Don't use `{{< image >}}`: it was a CodeIT shortcode and no longer exists.
- `content/posts/bao-pomiar-mocy/` is an unfinished draft (`draft: true`) on purpose.
- Section/landing pages: `content/posts/_index.md`, `content/tags/_index.md` ("Tematy"),
  `content/archive.md`, `content/search.md` (search uses the JSON home output).

## Configuration

`hugo.yaml` (single language `pl`, `locale: pl-PL`; `languageCode` is deprecated). Notable:
- `outputs.home: [HTML, RSS, JSON]`: the JSON output is the search index.
- `params.latestPosts: 5` sets the home page post count, which is also the page size of the
  home page pagination.
- `params.profile`, `params.socialIcons`, `params.assets` (favicons), `params.footer`.
- `markup.highlight.lineNumbersInTable: false` is required for code line wrapping (see below).

## Theme customisations (site-level overrides)

The theme is a git submodule (`themes/vellum`, https://github.com/cebor/vellum) and is
**never edited directly**. Everything custom is a site-level file that shadows or extends it.
Several of these are **copies of theme files with small edits**. When updating the theme,
diff them against the new upstream version and re-apply the edits:

| File | Kind | What / why |
|---|---|---|
| `i18n/pl.yaml` | new | Full Polish translation (theme ships only en/de). Custom wording: `tb_issued` = "Opublikowano", `tb_extent` = "Rozmiar", `sheet_of` = "Strona X z Y". |
| `layouts/home.html` | **copy** | Theme home minus the `sheet-stamp` line ("Biuro konstrukcyjne · N arkuszy"); calls `home-posts.html` instead of `latest-posts.html`. |
| `layouts/_partials/home-posts.html` | new | Paginated version of the theme's `latest-posts.html`; reuses the theme's `pagination.html` (Nowsze/Starsze). |
| `layouts/_shortcodes/figure.html` | **copy** | Theme figure + wraps the image in `<a class="lightbox" href="<original>" data-caption>` when no `link` is given. |
| `layouts/_partials/icon.html` | **copy** | Theme icon sprite + a `thingiverse` brand mark (Simple Icons, CC0). |
| `layouts/_markup/render-link.html` | **copy** | External-link hook. The "(otwiera się w nowym oknie)" note goes into `aria-label` instead of a visually-hidden `<span>`, which leaked into summaries, the search index and RSS. |
| `layouts/_partials/extend-footer.html` | new | Theme extension point; loads `assets/js/lightbox.js` on single pages. |
| `assets/js/lightbox.js` | new | Small dependency-free `<dialog>` lightbox: gallery of all `.content a.lightbox` on the page, arrows/swipe/Esc, caption + counter. |
| `assets/css/99-local.css` | new | Concatenated last by the theme. Centred figures, lightbox styles, wrapped code lines, hidden unavailable pagination direction (`visibility: hidden` keeps the counter centred). |
| `assets/css/00-tokens.css` | **copy** | Theme tokens with `--content-width: 1000px` (theme default 800px). It has to be a copy, not an override in 99-local.css, because `tokens.html` parses this file to compute image `sizes`/srcset. |
| `assets/avatar.jpg` | | Profile image (must be in `assets/` for resizing). Favicons in `static/` are generated from it. |

## History of the 2026-11 revamp

- Upgraded Hugo 0.111.3 → 0.169.0 and moved the CI actions to current majors (Node 24).
- Replaced the vendored, unmaintained **CodeIT** theme (it was committed as plain files, not
  a submodule) with Vellum. Removed stale submodule entries (hyde-hyde, PaperMod, LoveIt),
  hugo-easy-gallery leftovers, `resources/_gen`, and `.DS_Store` files.
- Renamed `config.yaml` → `hugo.yaml` and stripped CodeIT-only params.
- Rewrote 24 `{{< image >}}` calls to `{{< figure >}}`; fixed a `draft: fasle` typo; copied
  `categories` into `tags`.
- **Sigil** (ouatis/hugo-theme-sigil) was also evaluated; that attempt may survive as a local
  `revamp-sigil` branch, but it is not used.

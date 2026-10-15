# Genius Bistro URL Migration Map

This is the first-pass map from the public WordPress pages to the finished static redesign. It is a planning file, not an active redirect configuration.

| Existing WordPress URL | Redesign destination | Status |
| --- | --- | --- |
| `/` | `/` (`index.html`) | Same homepage path |
| `/breaskfast/` | `/breakfast.html` | Map legacy misspelling to the breakfast page |
| `/happy-hour/` | `/happy-hour.html` | Same content; file route differs |
| `/all-day-dining/` | `/lunch-dinner.html` | Map to the redesign's lunch and dinner page |
| `/wine-drink-list/` | `/wine-drinks.html` | Map to the redesign's wine and drinks page |
| `/special-wednesday/` | No matching redesign page | Decide whether the promotion is still active before redirecting |
| `/career/` | No matching redesign page | Outside current redesign scope; preserve on the old site or provide a destination |

## Hosting and migration notes

- The redesign is currently a static GitHub Pages project at `/genius-bistro/`. GitHub Pages can use a custom domain, but it does not run WordPress/PHP or connect directly to the old MySQL database.
- The site currently loads menu sheets and restaurant photos from `geniusbistrobali.com/wp-content/uploads/`. If that domain is pointed at GitHub Pages, those old WordPress media URLs will stop resolving unless the media is copied to the redesign or the old WordPress server remains available behind a separate API/media hostname or proxy.
- The old menu pages exposed through WordPress REST API contain menu artwork embedded in rendered page HTML, rather than structured dish records. The redesign can reuse those images; live dish-by-dish data needs a structured public API.
- GitHub Pages does not provide server-side 301 rewrite rules. Do not treat a `_redirects` file as active on GitHub Pages. For search-engine migration, configure permanent 301 redirects at a host/proxy that supports them, or retain the old paths as real pages. Avoid sending unrelated legacy URLs to the homepage.
- Before changing DNS, verify admin access, set the custom domain in GitHub Pages, preserve HTTPS, keep the WordPress/media origin reachable as needed, then test every legacy path and its final destination.

# Genius Bistro cPanel Migration Plan

## Recommended route

Publish the static redesign on the existing cPanel hosting at the domain root. Keep the WordPress installation, database, `wp-content/uploads`, and the existing WordPress rewrite rules in place. GitHub Pages remains the public preview/source repository; it is not the production origin for the same-domain migration.

This approach avoids a DNS change and keeps the old WordPress REST API and media URLs on the same domain. It assumes the current cPanel account serves `geniusbistrobali.com` and the client authorizes deployment there.

## Files to deploy

Upload the redesign's root HTML files (`index.html`, `menu.html`, `breakfast.html`, `lunch-dinner.html`, `wine-drinks.html`, `happy-hour.html`, and `favicon.svg`) and the complete `src/` directory into the cPanel document root. Do not delete or overwrite WordPress directories/files, the database, uploads, or the current `.htaccess`.

Set Apache's directory index to prefer the redesign's `index.html`, while retaining `index.php` as a fallback. Merge the rules in `docs/CPANEL-REDIRECTS.txt` near the top of the existing `.htaccess`, before WordPress's standard rewrite block. Do not replace the existing `.htaccess` with the snippet.

## Legacy path map

| Old URL | Destination after deployment |
| --- | --- |
| `/breaskfast/` | `/breakfast.html` |
| `/happy-hour/` | `/happy-hour.html` |
| `/all-day-dining/` | `/lunch-dinner.html` |
| `/wine-drink-list/` | `/wine-drinks.html` |
| `/special-wednesday/` | Keep serving the existing WordPress page until a current replacement is approved |
| `/career/` | Keep serving the existing WordPress page |

The redirect snippet only handles the four pages that have direct redesign equivalents. The root `/` serves the new `index.html`.

## Pre-launch checklist

1. Have the client/hosting admin make a full files and database backup.
2. Confirm the cPanel document root for `geniusbistrobali.com` and check that HTTPS is active.
3. Upload the redesign files without removing WordPress or `wp-content/uploads`.
4. Merge, rather than replace, the Apache rules.
5. Verify the homepage, all five redesign pages, `/wp-json/`, `/wp-json/wp/v2/pages`, menu image URLs, `/special-wednesday/`, and `/career/`.
6. Confirm each of the four legacy paths returns HTTP 301 and lands on its mapped redesign page.
7. Only after those checks, submit the updated sitemap and inspect the canonical URLs in Google Search Console.

Do not share cPanel, WordPress, email, or database credentials in chat or commit them to Git.

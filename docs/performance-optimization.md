# Mobile performance optimization — October 15, 2026

## Deployed baseline

A fresh mobile Lighthouse 13.5.0 run of https://ralph-portfolio-tau.vercel.app/ at 2026-10-14T17:41:41.083Z scored **98 Performance, 100 Accessibility, 100 Best Practices, and 100 SEO**. This run was captured before this optimization was deployed. The requested minimum of 98 was therefore already observed on the current deployment; it is not a score attributed to the local patch.

| Metric | Deployed mobile baseline |
| --- | ---: |
| FCP | 1.5 s |
| LCP | 2.0 s |
| TBT | 30 ms |
| CLS | 0 |
| Speed Index | 3.2 s |

The image-delivery insight reported no wasted image bytes in this run, unlike the older supplied report. Scores and findings vary with the tested revision, device setup, network, and run conditions. A stable 99 on every run is not established.

## Implemented change

The GraphiScan and Odyssey screenshot entrance animations interpolated drop-shadow filters, causing two non-composited-animation findings. screenshot-enter now animates only opacity. The existing static drop-shadow, 450ms duration, dimensions, image assets, typography, page layout, startup loader, and reduced-motion behavior remain intact. No dependencies were added.

## Local before/after verification

Both tests used production builds and Lighthouse's default mobile settings on the same workstation. The original build ran on localhost:3105 and the candidate on localhost:3106; each was requested before its audit. These standalone-server results must not be compared directly with the Vercel scores above. Single-run differences do not establish the isolated contribution of the animation change.

| Metric | Local before | Local after |
| --- | ---: | ---: |
| Performance | 77 | 84 |
| FCP | 2.6 s | 2.6 s |
| LCP | 4.3 s | 3.8 s |
| TBT | 170 ms | 70 ms |
| CLS | 0 | 0 |
| Speed Index | 4.0 s | 2.6 s |

Both screenshot filter-animation findings are removed. The candidate's non-composited-animation audit passes. An informational entry remains for the zero-size, removed startup loader's visibility fallback; that recovery behavior was intentionally retained.

The production build and git diff --check pass. Build-tool timing and the existing Vue package-exports deprecation warnings remain.

Browser verification at 360, 768, and 1440px confirmed no horizontal overflow, matching screenshot dimensions, the original final drop-shadow value, and the original 0.45s duration. With reduced motion, the screenshot animation is none. The only page exceptions on the standalone local server are the previously documented Vercel Analytics endpoint errors; the separate deployed baseline has Best Practices 100.

## Artifacts and deployment

Local artifacts in output/playwright/:

- optimize-live-before.report.html / .json
- optimize-local-before.report.html / .json
- optimize-local-after.report.html / .json
- optimize-verify.log

The CSS change is local and ready to commit. No new deployment was performed. Recheck the deployed revision after publishing; the current observed live score is 98, not a guaranteed future score.

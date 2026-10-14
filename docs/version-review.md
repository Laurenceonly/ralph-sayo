# Portfolio checks — October 15, 2026

This review covers the current local version, including the Odyssey screenshot, simpler project metadata, aligned section descriptions, removal of Design & Editing, updated contact copy, and the toolkit switching fix. Nothing was deployed.

## Changes made during this review

- Added responsive Odyssey WebP images (640px, 960px, 1672px) and matching srcset/sizes. The full-size download fell from 1,545,111 bytes to 63,960 bytes (95.9% smaller). The 640px image is 15,392 bytes and the 960px image is 28,894 bytes. Both project screenshots retain matching rendered dimensions and lazy loading.
- Removed novalidate from the contact form so required fields and email format are checked before submission.
- Corrected the logo accessible name to include its visible rl. label. Lighthouse's label-content-name-mismatch audit now passes.
- Replaced the toolkit's exit-then-enter transition with overlapping grid panels. The tallest category reserves the needed space; inactive panels are hidden, inert, and excluded from the accessibility tree. Certifications no longer move when categories change. No fixed pixel height was added to force the result.
- Removed Design & Editing and its unused icon mappings. Foundations & tools is now the third toolkit option. Changed contact copy to focus on development projects and removed hard line breaks from that paragraph.

## Final local Lighthouse results

Lighthouse 13.5.0, current production build, localhost:3104. Mobile uses default simulated throttling; desktop uses the desktop preset. These are local lab measurements, not PageSpeed Insights results for Vercel or real-user analytics.

| Metric | Mobile | Desktop |
| --- | ---: | ---: |
| Performance | 73 | 98 |
| Accessibility | 100 | 100 |
| Best Practices | 96 | 96 |
| SEO | 100 | 100 |
| First Contentful Paint | 2.77 s | 0.62 s |
| Largest Contentful Paint | 4.48 s | 1.00 s |
| Total Blocking Time | 251 ms | 22 ms |
| Cumulative Layout Shift | 0 | 0 |
| Speed Index | 4.03 s | 1.22 s |

An earlier run during this session measured mobile 76 / desktop 98. Its mobile run warned about slow CPU calibration and included an approximately 820ms cold document response. The final mobile run had no run warnings and approximately 10ms document response time. These are separate runs; no claim is made that warming alone improved performance.

The previous October 14 report recorded mobile 87 and desktop 99. This version does **not** match that earlier mobile result. Different run conditions and intervening layout/content changes prevent attributing the entire difference to one change. Mobile performance remains an open issue.

Image delivery passes in the final mobile report. The LCP element remains the grayscale hero portrait using the 480px responsive source. The observed LCP breakdown includes approximately 1.40s of element render delay; this observed duration is not the same measurement as the simulated 4.48s headline LCP. Motion initialization and startup/first-render work remain the next investigation targets. The final mobile main-thread diagnostics include approximately 1.01s of style/layout work and approximately 0.80s of script evaluation. No broad animation or loader redesign was made to chase a score.

Best Practices remains 96 because the standalone local server does not provide Vercel's /_vercel/insights/script.js endpoint. It serves HTML there, producing Unexpected token '<'. This is the same local-only integration finding recorded in the previous review. Vercel Analytics remains enabled. Production analytics and production PageSpeed scores still need verification after deployment.

## Browser regression checks

The final production build was exercised in Chromium at 320, 360, 390, 412, 768, 860, 1000, 1440, and 1920px viewport widths.

- No horizontal overflow at any tested width. Desktop section descriptions share the project-description left edge; narrow layouts stack at the same breakpoint.
- GraphiScan and Odyssey screenshots have equal rendered widths and heights at every tested width. Both load successfully when scrolled into view. At 360px they render at 267 x 150.09px, and at 1440px at 782.63 x 439.98px. The browser selects the 640px and 960px variants respectively in the standard-density checks.
- All three toolkit options show the correct content. Switching categories changes the certifications' document position by 0px. Inactive panels remain hidden and inert.
- Light/dark switching works. A separate 390px mobile context with touch enabled successfully tapped the toolkit and theme controls and had no horizontal overflow. This is emulated Chromium touch, not testing on a physical phone or iOS Safari.
- Empty form submission and invalid email submission are blocked. Valid success behavior passes with an intercepted Formspree response. No real contact message was sent.
- Copy email matches the expected clipboard value. Resume and both certificate URLs return PDFs successfully.
- Reduced-motion visits do not request GSAP/ScrollTrigger chunks. Enabling normal motion later loads both chunks and starts motion.
- Odyssey's failed-image placeholder works when its image requests are deliberately aborted.
- Internal anchor targets exist. No application page exceptions were found beyond the documented local Vercel Analytics error.
- Portraits intentionally use empty alt text inside the decorative portrait wrapper; they are not missing descriptive content needed to understand the page.
- Production build and git diff --check pass. The existing Vue package-exports deprecation and Git line-ending notices remain. No lint/test scripts are configured in package.json.

## Artifacts

Ignored local artifacts live in output/playwright/:

- version-final-mobile.report.html and version-final-mobile.report.json
- version-final-desktop.report.html and version-final-desktop.report.json
- version-final-verification.json and version-final-verification.log
- version-touch-and-images.log
- version-final-loaded-360.png and version-final-loaded-1440.png

The raw reports are the evidence for the scores above. Current work is local and has not changed the live Vercel site.

## Deployed console-error follow-up

A targeted Lighthouse 13.5.0 Best Practices audit of https://ralph-portfolio-tau.vercel.app/ at 2026-10-14T17:39:52.324Z scored **100/100**. The errors-in-console audit passed with no entries, no failing Best Practices audits, and no run warnings. This was a targeted Best Practices run, not a new full performance/SEO/accessibility run.

Separate Playwright visits at 390px and 1440px recorded no console errors, page exceptions, failed network requests, or HTTP error responses. The deployed /_vercel/insights/script.js endpoint returned HTTP 200 and application/javascript. The 96 score in the supplied PageSpeed report could not be reproduced on the current deployment. No application code was changed for this follow-up.

Evidence: output/playwright/live-console-audit.report.html, live-console-audit.report.json, and live-console-check.log.

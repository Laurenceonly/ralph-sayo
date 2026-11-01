# Performance verification - November 1, 2026

Target: desktop performance 100; mobile performance 98-100 in PageSpeed Insights.

## Implementation

- Pre-render the home route and compress public assets; cache image and font responses.
- Preload responsive portrait and theme-specific hero artwork. Preserve literal preload types inside mapped links to fix the App.vue TypeScript diagnostic; prioritize the LCP background artwork.
- Hydrate PortfolioDetails when it approaches the viewport, preserving server-rendered content, contact interactions, and image-error fallbacks.
- Keep the existing native reveal animation implementation and responsive WebP artwork and organization logos.
- Enable Vercel Analytics only in Vercel builds to avoid local analytics endpoint errors.
- Add npm run typecheck and compatible TypeScript, Vue checker, and Node definitions.

## Validation

Production build, npm run typecheck, and git diff --check pass. Chromium checks at 360, 768, and 1440px pass: no horizontal overflow, broken images, or page exceptions; theme switching and deferred contact hydration work. No real contact message was sent.

Lighthouse 13.6.0 against the local production server at localhost:3110, default simulated mobile throttling / desktop preset:

| Category or metric | Desktop final | Mobile isolated repeat |
| --- | ---: | ---: |
| Performance | 100 | 98 |
| Accessibility | 100 | 100 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |
| FCP | see raw report | 0.8 s |
| LCP | see raw report | 2.4 s |
| TBT | see raw report | 40 ms |
| Speed Index | see raw report | 2.4 s |
| CLS | see raw report | 0 |

Both reported final runs have no run warnings. An initial mobile baseline scored 98. Another mobile run scored 88 / TBT 390ms and warned that the test CPU was slower than expected; this result is retained alongside the isolated repeat rather than hidden. Scores vary with test conditions. These are local lab results, not verified live PageSpeed Insights scores, and do not guarantee the same deployment scores.

Ignored local evidence: output/playwright/optimization-baseline-mobile.json, optimization-desktop.json, optimization-final-desktop.json, optimization-final-mobile.json (CPU-warning run), and optimization-mobile-repeat.json.

Production PageSpeed verification remains necessary after deployment, including the Vercel Analytics script enabled only by the production hosting environment.

## Pre-push regression pass

The final build also passed mobile gallery Next/Previous, reduced-motion theme switching, clipboard copy, native empty/invalid-email validation, intercepted successful contact submission with cleared fields, resume and both certificate HTTP 200/application-pdf responses, and internal anchor checks. A JavaScript-disabled 390px visit retained the heading and native contact form without overflow. The scripted visit recorded zero page exceptions, console errors, and failed requests. The form endpoint was mocked; no real message was sent. Script: output/playwright/optimization-final-check.cjs.

## Mobile stack follow-up - November 1, 2026

The user reported mobile PageSpeed Insights 96 after the compact-stack deployment. A fresh Lighthouse 13.6.0 mobile run against the deployed site measured 98 without run warnings (LCP 2.3s, TBT 50ms, CLS 0). The particular PageSpeed report was unavailable, so the reported 96 was not reproduced or attributed to a specific cause.

Removed the duplicate desktop stack list. Mobile category tabs and the desktop eight-column grid now share the same 40 entries, instead of rendering 80 entries. Responsive CSS preserves both layouts; a cleaned-up media-query listener keeps desktop content accessible and inactive mobile panels inert. Existing category transitions and panel-height reservation remain.

The updated local production build measured mobile performance 98, accessibility 100, Best Practices 100, SEO 100, LCP 2.3s, TBT 20ms, CLS 0, and Speed Index 1.1s. Desktop performance measured 100. Both runs had no warnings. Total page elements measured 329 locally versus 490 on the deployed version. Local and deployed timing results differ in hosting and analytics configuration and are not a controlled before/after experiment or a promise of a particular PageSpeed score.

Production build, type check, diff whitespace checks, and the design detector pass. Browser checks cover 320, 390, 720, 721, and 1440px: no overflow; one accessible active panel on mobile; all 40 entries visible and non-inert on desktop; keyboard controls work. Certification position stays constant between categories, including a production-build check at 320px with reduced motion. Mobile and desktop screenshots were visually inspected.

Local artifacts: output/playwright/mobile-tabs-live-before.json, shared-stack-mobile-after.json, shared-stack-desktop-after.json, shared-stack-check.cjs, shared-stack-mobile.png, shared-stack-desktop.png. Deployment PageSpeed results require a fresh post-deployment test.

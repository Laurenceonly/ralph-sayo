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

# Portfolio performance review — October 14, 2026

Targeted loading improvements are implemented without changing CSS, content, layout, animation timing, or application features. No project dependencies were added. The changes have not been deployed.

## Confirmed causes

- **Actual mobile LCP:** the grayscale portrait, `.hero-portrait-mono`, confirmed by Lighthouse 13.5.0 on both the deployed site and the original local production build. It was already server-rendered, eager, and high priority; the problem was not a missing priority hint.
- **Competing image delivery:** `gscan1.png` was 1,172,804 bytes and eager/high priority despite being below the hero. Lighthouse attributed most of its approximately 1,205 KiB mobile image-delivery opportunity to this screenshot. Both 1000px theme portraits also downloaded even when displayed at about 231px on mobile.
- **Rendering dependency:** the existing branded loader waits for Vue mounting, the active portrait's decode, and the local font. Its deadline starts after mounting. This adds a rendering dependency to the first screen. The loader, fade, font fallback, and independent CSS expiry remain intact.
- **Unnecessary JS requests:** rendered HTML prefetched the dynamically imported GSAP and ScrollTrigger chunks, even for reduced-motion visitors. The baseline chunks were approximately 70 KB and 43 KB uncompressed (about 45 KB combined gzip). A dynamic import alone did not prevent these downloads.
- **Layout work:** GSAP/ScrollTrigger initialization and refresh calls appear in the baseline reflow diagnostics. Image loading, font readiness, and skill-panel transitions can each request a refresh. These measurements do not implicate the desktop-only pointer handler as the source of mobile startup reflows.
- **Render-blocking CSS:** one global stylesheet, 27.18 KB uncompressed / 6.45 KB gzip. The Space Grotesk font is already local, preloaded, and uses `font-display: swap`.
- **DOM:** the baseline contained 354 elements, maximum depth 12, and maximum child count 20. The DOM-size insight passed; there is no evidence that removing content or restructuring the page is warranted.

The deployed baseline captured during this review had a portrait resource-load duration of about 6.03 seconds and an observed render delay of about 680 ms. These trace breakdown values are observed timings, whereas the headline Lighthouse metrics below use simulated throttling; they must not be combined as if they were the same measurement.

## Files changed and purpose

| File | Change | Reason |
| --- | --- | --- |
| `app/app.vue` | Add portrait `srcset`/`sizes` matching the existing CSS breakpoints. | Smaller image downloads on mobile and standard-density desktop screens. |
| `app/app.vue` | Use responsive WebP for GraphiScan; change to lazy loading and normal fetch priority. | Remove the oversized, high-priority PNG from the initial loading competition. Fixed dimensions, alt text, error placeholder, and load refresh are retained. |
| `app/app.vue` | Batch refresh requests into one animation frame and cancel pending work on unmount. | Reduce duplicate synchronous refresh work without changing animation geometry or timing. |
| `app/app.vue` | Initialize motion only when the user allows it; listen for later preference changes. | Avoid importing/executing GSAP for reduced-motion visits while allowing motion to start if the preference changes. |
| `nuxt.config.ts` | Disable automatic prefetch only for manifest entries under `/gsap/`. | Make the conditional imports effective. Normal visits still request the chunks through `initializeMotion`; other resource hints are retained. |
| `public/images/ralph1-480.webp`, `ralph1-768.webp` | Add transparent 480px/768px color variants. | Preserve the light-theme portrait while serving an appropriate resolution. |
| `public/images/ralph2-480.webp`, `ralph2-768.webp` | Add transparent 480px/768px grayscale variants. | Preserve the dark-theme portrait while serving an appropriate resolution. |
| `public/images/gscan1-640.webp`, `gscan1-960.webp`, `gscan1.webp` | Add 640px/960px/1672px screenshot variants. | Preserve screenshot detail across screen sizes and pixel densities. |
| `README.md`, `docs/performance-review.md` | Link and document the review. | Keep causes, validation, limitations, and remaining suggestions reviewable. |

All new images were generated from the original PNGs using temporary Sharp tooling, WebP quality 90 and effort 6. Original PNGs and existing full-size portrait WebPs remain available. Both portrait elements are retained so theme switching keeps its existing crossfade without waiting for a new image.

| Asset | Bytes | Approximate KiB |
| --- | ---: | ---: |
| Original `gscan1.png` | 1,172,804 | 1,145 |
| `gscan1-640.webp` | 26,774 | 26 |
| `gscan1-960.webp` | 47,642 | 47 |
| `gscan1.webp` | 99,408 | 97 |
| `ralph1-480.webp` / `ralph2-480.webp` | 23,954 / 20,830 | 23 / 20 |
| `ralph1-768.webp` / `ralph2-768.webp` | 48,750 / 43,072 | 48 / 42 |

The full-resolution screenshot is approximately 91.5% smaller. The mobile Lighthouse run selected the 480px portrait; its image-delivery insight passed. The final desktop run retained an estimated 16 KiB image opportunity, down from 1,177 KiB.

## New measurements

These are **local Chrome Lighthouse 13.5.0 production-build results**, not new PageSpeed Insights scores for Vercel. The mobile CLI run used Lighthouse's default simulated mobile throttling; desktop used `--preset=desktop`. Server startup, CPU activity, network, compression, and hosting differ from the supplied report. The first local mobile baseline included approximately 702 ms observed server startup/response time; the final run used a warmed server. This is evidence of improvement, not a controlled estimate of the changes' isolated contribution or a guaranteed production score.

| Metric | Original local mobile | Final local mobile | Original local desktop | Final local desktop |
| --- | ---: | ---: | ---: | ---: |
| Performance | 63 | 87 | 93 | 99 |
| FCP | 2.11 s | 2.43 s | 0.50 s | 0.56 s |
| LCP | 9.89 s | 3.65 s | 1.77 s | 0.78 s |
| TBT | 365 ms | 6 ms | 19 ms | 0 ms |
| CLS | 0 | 0 | 0 | 0 |
| Speed Index | 3.80 s | 2.43 s | 0.95 s | 0.63 s |
| Accessibility | 100 | 100 | 100 | 100 |
| Best Practices | 96 | 96 | 96 | 96 |
| SEO | 100 | 100 | 100 | 100 |
| Agentic Browsing | 2/4 | 2/4 | 2/4 | 2/4 |

An intermediate image/motion build measured mobile 85 / LCP 3.78 s; a warmed repeat measured 88 / LCP 3.66 s. The final run after the prefetch correction measured 87 / LCP 3.65 s. Mobile 90+, LCP ≤2.5 s, and FCP ≤1.8 s are **not yet achieved locally**. Desktop showed no overall performance regression, although its FCP varied slightly. No assertion is made about post-deployment scores.

Best Practices is 96 locally because the Vercel-only `/_vercel/insights/script.js` endpoint returns HTML on the standalone local server, causing a syntax error. This occurred before and after the changes. The deployed baseline captured here scored 100 for Best Practices. Analytics remains enabled; production verification is required after deployment.

The final reflow diagnostic contained no attributed entries, and mobile long tasks fell from eight to three in these runs. This does not prove all forced layouts or long tasks have been eliminated. ScrollTrigger still needs layout measurements to maintain the existing effects.

Raw reports and browser artifacts are in the ignored `output/playwright/` directory: `before-mobile.json`, `before-desktop.json`, `deployed-mobile.json`, `after-mobile.json`, `after-mobile-repeat.json`, `after-desktop.json`, `final-mobile.json`, and `final-desktop.json`, plus screenshots and temporary verification scripts. They are local artifacts, not committed dependencies.

## Validation

- Original and final `npm run build`: passed. Existing toolchain warnings about build-plugin timing and Node package exports remain.
- `git diff --check`: passed. Git reports its existing LF-to-CRLF normalization notice for the config.
- `npm run` lists no lint or test scripts; no configured lint/test suite could be run.
- Browser layout comparison after the image changes: equal hero, heading, portrait, project stage, skill panel, and contact-form rectangles at 360, 412, 768, and 1440px. Final build checked at the same widths with no horizontal overflow. Dark and light desktop screenshots, mobile hero screenshots, and a settled project screenshot were visually inspected.
- Theme switching and portrait readiness: passed. Existing crossfade and theme reveal remain.
- Skill switching, clipboard copy, resume and certificate responses: passed.
- Contact success behavior: passed using an intercepted Formspree response; no real message was sent.
- Reduced-motion visit: no requests for either animation chunk. Switching to normal motion subsequently loaded both chunks and started the scroll effects.
- Lazy screenshot load on scrolling, screenshot error placeholder, failed-font fallback, and JavaScript-disabled hero/loader fallback: passed.

## Remaining suggestions — not implemented

1. **Recheck the deployment first.** Run mobile and desktop PageSpeed Insights on the deployed revision, capture the actual LCP breakdown, and repeat measurements under comparable conditions. Local results cannot certify the production targets or maintenance of every 100 score.
2. **Critical rendering and loader readiness.** Investigate whether the branded loader can finish asset readiness before hydration while preserving its appearance, fade, stable fallback fonts, and failure recovery. Consider measured critical-CSS delivery improvements. Neither the loader nor stylesheet was removed or broadly rewritten to chase a score.
3. **Unused JS and long tasks.** The framework and full motion libraries retain code unused during a short navigation-only audit. Measure a trace with scrolling, theme changes, and skill switching before removing dependencies or splitting interactive code further. Normal-motion visitors still require GSAP; the confirmed saving is avoiding its requests for reduced-motion visitors.
4. **Caching.** The deployed report's approximately 4 KiB opportunity is low impact; local static-cache headers differ from Vercel. Any longer caching for mutable image/font filenames should allow updates or use versioned filenames. No blanket immutable cache rule was added.
5. **Agent discovery.** Neither `llms.txt` nor `ai-catalog.json` exists in the source. Both deployed URLs currently return status 200 with `text/html` portfolio content, rather than Markdown/JSON. Lighthouse therefore reports a missing H1/link structure and malformed JSON. There is no intentional ARD capability support in this portfolio. A useful optional `llms.txt` could describe the existing content and link the projects/resume. An AI capability catalog should be added only if there are actual capabilities to advertise; creating fictional entries or an empty manifest solely to raise a score is unnecessary. These findings are separate from the passing SEO category.

### Motion review findings

| Before | After | Why |
| --- | --- | --- |
| `app/app.vue`: immediate refresh requests from several lifecycle events | Refresh requests coalesced in `refreshScroll()` | Limits duplicate layout refreshes while preserving the existing effects. |
| `app/app.vue` / generated HTML: conditional imports still accompanied by GSAP prefetch links | `nuxt.config.ts`: suppress those prefetch hints; import when motion is allowed | Prevents unnecessary downloads on reduced-motion visits. |
| `app/assets/css/main.css:811`: `screenshot-enter` animates drop-shadow filter values | Retained; compositor-only equivalent remains a suggestion | The animated shadow is part of the current appearance. Removing its filter interpolation would change the intended effect. |
| `app/assets/css/main.css:2196`: `startup-expire` switches visibility and pointer events after four seconds | Retained | This is an independent recovery mechanism if scripts fail, not a repeating layout animation. Removing it could leave the loader blocking the page. |

**Performance:** the two non-composited animation warnings remain understood and intentionally preserved. The performance-only motion review approves the loading/refresh changes within the requested visual constraints; it does not certify that every existing animation is compositor-only. Broader changes to motion duration, easing, theme reveal, or hover feedback are outside this preservation-focused review.

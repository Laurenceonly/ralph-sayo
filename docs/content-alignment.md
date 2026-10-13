# Portfolio, resume, and GitHub alignment

Reviewed 13 October 2026 against the supplied Ralph_Laurence_Sayo_Resume_New_Email.pdf and the public GitHub profile/repositories.

## Applied to the portfolio and README

| Area | Aligned content |
| --- | --- |
| Name | Ralph Laurence Sayo, matching the resume heading and GitHub profile README. |
| Positioning | Full-Stack Web & Mobile Developer; fourth-year BSIT student. |
| Contact | ralphlaurencesayo@gmail.com; github.com/Laurenceonly. |
| Education | Davao del Norte State College, Panabo City; expected June 2027. |
| Experience | Technical Staff, Cruisechef International Academy; September 2026–present, remote. Dashboard/reservation support, automated email workflows, account troubleshooting, social media, and application planning. |
| GraphiScan | 2025–2026 capstone, in development; lead programmer on a three-person team. Removed unsupported wording claiming model deployment from scratch. Added repository link. |
| Other projects | Odyssey is live and playable at https://odyssey-explorer-psi.vercel.app/; ISKOL remains in preview preparation. Both include descriptions, stacks, status, and repository links. |
| Skills | Added resume/GitHub omissions: Dart, Capacitor, Tailwind CSS, Three.js, GSAP, Vite, Supabase, VS Code, and Photoshop (GitHub creative-work section). |
| Resume | Added an unchanged copy of the supplied PDF and a download link. The source is preserved. |
| Hero intro | Shortened to "I'm Ralph Laurence Sayo, a BS Information Technology student." The developer title remains in the existing hero label. |
| Tab icon | Replaced the previous favicon with the rl. wordmark, its green accent dot, and a dark background for tab visibility. PNG and ICO assets are included. |

## Differences requiring clarification before rewriting the resume

1. **GraphiScan stack:** The resume names PyTorch, TensorFlow, and OpenCV. The current repository README lists TensorFlow/Keras, Python preprocessing, Flask, Vue/Vite, MySQL, and Capacitor configuration. The portfolio now lists the repository's documented implementation. PyTorch and OpenCV remain in general skills because the resume includes them. Confirm whether they are experiments or current application dependencies before changing the resume's project stack.
2. **Current implementation versus plans:** GraphiScan's PostgreSQL migration is planned and the public demo is pending. The academy's in-house trainee application is also in planning. Keep these statuses explicit.
3. **Name:** Earlier portfolio copy included a middle initial C.; the supplied resume heading and GitHub profile README omit it. This pass uses the supplied resume name throughout.
4. **Resume project breadth:** The supplied resume includes GraphiScan only. Odyssey and ISKOL are documented on GitHub and now included in the portfolio; add either to the resume according to the roles being targeted.

## Suggested next document updates

- Add the portfolio URL to the resume header beside GitHub.
- Add one compact Odyssey or ISKOL project entry to demonstrate work beyond the capstone.
- Use "GraphiScan — AI-Assisted Handwriting Screening and Management System" as public-facing wording, while retaining an official academic title where required.
- Separate technologies used in shipped/current projects from those explored in coursework or experiments.
- Describe the 200+ figure as reservations on record, not users served or reservations personally processed.
- Prefer "Led a three-person team" to the ambiguous "Led a team of 3" if the three includes Ralph.

## Operational follow-up

- The user updated the Formspree recipient to ralphlaurencesayo@gmail.com and confirmed delivery works. This dashboard setting is external to the Git commit.
- Local changes are ready for review; nothing was pushed to GitHub or deployed.
- The supplied PDF is unchanged. These recommendations are documented rather than presented as a revised resume.

## Sources

- Supplied resume copy: public/resume/Ralph_Laurence_Sayo_Resume.pdf
- Profile: https://github.com/Laurenceonly
- GraphiScan: https://github.com/Laurenceonly/Graphiscan
- Odyssey: https://github.com/Laurenceonly/Odyssey-Space-Exploration-Game
- ISKOL: https://github.com/Laurenceonly/Iskol

## Validation

- Vue single-file component parse, script compilation, and template compilation passed.
- Git diff whitespace checks passed.
- Published resume copy matches the supplied source byte for byte (SHA-256).
- The production build later passed during the startup improvement pass.
- Startup behavior was later checked with Playwright on desktop and mobile, including repeat visits, delayed assets, reduced motion, and font timeout fallback.

## Design correction

Replaced the added certificate-style boxes with project rows that reuse GraphiScan's typography, two-column structure, technology tokens, and repository buttons. Experience and education now have their own section, with the site's large section heading, open rows, and responsive spacing. Hero actions now wrap with consistent gaps. Vue compilation and live-preview response checks passed; visual browser inspection was unavailable during that content-only pass.

## Startup improvements

- Removed the hero entrance timeline to prevent already-rendered text and images being hidden again after hydration.
- Added a branded, indeterminate loading effect that waits for the active hero portrait to decode and the display font to load. It fades out in 180ms, with reduced-motion support.
- Readiness wait is capped at 2.4 seconds after initialization; a separate CSS fallback hides the loader after 4 seconds if startup JavaScript fails. With JavaScript disabled, the loader is hidden through a noscript rule.
- Space Grotesk is now a locally hosted, preloaded 22 KB variable WOFF2, with its SIL license included. If it misses the readiness deadline, a stable system fallback is retained for that visit to prevent a late font swap.
- Corrected portrait intrinsic dimensions to 2107 × 2458; added the GraphiScan screenshot dimensions, 1672 × 940. Existing visual frames are preserved.
- The production build passed. Desktop/mobile browser checks found no hero-hide cycle, no horizontal overflow, and a working slow-font fallback.

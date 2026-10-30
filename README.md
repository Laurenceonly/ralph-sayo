# Ralph Laurence Sayo — Developer Portfolio

Personal portfolio for Ralph Laurence Sayo, a fourth-year BS Information Technology student at Davao del Norte State College with expected graduation in June 2027. Full-Stack Web & Mobile Developer and Technical Staff at Cruisechef International Academy (September 2026–present, remote).

Live site: https://ralph-portfolio-tau.vercel.app/

## Content

- GraphiScan: an AI-assisted handwriting screening capstone in active development, led by Ralph as programmer on a three-person team. Screening outputs support expert review; they are not clinical diagnoses.
- Odyssey: Solar System Explorer: a playable browser-based 3D exploration game using JavaScript, Three.js, and Vite. [Play Odyssey](https://odyssey-explorer-psi.vercel.app/).
- Technical operations experience, education, skill explorer, and Cisco Networking Academy course certificates.
- Downloadable supplied resume and contact form.

## Development

Built with Nuxt 4, Vue 3, GSAP/ScrollTrigger, and custom CSS. Includes responsive layouts, a mobile hamburger menu, a 220 ms theme crossfade, and reduced-motion support. Project cards have concise summaries, repository/play links, and equal heights; mobile visitors can swipe between them or use the Previous/Next controls. The GitHub activity chart uses grayscale, starts at the latest months on narrow screens, and includes a failure fallback.

The hero renders immediately without an entrance sequence. A brief loader waits for the active portrait and locally hosted Space Grotesk and Bangers fonts, then fades out. Asset readiness has a 2.4-second deadline after initialization; an independent CSS fallback dismisses the overlay if scripts fail. Late fonts use a stable fallback for that visit. Font files and their SIL Open Font Licenses live in `public/fonts/`. Navigation and native contact-form submission remain available without JavaScript.

```bash
npm install
npm run dev
```

Production build and preview:

```bash
npm run build
npm run preview
```

Performance investigation, targeted optimizations, local Lighthouse measurements, and remaining suggestions: [performance review](docs/performance-review.md).

## Content maintenance

- Portfolio content and project links: `app/app.vue`.
- Site styles: `app/assets/css/main.css`.
- Certificate PDFs: `public/certificates/`.
- Supplied resume: `public/resume/Ralph_Laurence_Sayo_Resume.pdf`. Replace this file when the resume changes; the download URL stays stable.
- Alignment findings and suggested follow-up edits: [docs/content-alignment.md](docs/content-alignment.md).
- Review GraphiScan's status and technologies against its repository before claiming deployment or completed features.
- Contact-form delivery is configured separately in Formspree; changing the displayed email does not update its recipient.

## Contact

- Email: ralphlaurencesayo@gmail.com
- GitHub: [@Laurenceonly](https://github.com/Laurenceonly)

© 2026 Ralph Laurence Sayo. All rights reserved.

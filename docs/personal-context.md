# Personal context and portfolio direction

Notes from a conversation with Ralph, for use when working on this portfolio. These are context and preferences, not claims that must all appear on the site.

## Who Ralph is

- Ralph sees himself as an explorer: naturally curious, a fast learner, and interested in many different things.
- Outside development, he plays volleyball and basketball, has been a student athlete, plays drums and can play other instruments, and has participated in school organizations.
- He speaks English, Bisaya, and Tagalog. Use his own wording about proficiency rather than assuming a formal level.
- He sometimes feels insecure about his appearance despite compliments. Treat this sensitively; do not make it portfolio copy or assume he wants his appearance emphasized. Discuss portrait choices with care.

## Development goals

- Ralph wants to become a full-stack developer and go deep enough to master a stack, rather than remaining merely good at many things.
- He is currently trying to master the modern PERN stack: PostgreSQL, Express, React, and Node.js. This is a learning goal, not a claim of mastery.
- He asked not to focus on the PERN goal for now. Do not turn it into an immediate project or unsolicited site change.

## Portfolio direction

- Ralph identifies with both practical problem solving and creative experimentation, but especially with being an explorer.
- The portfolio should communicate a focused developer who is curious and keeps learning, while allowing glimpses of the person beyond code. His other interests need not all receive equal space.
- Keep descriptions grounded in what he has actually built and his real level of experience. Existing projects do not need to be presented as PERN projects: GraphiScan currently uses Vue and Flask, and its PostgreSQL migration was documented as planned.
- We discussed making project stories more distinctive by showing purpose, Ralph's contribution, interesting challenges, and lessons, rather than relying only on generic role labels and technology lists. A brief personal section is an idea, not an approved implementation.
- Preserve the existing visual identity unless Ralph asks for a redesign. Any proposed copy or design direction remains a brainstorm until he chooses it.

## Current portfolio work and next session

- Next priority: polish the mobile experience. Review the actual rendered site on phone-sized screens, including the hero, project carousel, toolkit, certificate cards, experience, GitHub chart, contact form, theme switch, spacing, touch targets, and horizontal overflow. Make improvements with Ralph's feedback; he prefers moving slowly and seeing changes as they are made.
- The current work is local and uncommitted as of this note. The development preview has been at `http://127.0.0.1:3000/`; restart it if needed. Do not assume these changes are deployed.
- The site uses a compact 900px maximum content width and a small, consistent type scale. Ralph wants visible section edges aligned and prefers fewer divider lines, limited boxes, centered headings, and an overall professional look with some personality and restrained color.
- The hero uses Ralph's original color portrait in both themes and matching daytime/nighttime Manhattan skyline images. The skyline fades on theme changes; the face should remain steady. The header and navigation were removed, and the theme toggle sits beside the hero actions. The old “Nah, I'd build” concept and experimental hero backgrounds are not currently displayed.
- GraphiScan and Odyssey are side-by-side on desktop and swipeable on mobile. The cards themselves do not open links; their explicit links do. ISKOL is not in the gallery. GraphiScan's landing page is `https://graphiscan.vercel.app/`.
- The toolkit shows colored technology icons in a grid, with subtle icon-only hover feedback; C++ was removed. Experiments with an interactive globe were reverted.
- The certificates use compact cards, blue Cisco logos, and blue buttons. Experience and education use larger organization logos on the left and no divider lines or tinted boxes. Ralph wanted that section revisited later.
- The generic “How I build” section was removed. GitHub activity is centered, borderless, and blue. Contact is titled “Let's connect,” with colored social icons.
- A portrait hydration mismatch in the local preview was fixed. At the end of this session, browser checks at 1280px and 390px found no horizontal overflow or broken image elements, and the theme toggle worked. The production build passed before the small portrait-source fix; the updated page was browser-checked afterward. The contact form was not submitted during that check.

Last updated: 30 October 2026.

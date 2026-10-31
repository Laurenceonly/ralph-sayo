<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
} from 'vue'

/* ========================================
  PAGE / THEME
======================================== */

const siteRoot = ref<HTMLElement | null>(null)
const colorMode = useColorMode()
const themeReady = ref(false)
const themeTransitioning = ref(false)
const startupLoading = ref(true)
const fontUnavailable = ref(false)
const headlineFontUnavailable = ref(false)
let startupTimer: ReturnType<typeof setTimeout> | undefined

const currentYear = new Date().getFullYear()
const email = 'ralphlaurencesayo@gmail.com'
const contributionChartFailed = ref(false)
const githubChartViewport = ref<HTMLElement | null>(null)
let githubChartResizeObserver: ResizeObserver | undefined

function showRecentGitHubActivity() {
  const viewport = githubChartViewport.value
  if (viewport) viewport.scrollLeft = Math.max(0, viewport.scrollWidth - viewport.clientWidth)
}
const mobileMenuOpen = ref(false)
const mobileMenuToggle = ref<HTMLButtonElement | null>(null)

function closeMobileMenu() {
  mobileMenuOpen.value = false
  mobileMenuToggle.value?.focus()
}

function dismissMobileMenu(event: PointerEvent) {
  if (mobileMenuOpen.value && event.target instanceof Element && !event.target.closest('.site-header')) {
    mobileMenuOpen.value = false
  }
}

function handleHeaderFocusOut(event: FocusEvent) {
  const header = event.currentTarget as HTMLElement
  if (mobileMenuOpen.value && !header.contains(event.relatedTarget as Node | null)) mobileMenuOpen.value = false
}

/* ========================================
  SEO / FONTS / PRECONNECTS
======================================== */

useHead({
  htmlAttrs: {
    lang: 'en',
  },
  title: 'Ralph Laurence Sayo - Full-Stack Web & Mobile Developer',
  meta: [
    {
      name: 'description',
      content:
        'Portfolio of Ralph Laurence Sayo, a full-stack and mobile developer showcasing GraphiScan, an AI-assisted dysgraphia-screening capstone.',
    },
    { name: 'theme-color', content: '#0e1012' },

    // Open Graph — controls the preview card when this link is
    // shared on LinkedIn, Facebook, Slack, Discord, etc.
    { property: 'og:type', content: 'website' },
    {
      property: 'og:title',
      content: 'Ralph Laurence Sayo - Full-Stack Web & Mobile Developer',
    },
    {
      property: 'og:description',
      content:
        'Full-stack and mobile developer showcasing GraphiScan, an AI-assisted dysgraphia-screening capstone.',
    },
    {
      property: 'og:url',
      content: 'https://ralph-portfolio-tau.vercel.app',
    },

    { name: 'twitter:card', content: 'summary' },
    {
      name: 'twitter:title',
      content: 'Ralph Laurence Sayo - Full-Stack Web & Mobile Developer',
    },
    {
      name: 'twitter:description',
      content:
        'Full-stack and mobile developer showcasing the GraphiScan capstone project.',
    },
  ],
  noscript: [{ innerHTML: `<style>
    .startup-loader, .mobile-menu-toggle, .theme-toggle, .project-gallery-controls { display: none !important; }
    .site-header { height: auto; min-height: 72px; padding-block: 8px; }
    .site-header .main-nav { position: static; display: flex; flex-direction: row; flex-wrap: wrap; gap: 8px 20px; padding: 0; border: 0; transform: none; visibility: visible; opacity: 1; pointer-events: auto; }
  </style>` }],
  link: [
    { rel: 'icon', href: 'data:,' },
    { rel: 'preload', href: '/fonts/bangers-regular.ttf', as: 'font', type: 'font/ttf', crossorigin: '' },
    { rel: 'preconnect', href: 'https://cdn.jsdelivr.net' },
    {
      rel: 'preload',
      href: '/fonts/space-grotesk-latin-variable.woff2',
      as: 'font',
      type: 'font/woff2',
      crossorigin: '',
    },
    {
      rel: 'canonical',
      href: 'https://ralph-portfolio-tau.vercel.app',
    },
  ],
})

const themeLabel = computed(() => {
  if (!themeReady.value) return 'Toggle color theme'

  return colorMode.value === 'dark'
    ? 'Switch to light theme'
    : 'Switch to dark theme'
})

async function toggleTheme() {
  if (themeTransitioning.value) return
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  await nextTick()
}

/* ========================================
  PROJECT DATA
======================================== */

const project = {
  id: 'graphiscan',
  title: 'GraphiScan',
  metadata: 'Capstone project',
  subtitle: 'Screening dysgraphia through handwriting analysis.',
  description:
    'Lead programmer for a three-person capstone team developing CNN-based handwriting screening, student records, and evaluator access across web and mobile interfaces.',
  note:
    'Presented as a screening research project, not a clinical diagnosis tool.',
  stack: ['Python', 'Flask', 'Vue', 'Capacitor', 'TensorFlow', 'Keras', 'MySQL'],
  repository: 'https://github.com/Laurenceonly/Graphiscan',
  image: '/images/gscan1.webp',
  imageAlt: 'GraphiScan application screenshot',
}

const additionalProjects = [
  {
    id: 'odyssey',
    title: 'Odyssey',
    preview: {
      src: '/images/odyssey.webp',
      srcset: '/images/odyssey-640.webp 640w, /images/odyssey-960.webp 960w, /images/odyssey.webp 1672w',
      alt: 'Odyssey space exploration game showing its main menu and solar system',
      width: 1672,
      height: 842,
    },
    metadata: 'Space exploration game',
    subtitle: 'A solar system to explore.',
    description: 'A playable browser-based space exploration game with guided discovery and interactive field guides.',
    stack: ['JavaScript', 'Three.js', 'Vite'],
    repository: 'https://github.com/Laurenceonly/Odyssey-Space-Exploration-Game',
    liveUrl: 'https://odyssey-explorer-psi.vercel.app/',
  },
]

const projects = [
  {
    ...project,
    liveUrl: 'https://graphiscan.vercel.app/',
    preview: {
      src: project.image,
      srcset: '/images/gscan1-640.webp 640w, /images/gscan1-960.webp 960w, /images/gscan1.webp 1672w',
      alt: project.imageAlt,
      width: 1672,
      height: 940,
    },
  },
  ...additionalProjects.map(item => ({ ...item, note: undefined })),
]

const projectGallery = ref<HTMLElement | null>(null)
const activeProject = ref(0)
function updateActiveProject() {
  const gallery = projectGallery.value
  const firstCard = gallery?.querySelector<HTMLElement>('.project-card')
  if (!gallery || !firstCard) return
  const step = firstCard.offsetWidth + parseFloat(getComputedStyle(gallery).columnGap || '0')
  activeProject.value = Math.max(0, Math.min(projects.length - 1, Math.round(gallery.scrollLeft / step)))
}

function browseProjects(direction: number, animate = true) {
  const gallery = projectGallery.value
  if (!gallery) return
  const nextIndex = Math.max(0, Math.min(projects.length - 1, activeProject.value + direction))
  if (window.matchMedia('(min-width: 900px)').matches) {
    activeProject.value = nextIndex
    return
  }
  const cards = gallery.querySelectorAll<HTMLElement>('.project-card')
  const target = cards[nextIndex]
  const first = cards[0]
  if (!target || !first) return
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  gallery.scrollTo({ left: target.offsetLeft - first.offsetLeft, behavior: animate && !reduceMotion ? 'smooth' : 'instant' })
  activeProject.value = nextIndex
}

const skillGroups = [
  {
    title: 'Web development',
    description: 'Interfaces, application logic, and databases.',
    skills: [
      'HTML',
      'CSS',
      'JavaScript',
      'TypeScript',
      'Bootstrap',
      'Tailwind CSS',
      'Three.js',
      'GSAP',
      'Vite',
      'Vue',
      'Nuxt',
      'React',
      'Next.js',
      'PHP',
      'Laravel',
      'Node.js',
      'MySQL',
      'PostgreSQL',
      'MongoDB',
      'Supabase',
    ],
  },
  {
    title: 'Mobile & AI',
    description: 'Mobile experiences and image-analysis experiments.',
    skills: [
      'Flutter',
      'React Native',
      'Capacitor',
      'Dart',
      'Firebase',
      'Python',
      'Flask',
      'PyTorch',
      'Keras',
      'OpenCV',
      'TensorFlow',
    ],
  },
  {
    title: 'Foundations & tools',
    description: 'The tools behind the development process.',
    skills: [
      'Java',
      'Git',
      'GitHub',
      'VS Code',
      'Docker',
      'Postman',
      'Figma',
      'Vercel',
      'Cisco Networking',
    ],
  },
]

const allSkills = [...new Set(skillGroups.flatMap(group => group.skills))]
const skillColors: Record<string, string> = {
  HTML: '#e34f26', CSS: '#1572b6', JavaScript: '#d6b800', TypeScript: '#3178c6',
  Bootstrap: '#7952b3', 'Tailwind CSS': '#06b6d4', 'Three.js': 'var(--text)', GSAP: '#88ce02',
  Vite: '#a66bff', Vue: '#42b883', Nuxt: '#00b97d', React: '#27a9c6', 'Next.js': 'var(--text)',
  PHP: '#8993be', Laravel: '#ff2d20', 'Node.js': '#5fa04e', MySQL: '#1685a9',
  PostgreSQL: '#487ca8', MongoDB: '#47a248', Supabase: '#3ecf8e', Flutter: '#42a5f5',
  'React Native': '#27a9c6', Capacitor: '#53b9ff', Dart: '#0175c2', Firebase: '#f5a800',
  Python: '#4b8bbe', Flask: 'var(--text)', PyTorch: '#ee4c2c', Keras: '#d00000',
  OpenCV: '#df5656', TensorFlow: '#ff8f00', Java: '#e07628',
  Git: '#f05032', GitHub: 'var(--text)', 'VS Code': '#168bd2', Docker: '#2496ed',
  Postman: '#ff6c37', Figma: '#a66bff', Vercel: 'var(--text)', 'Cisco Networking': '#049fd9',
}

/* ========================================
  CERTIFICATIONS
======================================== */

// pdfUrl points to the certificate PDF itself, served from your
// project's /public folder (e.g. put the files in
// public/certificates/ and reference them as /certificates/x.pdf).
const certifications = [
  {
    title: 'CCNA: Introduction to Networks',
    issuer: 'Davao del Norte State College · Cisco Networking Academy',
    date: 'May 2025',
    pdfUrl: '/certificates/ccna1.pdf',
  },
  {
    title: 'CCNA: Switching, Routing, and Wireless Essentials',
    issuer: 'Davao del Norte State College · Cisco Networking Academy',
    date: 'Dec 2025',
    pdfUrl: '/certificates/ccna2.pdf',
  },
]

/* ========================================
  TECH STACK ICONS
======================================== */

const techIconBase = 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons'

// Map each stack label to its Simple Icons slug.
// No public brand mark for a tool? Leave it out — it falls back to initials.
const techIconSlugs: Record<string, string> = {
  Python: 'python',
  Capacitor: 'capacitor',
  Dart: 'dart',
  'Tailwind CSS': 'tailwindcss',
  'Three.js': 'threedotjs',
  GSAP: 'gsap',
  Vite: 'vite',
  Supabase: 'supabase',
  Flask: 'flask',
  Vue: 'vuedotjs',
  Nuxt: 'nuxtdotjs',
  React: 'react',
  'React Native': 'react',
  'Next.js': 'nextdotjs',
  'Node.js': 'nodedotjs',
  TypeScript: 'typescript',
  PostgreSQL: 'postgresql',
  MongoDB: 'mongodb',
  Keras: 'keras',
  Docker: 'docker',
  Vercel: 'vercel',
  PyTorch: 'pytorch',
  OpenCV: 'opencv',
  TensorFlow: 'tensorflow',
  Flutter: 'flutter',
  Firebase: 'firebase',
  Laravel: 'laravel',
  PHP: 'php',
  MySQL: 'mysql',
  HTML: 'html5',
  CSS: 'css',
  JavaScript: 'javascript',
  Bootstrap: 'bootstrap',
  // Oracle doesn't license the Java coffee-cup mark for open reuse,
  // so this uses OpenJDK's Duke mark instead — the accepted open substitute.
  Java: 'openjdk',
  Git: 'git',
  GitHub: 'github',
  Postman: 'postman',
  Figma: 'figma',
  'Cisco Networking': 'cisco',
}

function techIconUrl(tech: string) {
  if (tech === 'VS Code') return 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-plain.svg'
  const slug = techIconSlugs[tech]
  return slug ? `${techIconBase}/${slug}.svg` : null
}

function techInitials(tech: string) {
  return tech.replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase()
}

const brandIcons: Record<string, string> = {
  HTML: 'html5', CSS: 'css3', JavaScript: 'javascript', TypeScript: 'typescript', Bootstrap: 'bootstrap',
  'Tailwind CSS': 'tailwindcss', Vite: 'vitejs', Vue: 'vuejs', Nuxt: 'nuxtjs', React: 'react',
  PHP: 'php', Laravel: 'laravel', 'Node.js': 'nodejs', MySQL: 'mysql', PostgreSQL: 'postgresql',
  MongoDB: 'mongodb', Supabase: 'supabase', Flutter: 'flutter', 'React Native': 'react', Dart: 'dart',
  Firebase: 'firebase', Python: 'python', PyTorch: 'pytorch', Keras: 'keras', OpenCV: 'opencv',
  TensorFlow: 'tensorflow', Java: 'java', Git: 'git', 'VS Code': 'vscode',
  Docker: 'docker', Postman: 'postman', Figma: 'figma',
}
const brokenBrandIcons = ref<Record<string, boolean>>({})
function brandIconUrl(tech: string) {
  const slug = brandIcons[tech]
  return slug && !brokenBrandIcons.value[tech] ? `https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/${slug}/${slug}-original.svg` : null
}

/* ========================================
  IMAGE FALLBACKS
======================================== */

const failedImages = ref<Record<string, boolean>>({})

function imageFailed(src: string) {
  failedImages.value[src] = true

  void nextTick(() => {
    refreshScroll()
  })
}

/* ========================================
  SOCIAL / CONTACT LINKS
======================================== */

const socialIconBase = 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons'

// Inline SVG data URLs let the email icon switch to a confirmation mark
// while using the same background-image treatment as the social icons.
const mailIconUrl = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3.75 5.25h16.5c.966 0 1.75.784 1.75 1.75v10a1.75 1.75 0 0 1-1.75 1.75H3.75A1.75 1.75 0 0 1 2 17V7c0-.966.784-1.75 1.75-1.75Zm.4 1.5L12 12.15l7.85-5.4H4.15ZM20.5 8.9l-7.98 5.49a.9.9 0 0 1-1.04 0L3.5 8.9V17c0 .138.112.25.25.25h16.5a.25.25 0 0 0 .25-.25V8.9Z"/></svg>',
)}`

const mailCopiedIconUrl = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9.55 17.15 4.4 12l1.5-1.5 3.65 3.65L18.1 5.6l1.5 1.5z"/></svg>',
)}`

type SocialLink = {
  name: string
  icon: string | null
  href?: string
  external?: boolean
  type?: 'copy'
}

const socialLinks: SocialLink[] = [
  {
    name: 'GitHub',
    href: 'https://github.com/Laurenceonly',
    external: true,
    icon: `${socialIconBase}/github.svg`,
  },
  {
    name: 'Email',
    // Copies the address instead of opening mailto:, which gets scraped by bots.
    // See copyEmail() below — rendered as a hand-drawn envelope/checkmark.
    type: 'copy',
    icon: null,
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/ralphsayo26/',
    external: true,
    icon: `${socialIconBase}/facebook.svg`,
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/saintlaurenz26/',
    external: true,
    icon: `${socialIconBase}/instagram.svg`,
  },
]

const emailCopied = ref(false)
const emailCopyMessage = ref('')
let emailCopyTimer: ReturnType<typeof setTimeout> | undefined

async function copyEmail() {
  clearTimeout(emailCopyTimer)
  emailCopied.value = false
  emailCopyMessage.value = ''
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(email)
    } else {
      // Fallback for browsers/contexts without the async Clipboard API.
      const temp = document.createElement('textarea')
      temp.value = email
      temp.style.position = 'fixed'
      temp.style.opacity = '0'
      document.body.appendChild(temp)
      const previousFocus = document.activeElement as HTMLElement | null
      try {
        temp.focus()
        temp.select()
        if (!document.execCommand('copy')) throw new Error('Clipboard copy was unavailable')
      } finally {
        temp.remove()
        previousFocus?.focus({ preventScroll: true })
      }
    }

    emailCopied.value = true
    emailCopyMessage.value = 'Copied to clipboard'
    emailCopyTimer = setTimeout(() => {
      emailCopied.value = false
      emailCopyMessage.value = ''
    }, 2200)
  } catch (error) {
    emailCopyMessage.value = `Copy manually: ${email}`
    console.warn('Could not copy email to clipboard.', error)
  }
}

/* ========================================
  CONTACT FORM — FORMSPREE
======================================== */

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xnpqwgor'

const contactForm = reactive({
  name: '',
  email: '',
  message: '',
})

type FormStatus = 'idle' | 'sending' | 'success' | 'error'

const formStatus = ref<FormStatus>('idle')
const formErrorMessage = ref('')

async function submitContactForm() {
  if (formStatus.value === 'sending') return

  formStatus.value = 'sending'
  formErrorMessage.value = ''

  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        name: contactForm.name,
        email: contactForm.email,
        message: contactForm.message,
      }),
    })

    if (response.ok) {
      formStatus.value = 'success'
      contactForm.name = ''
      contactForm.email = ''
      contactForm.message = ''
      return
    }

    const data = await response.json().catch(() => null)

    formErrorMessage.value =
      data?.errors?.[0]?.message ??
      'Something went wrong sending that — try again, or email me directly.'
    formStatus.value = 'error'
  } catch (error) {
    console.warn('Contact form submission failed.', error)
    formErrorMessage.value =
      'Could not reach the server — check your connection and try again.'
    formStatus.value = 'error'
  }
}

/* ========================================
  ANIMATION LIFECYCLE
======================================== */

let cleanupMotion: (() => void) | undefined
let refreshMotion: (() => void) | undefined
let refreshFrame: number | undefined
let motionPreference: MediaQueryList | undefined
let motionStarted = false
let disposed = false

function refreshScroll() {
  if (!refreshMotion || refreshFrame !== undefined) return
  refreshFrame = requestAnimationFrame(() => {
    refreshFrame = undefined
    if (!disposed) refreshMotion?.()
  })
}

async function prepareStartup() {
  try {
    await nextTick()

    const portrait = siteRoot.value?.querySelector<HTMLImageElement>(
      '.hero-portrait',
    )

    // Wait only for the first screen; lower sections never delay entry.
    const assets: Promise<unknown>[] = []
    if (document.fonts) {
      assets.push(document.fonts.load('500 1em "Space Grotesk"'))
      assets.push(document.fonts.load('400 1em "Bangers"'))
    }
    if (portrait) assets.push(portrait.decode())

    await Promise.race([
      Promise.allSettled(assets),
      new Promise<void>((resolve) => {
        startupTimer = setTimeout(resolve, 2400)
      }),
    ])
  } finally {
    clearTimeout(startupTimer)
    if (!disposed) {
      // If the font misses the deadline, keep the fallback for this visit.
      // A late font response must not shift text after the loader has gone.
      fontUnavailable.value = !document.fonts?.check('500 1em "Space Grotesk"')
      headlineFontUnavailable.value = !document.fonts?.check('400 1em "Bangers"')
      await nextTick()
      if (!disposed) startupLoading.value = false
    }
  }
}

function startMotionWhenEnabled() {
  if (motionPreference?.matches) void initializeMotion()
}

onMounted(() => {
  themeReady.value = true
  // An SSR image can fail before hydration attaches its error listener.
  for (const item of projects) {
    if (!item.preview) continue
    const image = siteRoot.value?.querySelector<HTMLImageElement>(`#${item.id} .project-card-preview img`)
    if (image?.complete && image.naturalWidth === 0) imageFailed(item.preview.src)
  }
  const contributionImage = siteRoot.value?.querySelector<HTMLImageElement>('.github-chart')
  if (contributionImage?.complete && contributionImage.naturalWidth === 0) contributionChartFailed.value = true
  if (githubChartViewport.value && !contributionChartFailed.value) {
    githubChartResizeObserver = new ResizeObserver(showRecentGitHubActivity)
    githubChartResizeObserver.observe(githubChartViewport.value)
    showRecentGitHubActivity()
  }
  void prepareStartup().catch(() => {
    if (!disposed) startupLoading.value = false
  })


  motionPreference = window.matchMedia('(prefers-reduced-motion: no-preference)')
  motionPreference.addEventListener('change', startMotionWhenEnabled)
  startMotionWhenEnabled()
})

async function initializeMotion() {
  if (motionStarted || disposed) return
  motionStarted = true

  try {
    const [{ gsap }, { ScrollTrigger }] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ])

    if (disposed || !siteRoot.value) return

    gsap.registerPlugin(ScrollTrigger)

    const root = siteRoot.value
    const media = gsap.matchMedia()

    const select = (selector: string) =>
      Array.from(root.querySelectorAll<HTMLElement>(selector))

    refreshMotion = () => ScrollTrigger.refresh()

    cleanupMotion = () => {
      media.revert()
      refreshMotion = undefined
    }

    media.add('(prefers-reduced-motion: no-preference)', () => {
      // The hero is visible in the server-rendered page and stays visible.
      select('[data-reveal]').forEach((element) => {
        gsap.from(element, {
          y: 32,
          opacity: 0,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 92%',
            once: true,
          },
        })
      })
    })

    refreshScroll()

    void document.fonts.ready.then(() => {
      if (!disposed) refreshScroll()
    })
  } catch (error) {
    cleanupMotion?.()

    console.warn('Portfolio animations could not be initialized.', error)
  }
}

onBeforeUnmount(() => {
  disposed = true
  githubChartResizeObserver?.disconnect()
  if (refreshFrame !== undefined) cancelAnimationFrame(refreshFrame)
  motionPreference?.removeEventListener('change', startMotionWhenEnabled)
  clearTimeout(startupTimer)
  clearTimeout(emailCopyTimer)
  cleanupMotion?.()
})
</script>

<template>
  <div ref="siteRoot" class="site-shell" :class="{ 'font-fallback': fontUnavailable, 'headline-font-fallback': headlineFontUnavailable }" @pointerdown="dismissMobileMenu">
    <Transition name="startup" type="transition">
      <div v-if="startupLoading" class="startup-loader" role="status" aria-live="polite">
        <span class="startup-track" aria-hidden="true"></span>
        <span class="startup-label">Loading portfolio</span>
      </div>
    </Transition>

    <a class="skip-link" href="#main">
      Skip to content
    </a>

    <!-- ==================================
        HEADER
    =================================== -->



    <main id="main" tabindex="-1">
      <!-- ==================================
          HERO
      =================================== -->

      <section
        id="home"
        class="hero page-width"
        aria-label="Introduction"
      >

        <!--
          The same color portrait stays visible across both themes.

          Purely decorative; the introduction below identifies Ralph,
          so the portrait is aria-hidden with empty alt text.
        -->
        <div class="hero-visual">
        <div class="hero-portrait-wrap" aria-hidden="true">
          <img
            class="hero-portrait"
            :src="'/images/ralph1.webp'"
            :srcset="'/images/ralph1-480.webp 480w, /images/ralph1-768.webp 768w, /images/ralph1.webp 1000w'"
            sizes="(max-width: 400px) min(62vw, 240px), (max-width: 720px) min(56vw, 300px), (max-width: 1000px) 32vw, min(34vw, 440px)"
            alt=""
            width="1000"
            height="1167"
            loading="eager"
            fetchpriority="high"
            decoding="async"
          />
        </div>

        </div>
        <div class="hero-bottom">
          <div class="hero-intro">
            <h1 class="hero-name">Ralph Laurence Sayo</h1>
            <p class="hero-role">Full-Stack Web &amp; Mobile Developer</p>
            <p>
              BS Information Technology student at Davao del Norte State College.
            </p>

            <div class="hero-actions">
            <a class="text-link" href="#work">
              Explore my work
            </a>
            <a class="text-link" href="/resume/Ralph_Laurence_Sayo_Resume.pdf" download>
              Download resume
            </a>
<button
        class="theme-toggle"
        type="button"
        role="switch"
        :aria-checked="colorMode.value === 'dark'"
        :aria-label="themeLabel"
        :title="themeLabel"
        :disabled="themeTransitioning"
        @click="toggleTheme"
      >
        <span class="theme-toggle-thumb">
          <svg
            class="sun-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="4" />

            <path
              d="M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"
            />
          </svg>

          <svg
            class="moon-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path
              d="M20.9 13.1A9 9 0 0 1 10.9 3a9 9 0 1 0 10 10.1Z"
            />
          </svg>
        </span>
      </button>
            </div>
          </div>
        </div>
      </section>

      <!-- ==================================
          FEATURED PROJECT
      =================================== -->

      <section
        id="work"
        class="work-section page-width"
        aria-labelledby="work-title"
      >
        <div class="section-heading" data-reveal>
          <div class="section-heading-bottom">
            <h2 id="work-title">
              Selected projects.
            </h2>

            <p>
              Work spanning handwriting screening and interactive 3D exploration.
            </p>
          </div>
        </div>

        <div
          id="project-gallery"
          ref="projectGallery"
          class="project-grid"
          tabindex="0"
          role="region"
          aria-label="Project gallery"
          @scroll.passive="updateActiveProject"
          @keydown.left.self.prevent="browseProjects(-1, false)"
          @keydown.right.self.prevent="browseProjects(1, false)"
        >
          <article
            v-for="item in projects"
            :id="item.id"
            :key="item.id"
            class="project-card"
            :aria-labelledby="item.id + '-title'"
          >
            <div class="project-card-preview">
              <img
                v-if="item.preview && !failedImages[item.preview.src]"
                :src="item.preview.src"
                :srcset="item.preview.srcset"
                sizes="(max-width: 899px) min(400px, calc(100vw - 88px)), min(440px, calc((100vw - 142px) / 2))"
                :alt="item.preview.alt"
                :width="item.preview.width"
                :height="item.preview.height"
                loading="lazy"
                decoding="async"
                @load="refreshScroll"
                @error="imageFailed(item.preview.src)"
              />
              <div v-else class="project-card-placeholder">
                <span class="project-placeholder-name">{{ item.title }}</span>
                <span>{{ item.preview ? 'Screenshot unavailable' : 'Preview in preparation' }}</span>
              </div>
            </div>
            <div class="project-card-body">
              <p class="project-card-meta">{{ item.metadata }}</p>
              <h3 :id="item.id + '-title'">
                {{ item.title }}
              </h3>
              <p class="project-card-subtitle">{{ item.subtitle }}</p>
              <div class="project-card-links">
                <a v-if="item.liveUrl" :href="item.liveUrl" target="_blank" rel="noopener noreferrer" :aria-label="item.id === 'odyssey' ? 'Play ' + item.title : 'Visit ' + item.title">
                  {{ item.id === 'odyssey' ? 'Play' : 'Visit site' }}
                </a>
                <a :href="item.repository" target="_blank" rel="noopener noreferrer" :aria-label="'View GitHub source for ' + item.title">
                  View GitHub
                </a>
              </div>
            </div>
          </article>
        </div>
        <div class="project-gallery-controls">
          <span class="sr-only" role="status" aria-live="polite" aria-atomic="true">{{ projects[activeProject]?.title }}</span>
          <div class="project-gallery-buttons">
            <button type="button" aria-controls="project-gallery" :disabled="activeProject === 0" @click="browseProjects(-1)">Previous</button>
            <button type="button" aria-controls="project-gallery" :disabled="activeProject === projects.length - 1" @click="browseProjects(1)">Next</button>
          </div>
        </div>

      </section>

      <!-- ==================================
          SKILLS & CERTIFICATIONS
      =================================== -->

      <section
        id="skills"
        class="skills-section page-width"
        aria-labelledby="skills-title"
      >
        <div class="section-heading" data-reveal>
          <div class="section-heading-bottom">
            <h2 id="skills-title">Skills &amp; certifications.</h2>
            <p>Core toolkit across web, mobile, and AI — backed by certifications along the way.</p>
          </div>
        </div>

        <ul class="toolkit-grid" aria-label="Technologies and tools" data-reveal>
          <li v-for="skill in allSkills" :key="skill" class="toolkit-item" :class="{ 'toolkit-monochrome': ['GitHub', 'Vercel', 'Next.js', 'Three.js', 'Flask'].includes(skill) }">
            <div class="toolkit-button">
              <img v-if="brandIconUrl(skill)" class="toolkit-brand" :src="brandIconUrl(skill)!" alt="" loading="lazy" @error="brokenBrandIcons[skill] = true" />
              <span v-else-if="techIconUrl(skill)" class="token-icon toolkit-icon" :style="{ '--tech-icon': `url('${techIconUrl(skill)}')`, '--skill-color': skillColors[skill] || 'var(--text)' }" aria-hidden="true" />
              <span v-else class="toolkit-icon toolkit-initial" aria-hidden="true">{{ techInitials(skill) }}</span>
              <span>{{ skill }}</span>
            </div>
          </li>
        </ul>
        <!-- Certifications -->

        <div class="credentials" data-reveal>
          <p class="eyebrow muted">
            CERTIFICATIONS
          </p>

          <ul class="credential-list">
            <li
              v-for="cert in certifications"
              :key="cert.title"
              class="credential-item"
            >
              <span
                class="token-icon credential-icon"
                :style="{ '--tech-icon': `url('${techIconUrl('Cisco Networking')}')` }"
                aria-hidden="true"
              />

              <div class="credential-text">
                <p class="credential-title">
                  {{ cert.title }}
                </p>

                <p class="credential-meta mono muted">
                  {{ cert.issuer }} · {{ cert.date }}
                </p>
              </div>

              <div class="credential-actions">
                <a
                  v-if="cert.pdfUrl"
                  class="view-certificate-btn"
                  :href="cert.pdfUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  :aria-label="`View certificate PDF: ${cert.title}`"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M14 2v6h6" />
                  </svg>

                  View certificate
                </a>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <!-- Experience & education -->

      <section
        id="experience"
        class="experience-section page-width"
        aria-labelledby="experience-title"
      >
        <div class="section-heading" data-reveal>
          <div class="section-heading-bottom">
            <h2 id="experience-title">
              Experience &amp; education.
            </h2>
            <p>Technical operations experience alongside my Information Technology degree.</p>
          </div>
        </div>

        <article class="background-row" aria-labelledby="role-title" data-reveal>
          <div class="background-meta mono muted">
            <img class="background-logo" src="/images/cruisechef-logo.png" alt="" width="64" height="64" loading="lazy" />
            <p>September 2026–Present</p>
            <p>Remote</p>
          </div>
          <div class="background-content">
            <h3 id="role-title">Technical Staff</h3>
            <p class="background-subtitle">Cruisechef International Academy</p>
            <div class="background-description">
              <p>Support the academy's admin dashboard, reservations, automated email workflows, and account troubleshooting for staff and trainees, with 200+ reservations on record.</p>
              <p>Maintain social media channels and the content calendar, and contribute to planning an in-house trainee account management application.</p>
            </div>
          </div>
        </article>

        <article class="background-row" aria-labelledby="education-title" data-reveal>
          <div class="background-meta mono muted">
            <img class="background-logo" src="/images/dnsc-seal.jpg" alt="" width="64" height="64" loading="lazy" />
            <p>Expected June 2027</p>
            <p>Fourth year</p>
          </div>
          <div class="background-content">
            <h3 id="education-title">BS Information Technology</h3>
            <p class="background-subtitle">Davao del Norte State College</p>
            <p class="background-description">Panabo City, Philippines</p>
          </div>
        </article>
      </section>

      <!-- ==================================
          CONTACT
      =================================== -->

      <section class="github-section page-width" aria-labelledby="github-title">
        <div class="github-panel">
          <div class="github-panel-heading">
            <div>
              <h2 id="github-title">GitHub activity</h2>
              <p class="github-description">A snapshot of my public contributions over the past year.</p>
            </div>
          </div>
          <div v-if="!contributionChartFailed" ref="githubChartViewport" class="github-chart-wrap" tabindex="0" role="region" aria-label="GitHub contributions, latest months first; scroll horizontally to view the full year">
            <img class="github-chart" src="https://ghchart.rshah.org/0878a8/Laurenceonly" alt="GitHub contribution activity for Laurenceonly over the past year" width="663" height="104" loading="lazy" @load="showRecentGitHubActivity" @error="contributionChartFailed = true" />
          </div>
          <p v-else class="github-chart-fallback">The contribution chart is unavailable right now. Visit my GitHub profile to see my activity.</p>
          <a class="github-profile-link" href="https://github.com/Laurenceonly" target="_blank" rel="noopener noreferrer">View GitHub profile</a>
        </div>
      </section>

      <section
        id="contact"
        class="contact-section page-width"
        aria-labelledby="contact-title"
      >
        <div data-reveal>
          <h2 id="contact-title">
            Let's connect.
          </h2>

          <div class="contact-columns">
            <form
              class="contact-form"
              :action="FORMSPREE_ENDPOINT"
              method="post"
              @submit.prevent="submitContactForm"
            >
              <p class="mono muted contact-form-label">
                Send a message
              </p>

              <div class="form-field">
                <label class="form-label mono" for="contact-name">
                  Name
                </label>

                <input
                  id="contact-name"
                  v-model="contactForm.name"
                  class="form-input"
                  type="text"
                  name="name"
                  autocomplete="name"
                  required
                />
              </div>

              <div class="form-field">
                <label class="form-label mono" for="contact-email">
                  Email
                </label>

                <input
                  id="contact-email"
                  v-model="contactForm.email"
                  class="form-input"
                  type="email"
                  name="email"
                  autocomplete="email"
                  required
                />
              </div>

              <div class="form-field">
                <label class="form-label mono" for="contact-message">
                  Message
                </label>

                <textarea
                  id="contact-message"
                  v-model="contactForm.message"
                  class="form-input form-textarea"
                  name="message"
                  rows="4"
                  required
                ></textarea>
              </div>

              <div class="form-actions">
                <button
                  type="submit"
                  class="form-submit"
                  :disabled="formStatus === 'sending'"
                >
                  {{ formStatus === 'sending' ? 'Sending…' : 'Send message' }}
                </button>

                <p
                  v-if="formStatus === 'success'"
                  class="form-status is-success"
                  role="status"
                >
                  Message sent — I'll get back to you soon.
                </p>

                <p
                  v-else-if="formStatus === 'error'"
                  class="form-status is-error"
                  role="alert"
                >
                  {{ formErrorMessage }}
                </p>
              </div>
            </form>

            <div class="contact-bottom">
              <div class="social-links-group">
                <p class="mono muted social-links-label">
                  Social links
                </p>

                <div class="social-links-row">
                  <template v-for="link in socialLinks" :key="link.name">
                    <button
                      v-if="link.type === 'copy'"
                      type="button"
                      class="social-link"
                      :class="{ 'is-confirmed': emailCopied }"
                      :aria-label="emailCopied ? `${email} copied to clipboard` : `Copy email address: ${email}`"
                      @click="copyEmail"
                    >
                      <span
                        class="social-link-icon"
                        :style="{ '--tech-icon': `url('${emailCopied ? mailCopiedIconUrl : mailIconUrl}')`, '--social-color': '#0878a8' }"
                        aria-hidden="true"
                      />
                    </button>

                    <a
                      v-else
                      class="social-link"
                      :href="link.href"
                      :target="link.external ? '_blank' : undefined"
                      :rel="link.external ? 'noopener noreferrer' : undefined"
                      :aria-label="link.name"
                    >
                      <span
                        v-if="link.icon"
                        class="social-link-icon"
                        :style="{ '--tech-icon': `url('${link.icon}')`, '--social-color': link.name === 'Facebook' ? '#1877f2' : link.name === 'Instagram' ? 'linear-gradient(35deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5)' : 'var(--text)' }"
                      />
                    </a>
                  </template>
                </div>

                <p
                  class="copy-feedback mono"
                  :class="{ 'is-visible': emailCopyMessage }"
                  role="status"
                  aria-live="polite"
                >
                  {{ emailCopyMessage }}
                </p>
              </div>

              <p>
                For development projects, collaborations, or a conversation
                about building something together, feel free to reach out.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- ==================================
        FOOTER
    =================================== -->

    <footer class="site-footer page-width">
      <span>
        © {{ currentYear }} Ralph Laurence Sayo
      </span>

      <div class="footer-links">
        <a href="#home">
          Back to top
          <span aria-hidden="true">&nbsp;↑</span>
        </a>
      </div>
    </footer>
  </div>
</template>

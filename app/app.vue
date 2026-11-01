<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
} from 'vue'

/* ========================================
  PAGE / THEME
======================================== */

const PortfolioDetails = defineLazyHydrationComponent('visible', () => import('./components/PortfolioDetails.vue'))

const siteRoot = ref<HTMLElement | null>(null)
const colorMode = useColorMode()
const themeReady = ref(false)
const themeTransitioning = ref(false)

const currentYear = new Date().getFullYear()
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
    .mobile-menu-toggle, .theme-toggle, .project-gallery-controls { display: none !important; }
    .site-header { height: auto; min-height: 72px; padding-block: 8px; }
    .site-header .main-nav { position: static; display: flex; flex-direction: row; flex-wrap: wrap; gap: 8px 20px; padding: 0; border: 0; transform: none; visibility: visible; opacity: 1; pointer-events: auto; }
  </style>` }],
  link: [
    { rel: 'icon', href: 'data:,' },
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

// Discover the first-screen artwork before CSS finishes loading.
useHead(() => ({
  link: [
    {
      rel: 'preload',
      as: 'image',
      href: '/images/ralph1.webp',
      imagesrcset: '/images/ralph1-480.webp 480w, /images/ralph1-768.webp 768w, /images/ralph1.webp 1000w',
      imagesizes: '(max-width: 400px) min(62vw, 240px), (max-width: 720px) min(56vw, 300px), (max-width: 1000px) 32vw, min(34vw, 440px)',
      fetchpriority: 'high',
    },
    ...(['light', 'dark'] as const)
      .filter(theme => colorMode.unknown || colorMode.value === theme)
      .flatMap(theme => [768, 1280].map(width => ({
        key: `hero-scene-${theme}-${width}`,
        rel: 'preload' as const,
        as: 'image' as const,
        href: `/images/hero-${theme === 'light' ? 'day' : 'night'}-${width}.webp`,
        media: `${width === 768 ? '(max-width: 720px)' : '(min-width: 721px)'}${colorMode.unknown ? ` and (prefers-color-scheme: ${theme})` : ''}`,
        fetchpriority: 'high' as const,
      }))),
  ],
}))

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

/* ========================================
  IMAGE FALLBACKS
======================================== */

const failedImages = ref<Record<string, boolean>>({})

function imageFailed(src: string) {
  failedImages.value[src] = true
}

/* ========================================
  ANIMATION LIFECYCLE
======================================== */

let cleanupMotion: (() => void) | undefined
let motionPreference: MediaQueryList | undefined
let motionStarted = false
let disposed = false

function startMotionWhenEnabled() {
  if (motionPreference?.matches) initializeMotion()
  else {
    cleanupMotion?.()
    motionStarted = false
  }
}

onMounted(() => {
  themeReady.value = true
  // An SSR image can fail before hydration attaches its error listener.
  for (const item of projects) {
    if (!item.preview) continue
    const image = siteRoot.value?.querySelector<HTMLImageElement>(`#${item.id} .project-card-preview img`)
    if (image?.complete && image.naturalWidth === 0) imageFailed(item.preview.src)
  }
  motionPreference = window.matchMedia('(prefers-reduced-motion: no-preference)')
  motionPreference.addEventListener('change', startMotionWhenEnabled)
  startMotionWhenEnabled()
})

function initializeMotion() {
  if (motionStarted || disposed || !siteRoot.value) return
  motionStarted = true

  // These one-time reveals need no animation-library download or scroll handler.
  // Observe the real layout so font/image loading needs no manual refresh.
  const animations = new Set<Animation>()
  const waiting = new WeakSet<Element>()
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) {
        waiting.add(entry.target)
        continue
      }
      observer.unobserve(entry.target)
      // Keep initially visible content stable without forcing layout on mount.
      if (!waiting.has(entry.target)) continue
      const animation = entry.target.animate([
        { transform: 'translateY(32px)', opacity: 0 },
        { transform: 'translateY(0)', opacity: 1 },
      ], { duration: 850, easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)' })
      animations.add(animation)
      animation.onfinish = () => animations.delete(animation)
    }
  }, { rootMargin: '0px 0px -8% 0px' })

  siteRoot.value.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) => {
    observer.observe(element)
  })
  cleanupMotion = () => {
    observer.disconnect()
    animations.forEach(animation => animation.cancel())
    animations.clear()
  }
}

onBeforeUnmount(() => {
  disposed = true
  motionPreference?.removeEventListener('change', startMotionWhenEnabled)
  cleanupMotion?.()
})
</script>

<template>
  <div ref="siteRoot" class="site-shell" @pointerdown="dismissMobileMenu">

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
            decoding="sync"
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
                loading="eager"
                fetchpriority="low"
                decoding="async"
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
                <a v-if="item.liveUrl" :href="item.liveUrl" target="_blank" rel="noopener noreferrer" :aria-label="item.id === 'odyssey' ? 'Play ' + item.title : 'Visit site: ' + item.title">
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

      <PortfolioDetails :hydrate-on-visible="{ rootMargin: '200px' }" />
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

/** @type {import('tailwindcss').Config} */
// Design tokens from CLONE_SPEC.md §0 / §1. Breakpoint: `md` (768) = desktop layout; below = mobile.
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '1024px',
      xl: '1200px',
      // The original's second desktop breakpoint: many blocks keep their tablet/stacked layout until 1280
      // (Faq, product Hero, Quote, Stats, QuotesCarousel, TextWithLogos, MicroFeatureCarousel, footer...).
      wide: '1280px',
    },
    extend: {
      colors: {
        headline: '#131b24',
        ink: {
          DEFAULT: '#242633', // text-primary
          secondary: '#666c80',
          disabled: '#7a8499',
        },
        cobalt: {
          DEFAULT: '#265cff',
          5: '#f5f8ff',
          10: '#e3ebff',
          20: '#c1d2fe',
          30: '#93aeff',
          40: '#658dfd',
          60: '#4a6fff',
          70: '#1246e0',
          100: '#032ca5',
          step: '#657eff', // step index colour (§1)
        },
        midnight: '#0b2471',
        navy: '#0b1d45',
        night: '#041330', // core-gray-100 / promo-dark
        gray: {
          10: '#f5f7fa',
          20: '#e5e9f0',
          30: '#d1d8e5',
        },
        line: {
          DEFAULT: '#c0d0f0', // border-default
          light: '#e6ebf5',
          soft: '#dae3ff',
        },
        bg: {
          light: '#f5f7fa',
          xlight: '#fbfcfd',
        },
        tangerine: '#ff9966',
        poppy: '#ff6633',
        teal: '#1b7a5a',
        forest: '#1d7368',
        'slate-block': '#232c40',
        mission: '#12131a',
        promo: {
          text: '#f5f7fa',
          muted: '#bec7da',
          badge: '#ffafd2',
        },
        footer: {
          panel: '#0f172a', // slate-900
          link: '#cbd5e1', // slate-300
          muted: '#94a3b8', // slate-400
          title: '#f8fafc', // slate-50
          sky: '#7dd3fc', // sky-300
        },
        tag: {
          'new-fg': '#1d7368',
          'new-bg': '#d7f7f4',
          'explore-fg': '#032ca5',
          'explore-bg': '#c1d2fe',
        },
      },
      fontFamily: {
        sans: ['Inter', '"Inter Fallback"', 'Arial', 'sans-serif'],
        serif: ['Newsreader', '"Newsreader Fallback"', 'Georgia', 'serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        '2xs': '10px',
        xs: '12px',
        sm: '14px',
        md: '16px',
        lg: '18px',
        xl: '21px',
        '2xl': '24px',
        '3xl': '28px',
        '4xl': '32px',
        '5xl': '36px',
        '6xl': '42px',
        '7xl': '48px',
        '8xl': '64px',
        '9xl': '72px',
        '10xl': '96px',
        '11xl': '128px',
        '12xl': '160px',
      },
      letterSpacing: {
        display: '-0.04em',
        headline: '-0.03em',
        normal: '-0.01em',
        mono: '0',
        'mono-caps': '0.12em',
      },
      spacing: {
        '2xs': '12px',
        xs: '16px',
        sm: '32px',
        md: '48px',
        lg: '80px',
        xl: '128px',
        '2xl': '208px',
        'section-tight': '64px',
        section: '96px',
        'section-open': '128px',
      },
      maxWidth: {
        container: '1200px',
      },
      borderRadius: {
        btn: '2px',
        card: '5px',
        panel: '8px',
        glass: '10px',
        chip: '24px',
      },
      boxShadow: {
        dropdown:
          '0 32px 32px 1px rgba(4,19,48,.16), 0 16px 16px 1px rgba(4,19,48,.10), 0 8px 8px 1px rgba(4,19,48,.08), 0 4px 4px 1px rgba(4,19,48,.04)',
        badge: '0 12px 24px rgba(12,13,17,.15)',
        glass:
          'inset 0 1px 0 rgba(255,255,255,.12), inset 1px 0 0 rgba(255,255,255,.10), 0 0 0 1px rgba(255,255,255,.06)',
        focus: '0 0 0 2px #fff, 0 0 0 3px #265cff, 0 0 0 5px #e3ebff',
      },
      transitionTimingFunction: {
        accordion: 'cubic-bezier(.85,0,.15,1)',
        zoom: 'cubic-bezier(.215,.61,.355,1)',
        expo: 'cubic-bezier(.22,1,.36,1)',
        menu: 'cubic-bezier(.4,0,.2,1)',
      },
      transitionDuration: {
        hover: '120ms',
        accordion: '300ms',
        'accordion-icon': '250ms',
        zoom: '400ms',
      },
    },
  },
  plugins: [],
}

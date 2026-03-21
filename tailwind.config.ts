import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "var(--gold)",
          dk: "var(--gold-dk)",
        },
        bg: "var(--bg)",
        "bg-off": "var(--bg-off)",
        "bg-surf": "var(--bg-surf)",
        "bg-deep": "var(--bg-deep)",
        hero: {
          bg: "var(--hero-bg)",
          text: "var(--hero-text)",
          sub: "var(--hero-sub)",
          stat: "var(--hero-stat)",
          statL: "var(--hero-stat-l)",
        },
        nav: {
          bg: "var(--nav-bg)",
          border: "var(--nav-border)",
          logo: "var(--nav-logo)",
          link: "var(--nav-link)",
          linkH: "var(--nav-link-h)",
        },
        dark: {
          bg: "var(--dark-bg)",
          text: "var(--dark-text)",
          sub: "var(--dark-sub)",
          h4: "var(--dark-h4)",
          featP: "var(--dark-feat-p)",
        },
        card: {
          bg: "var(--card-bg)",
          border: "var(--card-border)",
          border2: "var(--card-border2)",
        },
        text: {
          DEFAULT: "var(--text)",
          2: "var(--text-2)",
        },
        muted: "var(--muted)",
        border: "var(--border)",
        border2: "var(--border2)",
        btn: {
          p: {
            bg: "var(--btn-p-bg)",
            hover: "var(--btn-p-hover)",
          }
        }
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        r: "var(--r)",
        rl: "var(--rl)",
        rxl: "var(--rxl)",
      },
      boxShadow: {
        sh: "var(--sh)",
        shl: "var(--shl)",
      },
      transitionProperty: {
        tr: "var(--tr)",
      }
    },
  },
  plugins: [],
} satisfies Config;

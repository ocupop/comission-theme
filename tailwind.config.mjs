import fluid, { extract } from 'fluid-tailwind';
import colors from 'tailwindcss/colors';
import plugin from 'tailwindcss/plugin';

const themeMidColor = colors.gray;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: {
    files: ['./**/*.{liquid, json}', './node_modules/flowbite/**/*.js', './scripts/*.{js, jsx}'],
    extract,
  },
  safelist: [{ pattern: /pt-+/ }, { pattern: /pb-+/ }],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) /<alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        light: themeMidColor[50],
        mid: {
          light: themeMidColor[100],
          dark: themeMidColor[600],
          DEFAULT: themeMidColor[400],
          100: themeMidColor[100],
          200: themeMidColor[200],
          300: themeMidColor[300],
          400: themeMidColor[400],
          500: themeMidColor[500],
          600: themeMidColor[600],
          700: themeMidColor[700],
          800: themeMidColor[800],
          900: themeMidColor[900],
        },
        dark: themeMidColor[800],
        transparent: 'transparent',
        info: 'rgb(var(--color-info) / <alpha-value>)',
        warning: 'rgb(var(--color-warning) / <alpha-value>)',
        success: 'rgb(var(--color-success) / <alpha-value>)',
        danger: 'rgb(var(--color-danger) / <alpha-value>)',
      },
      screens: {
        // all sizing should be in rem so that fluid-tailwind works
        sm: '40rem',
        md: '48rem',
        lg: '64rem',
        xl: '80rem',
        '2xl': '96rem',
        // 'sm-max': { max: '48em' },
        // 'sm-only': { min: '32em', max: '48em' },
        // 'md-only': { min: '48em', max: '64em' },
        // 'lg-only': { min: '64em', max: '80em' },
        // 'xl-only': { min: '80em', max: '96em' },
        // '2xl-only': { min: '96em' },
        desktop: { min: '64rem' },
        tablet: { max: '48rem' },
        mobile: { max: '32rem' },
      },
      spacing: {
        header: 'var(--height-header)',
        screen: 'var(--screen-height, 100vh)',
      },
      height: {
        mainMenu: 'calc(var(--height-header) - 44px)',
        topMenu: '90px',
        screen: 'var(--screen-height, 100vh)',
        'screen-no-nav': 'calc(var(--screen-height, 100vh) - var(--height-header))',
      },
      width: {
        mobileGallery: 'calc(100vw - 3rem)',
      },
      fontFamily: {
        sans: ['Helvetica Neue', 'sans-serif'],
        serif: ['"IBMPlexSerif"', 'Palatino', 'ui-serif'],
      },
      fontSize: {
        display: ['var(--font-size-display)', '1.1'],
        heading: ['var(--font-size-heading)', '1.25'],
        lead: ['var(--font-size-lead)', '1.333'],
        body: ['var(--font-size-body)', '1.5'],
        small: ['var(--font-size-small)', '1.333'],
      },
      // maxWidth: {
      //   "prose-narrow": "45ch",
      //   "prose-wide": "80ch"
      // },
      boxShadow: {
        border: 'inset 0px 0px 0px 1px rgb(var(--color-primary) / 0.08)',
        darkHeader: 'inset 0px -1px 0px 0px rgba(21, 21, 21, 0.4)',
        lightHeader: 'inset 0px -1px 0px 0px rgba(21, 21, 21, 0.05)',
      },
      container: {
        center: true,
        padding: '1rem',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        blink: {
          '0%': { opacity: 0.2 },
          '20%': { opacity: 1 },
          '100% ': { opacity: 0.2 },
        },
      },
      animation: {
        fadeIn: 'fadeIn .3s ease-in-out',
        carousel: 'marquee 60s linear infinite',
        blink: 'blink 1.4s both infinite',
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [
    fluid,
    require('@tailwindcss/container-queries'),
    require('@tailwindcss/typography'),
    require('flowbite/plugin'),
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {
          'animation-delay': (value) => {
            return {
              'animation-delay': value,
            };
          },
        },
        {
          values: theme('transitionDelay'),
        }
      );
    }),
  ],
};

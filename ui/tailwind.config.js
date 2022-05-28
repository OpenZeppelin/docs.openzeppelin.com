const plugin = require('tailwindcss/plugin');

module.exports = {
  content: ['theme/partials/*.hbs', 'src/**'],
  plugins: [
    require('@tailwindcss/typography'),
    plugin(function({ addVariant }) {
      addVariant('collapsed', '.collapsible.collapsed &')
      addVariant('-collapsed', '.collapsible:not(.collapsed) &')
    }),
  ],
  corePlugins: {
    textOpacity: false,
    backgroundOpacity: false,
    borderOpacity: false,
    divideOpacity: false,
    placeholderOpacity: false,
    ringOpacity: false,
  },
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: 'Silka, sans-serif',
      },
      spacing: {
        header: 'var(--header)',
      },
      typography: theme => ({
        DEFAULT: {
          css: {
            maxWidth: '90ch',
            h1: {
              fontFamily: theme('fontFamily.display'),
            },
            'code::before': { content: '' },
            'code::after': { content: '' },
          },
        },
      }),
    },
  },
};

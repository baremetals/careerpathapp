/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/views/**/*.hbs'],
  theme: {
    screens: {
      sm: '480px',
      // => @media (min-width: 640px) { ... }

      md: '768px',
      // => @media (min-width: 768px) { ... }

      lg: '976px',
      // => @media (min-width: 976px) { ... }

      xl: '1440px',
      // => @media (min-width: 1440px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
    extend: {},
  },
  plugins: [],
};

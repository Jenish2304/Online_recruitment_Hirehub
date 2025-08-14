module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", 
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ff5339',
        secondary: '#F4A261',
        accent: '#000000',
        neutral: '#FFFFFF',
      },
      buttonStyles: {
        primary: {
          backgroundColor: '#ff5339',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#D62828',
          },
        },
        secondary: {
          backgroundColor: '#F4A261',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#E76F51',
          },
        },
        neutral: {
          backgroundColor: '#FFFFFF',
          color: '#000000',
          '&:hover': {
            backgroundColor: '#F1F1F1',
          },
        },
      },
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        '.btn-primary': {
          backgroundColor: '#ff5339',
          color: '#FFFFFF',
          padding: '0.5rem 1rem',
          borderRadius: '0.375rem',
          fontWeight: '600',
          '&:hover': {
            backgroundColor: '#D62828',
          },
        },
        '.btn-secondary': {
          backgroundColor: '#F4A261',
          color: '#FFFFFF',
          padding: '0.5rem 1rem',
          borderRadius: '0.375rem',
          fontWeight: '600',
          '&:hover': {
            backgroundColor: '#E76F51',
          },
        },
        '.btn-neutral': {
          backgroundColor: '#FFFFFF',
          color: '#000000',
          padding: '0.5rem 1rem',
          borderRadius: '0.375rem',
          fontWeight: '600',
          '&:hover': {
            backgroundColor: '#F1F1F1',
          },
        },
      });
    },
  ],
};



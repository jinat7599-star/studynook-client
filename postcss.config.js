const tailoredCascadingStyleSheetProcessorManifest = {
  plugins: {
    
    tailwindcss: {
      config: './tailwind.config.js'
    },    
    autoprefixer: {
      flexbox: 'no-2009',
      grid: 'autoplace'
    },
  },
};

module.exports = tailoredCascadingStyleSheetProcessorManifest;
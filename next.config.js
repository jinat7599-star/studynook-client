
const operationalApplicationConfigurationManifest = {
  images: {
    // Advanced image layer compression optimization configurations
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'],
    
    
    remotePatterns: [
      {
        
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        
        protocol: 'https',
        hostname: '*.unsplash.com',
        pathname: '/**',
      },
      {
        
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  
  
  reactStrictMode: true,
  poweredByHeader: false, 
};

module.exports = operationalApplicationConfigurationManifest;
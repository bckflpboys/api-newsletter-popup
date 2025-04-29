module.exports = {
  // Cloudflare CDN configuration
  cdn: {
    // Zone configuration
    zone: {
      id: process.env.CLOUDFLARE_ZONE_ID,
      name: process.env.DOMAIN_NAME
    },
    
    // Cache configuration
    cache: {
      // Browser cache TTL in seconds (1 day)
      browserTTL: 86400,
      
      // Edge cache TTL in seconds (7 days)
      edgeTTL: 604800,
      
      // Cache by status codes
      byStatusCode: {
        '200-299': 86400,
        '404': 3600,
        '500-599': 0
      }
    },
    
    // Security settings
    security: {
      // Enable WAF (Web Application Firewall)
      waf: {
        enabled: true,
        securityLevel: 'medium',
        challengeTTL: 2700,
        challengePageStyle: 'basic'
      },
      
      // DDoS protection
      ddos: {
        enabled: true,
        rateLimit: 1000, // requests per 10 seconds
        securityLevel: 'medium'
      },
      
      // SSL/TLS settings
      ssl: {
        mode: 'strict',
        minVersion: '1.2'
      }
    },
    
    // Page rules
    pageRules: [
      {
        // Cache static assets aggressively
        target: '*.css/*',
        actions: {
          cacheLevel: 'Cache Everything',
          edgeCacheTTL: 2592000 // 30 days
        }
      },
      {
        target: '*.js/*',
        actions: {
          cacheLevel: 'Cache Everything',
          edgeCacheTTL: 2592000
        }
      },
      {
        target: '*.jpg/*',
        actions: {
          cacheLevel: 'Cache Everything',
          edgeCacheTTL: 2592000
        }
      }
    ]
  }
};

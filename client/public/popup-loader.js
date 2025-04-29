(function() {
  // Configuration
  const API_URL = window.NEWSLETTER_API_URL || 'http://localhost:3003';
  
  class NewsletterPopup {
    constructor() {
      this.initialized = false;
      this.popupId = null;
      this.userId = null;
      this.features = null;
      this.abTesting = null;
    }

    async init(features, userId, config) {
      if (this.initialized) return;
      
      this.features = features;
      this.userId = userId;
      
      // Handle A/B testing configuration
      if (typeof config === 'object' && config.popupA && config.popupB) {
        this.abTesting = {
          enabled: true,
          popupA: config.popupA,
          popupB: config.popupB,
          split: config.split || 50
        };
        // Determine which variant to show based on split
        this.popupId = Math.random() * 100 < this.abTesting.split ? 
          this.abTesting.popupA : 
          this.abTesting.popupB;
      } else {
        this.popupId = config;
      }
      
      try {
        // Fetch popup configuration with domain validation
        const response = await fetch(`${API_URL}/api/popup/config/${this.popupId}`, {
          headers: {
            'Origin': window.location.origin
          }
        });

        if (!response.ok) {
          if (response.status === 403) {
            console.error('Popup not configured for this domain');
            return;
          }
          throw new Error('Failed to load popup configuration');
        }

        const { data: popupConfig } = await response.json();
        
        // Track view for A/B testing
        if (this.abTesting?.enabled) {
          this.trackAbTestingEvent('view', {
            variant: this.popupId === this.abTesting.popupA ? 'A' : 'B'
          });
        }

        // Initialize popup with configuration
        this.createPopup(popupConfig);
        this.initialized = true;
      } catch (error) {
        console.error('Error initializing popup:', error);
      }
    }

    async trackAbTestingEvent(event, data) {
      try {
        await fetch(`${API_URL}/api/popup/track`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            popup_id: this.popupId,
            event,
            data,
            ts: new Date().toISOString()
          })
        });
      } catch (error) {
        console.error('Error tracking A/B testing event:', error);
      }
    }

    createPopup(config) {
      // Create and inject popup HTML
      const popupHtml = this.generatePopupHtml(config);
      document.body.insertAdjacentHTML('beforeend', popupHtml);
      
      // Add event listeners
      this.addEventListeners();
    }

    generatePopupHtml(config) {
      // Generate popup HTML based on configuration
      return `
        <div id="newsletter-popup" class="newsletter-popup" style="display: none;">
          <!-- Popup content will be injected here -->
        </div>
      `;
    }

    addEventListeners() {
      // Add event listeners for popup interactions
      const popup = document.getElementById('newsletter-popup');
      if (!popup) return;

      // Track form submissions for A/B testing
      const form = popup.querySelector('form');
      if (form) {
        form.addEventListener('submit', async (e) => {
          if (this.abTesting?.enabled) {
            await this.trackAbTestingEvent('conversion', {
              variant: this.popupId === this.abTesting.popupA ? 'A' : 'B'
            });
          }
        });
      }
    }
  }

  // Initialize global popup instance
  window.NewsletterPopup = new NewsletterPopup();
})();

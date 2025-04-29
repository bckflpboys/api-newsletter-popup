class PopupLoader {
    constructor(userId, popupId, features) {
        this.userId = userId;
        this.popupId = popupId;
        this.features = features.split('.');
        this.initialized = false;
        this.init();
    }

    async init() {
        try {
            // Fetch popup configuration
            const config = await this.fetchConfig();
            
            // Create shadow DOM for style isolation
            this.createContainer();
            
            // Initialize features
            await this.initFeatures();
            
            // Apply styles
            this.applyStyles(config.styles);
            
            // Setup triggers
            this.setupTriggers(config.settings.trigger);
            
            this.initialized = true;
        } catch (error) {
            console.error('Popup initialization failed:', error);
        }
    }

    async fetchConfig() {
        const response = await fetch(`/api/popup/config/${this.popupId}`);
        const data = await response.json();
        if (data.status === 'success') {
            this.config = data.data;
            return this.config;
        }
        throw new Error('Failed to fetch popup configuration');
    }

    createContainer() {
        // Create isolated container using Shadow DOM
        this.container = document.createElement('div');
        this.container.id = `np-${this.popupId}`;
        this.shadow = this.container.attachShadow({ mode: 'closed' });
        document.body.appendChild(this.container);
    }

    applyStyles(styles) {
        // Create style element
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles.compiled_css;
        this.shadow.appendChild(styleSheet);
        
        // Apply responsive styles
        this.applyResponsiveStyles(styles.responsive);
        
        // Apply styles to popup container
        this.container.style.backgroundColor = styles.backgroundColor;
        this.container.style.color = styles.textColor;
        if (styles.borderWidth !== '0') {
          this.container.style.border = `${styles.borderWidth}px solid ${styles.borderColor}`;
        }
    }

    setupTriggers(triggerConfig) {
        switch(triggerConfig.type) {
            case 'time':
                setTimeout(() => this.show(), triggerConfig.value);
                break;
            case 'scroll':
                this.setupScrollTrigger(triggerConfig.value);
                break;
            case 'exit':
                this.setupExitIntent();
                break;
        }
    }

    show() {
        if (!this.shouldShow()) return;
        
        // Show popup
        this.container.classList.add('active');
        
        // Track view
        this.trackEvent('view');
    }

    shouldShow() {
        // Check frequency rules
        const lastShown = localStorage.getItem(`np-${this.popupId}-lastShown`);
        if (lastShown) {
            const cooldown = this.config.settings.frequency.cooldown;
            if (Date.now() - parseInt(lastShown) < cooldown) {
                return false;
            }
        }
        return true;
    }

    trackEvent(event, data = {}) {
        fetch('/api/track', {
            method: 'POST',
            body: JSON.stringify({
                popup_id: this.popupId,
                user_id: this.userId,
                event,
                data,
                timestamp: Date.now()
            })
        });
    }

    // Feature initialization methods
    async initFeatures() {
        for (const feature of this.features) {
            switch(feature) {
                case 'aa': // Domain scanning
                    this.trackDomain();
                    break;
                case 'bb': // Trigger controls
                    this.initTriggers();
                    break;
                case 'cc': // Popup counter
                    this.initCounter();
                    break;
                case 'dd': // Dismissal tracking
                    this.initDismissalTracking();
                    break;
                case 'ee': // Submission tracking
                    this.initSubmissionTracking();
                    break;
                case 'ff': // Database operations
                    this.initDatabaseOps();
                    break;
                case 'gg': // Geolocation
                    await this.initGeolocation();
                    break;
                case 'hh': // A/B Testing
                    await this.initABTesting();
                    break;
                case 'ii': // Analytics
                    this.initAnalytics();
                    break;
                case 'jj': // Exit intent
                    this.initExitIntent();
                    break;
                case 'kk': // Device targeting
                    this.initDeviceTargeting();
                    break;
                case 'll': // Real-time dashboard
                    this.initDashboard();
                    break;
            }
        }
    }

    // Individual feature implementations
    trackDomain() {
        const domain = window.location.hostname;
        this.trackEvent('domain', { domain });
    }

    initTriggers() {
        // Implementation for trigger controls
    }

    initCounter() {
        let count = parseInt(localStorage.getItem(`np-${this.popupId}-count`) || '0');
        localStorage.setItem(`np-${this.popupId}-count`, ++count);
    }

    initDismissalTracking() {
        this.shadow.querySelector('.close-btn')?.addEventListener('click', () => {
            this.trackEvent('dismiss');
        });
    }

    initSubmissionTracking() {
        this.shadow.querySelector('form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.trackEvent('submit');
            // Handle form submission
        });
    }

    async initGeolocation() {
        try {
            const response = await fetch('https://api.ipapi.com/check?access_key=YOUR_API_KEY');
            const geoData = await response.json();
            this.trackEvent('geolocation', geoData);
        } catch (error) {
            console.error('Geolocation failed:', error);
        }
    }

    // ... other feature implementations
}

// Initialize when script loads
window.NewsletterPopup = window.NewsletterPopup || {};
window.NewsletterPopup.init = function(userId, popupId, features) {
    return new PopupLoader(userId, popupId, features);
};

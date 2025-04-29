const express = require('express');
const router = express.Router();
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const { logger } = require('../utils/logger');
const { popupRules, validate } = require('../middleware/validation');
const { Popup, Website } = require('../models');
const fs = require('fs').promises;
const path = require('path');
const mongoose = require('mongoose'); // Import mongoose

// Function to generate popup embed code
function generatePopupCode(popup, userId) {
  // Get the base URL from environment variables or use a default
  const baseUrl = process.env.APP_URL || 'http://localhost:3003';

  // Combine all enabled features into a feature string
  const enabledFeatures = Object.entries(popup.features || {})
    .filter(([_, enabled]) => enabled)
    .map(([feature]) => feature)
    .join('.');

  // Use the enabled features or fallback to default features
  const features = enabledFeatures || 'aa.bb.cc.dd.ee.ff.gg.hh.ii.jj.kk.ll';

  const config = {
    features: features.split('.'),
    userId: userId,
    popupId: popup._id.toString(),
    settings: popup.settings || {
      trigger: {
        type: 'time',
        value: '7'
      },
      frequency: {
        show_once: false,
        cooldown: '24h'
      },
      targeting: {
        devices: ['mobile', 'desktop', 'tablet'],
        countries: ['US', 'UK', 'CA'],
        languages: ['en', 'es', 'fr']
      }
    },
    theme: {
      id: popup.theme?.id || 'modern-1',
      backgroundColor: popup.backgroundColor || '#ffffff',
      textColor: popup.textColor || '#000000',
      buttonColor: popup.buttonColor || '#2196F3',
      buttonTextColor: popup.buttonTextColor || '#ffffff',
      borderColor: popup.borderColor || '#e0e0e0',
      borderWidth: popup.borderWidth || '0',
      backgroundStyle: popup.backgroundStyle || {}
    },
    formFields: popup.formFields || {
      collectEmail: true,
      emailRequired: true,
      collectFirstName: false,
      firstNameRequired: false,
      collectLastName: false,
      lastNameRequired: false,
      collectPhone: false,
      phoneRequired: false,
      collectCity: false,
      cityRequired: false
    }
  };

  return `<script>
// Embed Code (to be placed on client's website)
(function(w,d,c){
  // Initialize NewsletterPopup object
  w.NewsletterPopup = {
    config: ${JSON.stringify(config, null, 2)},
    baseUrl: '${baseUrl}',
    
    init: function() {
      this.createContainer();
      this.applyStyles();
      this.setupTriggers();
      this.initFeatures();
    },

    createContainer: function() {
      this.container = d.createElement('div');
      this.container.id = 'np-' + this.config.popupId;
      this.shadow = this.container.attachShadow({ mode: 'open' });
      d.body.appendChild(this.container);
    },

    applyStyles: function() {
      const style = d.createElement('style');
      style.textContent = \`
        .np-popup {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: \${this.config.theme.backgroundColor};
          color: \${this.config.theme.textColor};
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          z-index: 10000;
          max-width: 90%;
          width: 400px;
        }
        .np-close {
          position: absolute;
          top: 10px;
          right: 10px;
          cursor: pointer;
          background: none;
          border: none;
          font-size: 20px;
          color: \${this.config.theme.textColor};
        }
        .np-button {
          background-color: \${this.config.theme.buttonColor};
          color: \${this.config.theme.buttonTextColor};
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          margin-top: 15px;
          width: 100%;
        }
        .np-input {
          width: 100%;
          padding: 8px;
          margin: 5px 0;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
      \`;
      this.shadow.appendChild(style);
    },

    setupTriggers: function() {
      const trigger = this.config.settings.trigger;
      if (trigger.type === 'time') {
        setTimeout(() => this.show(), parseInt(trigger.value) * 1000);
      }
    },

    initFeatures: function() {
      this.config.features.forEach(feature => {
        if (typeof this['init' + feature] === 'function') {
          this['init' + feature]();
        }
      });
    },

    show: function() {
      const popup = d.createElement('div');
      popup.className = 'np-popup';
      
      const closeBtn = d.createElement('button');
      closeBtn.className = 'np-close';
      closeBtn.innerHTML = '×';
      closeBtn.onclick = () => this.hide();
      
      const form = d.createElement('form');
      form.onsubmit = (e) => this.handleSubmit(e);
      
      if (this.config.formFields.collectEmail) {
        const emailInput = d.createElement('input');
        emailInput.type = 'email';
        emailInput.className = 'np-input';
        emailInput.placeholder = 'Email';
        emailInput.required = this.config.formFields.emailRequired;
        form.appendChild(emailInput);
      }
      
      const submitBtn = d.createElement('button');
      submitBtn.className = 'np-button';
      submitBtn.type = 'submit';
      submitBtn.textContent = 'Subscribe';
      
      form.appendChild(submitBtn);
      popup.appendChild(closeBtn);
      popup.appendChild(form);
      
      this.shadow.appendChild(popup);
    },

    hide: function() {
      const popup = this.shadow.querySelector('.np-popup');
      if (popup) {
        popup.remove();
      }
    },

    handleSubmit: async function(e) {
      e.preventDefault();
      const form = e.target;
      const email = form.querySelector('input[type="email"]')?.value;
      
      try {
        const response = await fetch(\`\${this.baseUrl}/api/subscribe/\${this.config.popupId}\`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email })
        });
        
        if (response.ok) {
          this.hide();
          alert('Thank you for subscribing!');
        } else {
          throw new Error('Subscription failed');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Sorry, there was an error. Please try again.');
      }
    }
  };

  // Initialize the popup
  w.NewsletterPopup.init();
})(window, document, ${JSON.stringify(config)});</script>`;
}

// Function to generate popup code
function generatePopupCodeOld(popup) {
  return `
    (function() {
      // Popup initialization code will go here
      console.log('Popup initialized:', ${JSON.stringify(popup)});
    })();
  `;
}

// Get all popups for the current user
router.get('/', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const popups = await Popup.find({ userId: req.auth.userId });
    res.json({ 
      status: 'success',
      data: popups
    });
  } catch (error) {
    logger.error('Error fetching popups:', error);
    res.status(500).json({ status: 'error', message: 'Error fetching popups' });
  }
});

// Get all popups for a website
router.get('/website/:websiteId', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const website = await Website.findOne({ 
      _id: req.params.websiteId,
      userId: req.auth.userId 
    });
    
    if (!website) {
      return res.status(404).json({ status: 'error', message: 'Website not found' });
    }
    
    const popups = await Popup.find({ websiteId: website._id });
    res.json({ status: 'success', data: popups });
  } catch (error) {
    logger.error('Error fetching popups:', error);
    res.status(500).json({ status: 'error', message: 'Error fetching popups' });
  }
});

// Get a single popup
router.get('/:id', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const popup = await Popup.findOne({ 
      _id: req.params.id,
      userId: req.auth.userId 
    });
    
    if (!popup) {
      return res.status(404).json({ status: 'error', message: 'Popup not found' });
    }
    
    res.json({ status: 'success', data: popup });
  } catch (error) {
    logger.error('Error fetching popup:', error);
    res.status(500).json({ status: 'error', message: 'Error fetching popup' });
  }
});

// Create a new popup
router.post('/', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    logger.info('Received popup creation request:', req.body);
    logger.info('User ID:', req.auth.userId);

    // Create a default website ID for the domain
    const websiteId = new mongoose.Types.ObjectId();

    // Create popup data with required fields
    const popupData = {
      ...req.body,
      userId: req.auth.userId,
      websiteId, // Use the generated website ID
      status: 'active',
      settings: {
        frequency: {
          show_once: req.body.settings?.frequency?.show_once ?? false,
          cooldown: req.body.settings?.frequency?.cooldown ?? '24h'
        },
        trigger: {
          type: req.body.settings?.trigger?.type ?? 'time',
          value: req.body.settings?.trigger?.value ?? '7'
        },
        targeting: {
          devices: req.body.settings?.targeting?.devices ?? [],
          countries: req.body.settings?.targeting?.countries ?? [],
          languages: req.body.settings?.targeting?.languages ?? []
        },
        domain: {
          detected: req.body.settings?.domain?.detected ?? '',
          override: req.body.settings?.domain?.override ?? false,
          manual: req.body.settings?.domain?.manual ?? ''
        }
      },
      formFields: {
        collectEmail: req.body.formFields?.collectEmail ?? true,
        emailRequired: req.body.formFields?.emailRequired ?? true,
        collectPhone: req.body.formFields?.collectPhone ?? false,
        phoneRequired: req.body.formFields?.phoneRequired ?? false,
        collectName: req.body.formFields?.collectName ?? false,
        nameRequired: req.body.formFields?.nameRequired ?? false,
        collectLastName: req.body.formFields?.collectLastName ?? false,
        lastNameRequired: req.body.formFields?.lastNameRequired ?? false,
        collectCity: req.body.formFields?.collectCity ?? false,
        cityRequired: req.body.formFields?.cityRequired ?? false
      },
      formFieldsB: req.body.formFieldsB ? {
        collectEmail: req.body.formFieldsB?.collectEmail ?? true,
        emailRequired: req.body.formFieldsB?.emailRequired ?? true,
        collectPhone: req.body.formFieldsB?.collectPhone ?? false,
        phoneRequired: req.body.formFieldsB?.phoneRequired ?? false,
        collectName: req.body.formFieldsB?.collectName ?? false,
        nameRequired: req.body.formFieldsB?.nameRequired ?? false,
        collectLastName: req.body.formFieldsB?.collectLastName ?? false,
        lastNameRequired: req.body.formFieldsB?.lastNameRequired ?? false,
        collectCity: req.body.formFieldsB?.collectCity ?? false,
        cityRequired: req.body.formFieldsB?.cityRequired ?? false
      } : undefined,
      themeB: req.body.themeB,
      features: req.body.features ?? 'aa.bb.cc'
    };

    logger.info('Creating popup with data:', popupData);
    
    const popup = new Popup(popupData);
    await popup.save();

    res.status(201).json({ 
      status: 'success', 
      message: 'Popup created successfully',
      data: popup 
    });
  } catch (error) {
    logger.error('Error creating popup:', error);
    res.status(500).json({ 
      status: 'error', 
      message: error.message || 'Error creating popup' 
    });
  }
});

// Update a popup
router.put('/:id', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    logger.info('Updating popup:', { id: req.params.id, updates: req.body });
    
    const updateData = {
      ...req.body,
      userId: req.auth.userId,
      settings: {
        frequency: {
          show_once: req.body.settings?.frequency?.show_once ?? false,
          cooldown: req.body.settings?.frequency?.cooldown ?? '24h'
        },
        trigger: {
          type: req.body.settings?.trigger?.type ?? 'time',
          value: req.body.settings?.trigger?.value ?? '7'
        },
        targeting: {
          devices: req.body.settings?.targeting?.devices ?? [],
          countries: req.body.settings?.targeting?.countries ?? [],
          languages: req.body.settings?.targeting?.languages ?? []
        },
        domain: {
          detected: req.body.settings?.domain?.detected ?? '',
          override: req.body.settings?.domain?.override ?? false,
          manual: req.body.settings?.domain?.manual ?? ''
        }
      },
      formFields: {
        collectEmail: req.body.formFields?.collectEmail ?? true,
        emailRequired: req.body.formFields?.emailRequired ?? true,
        collectPhone: req.body.formFields?.collectPhone ?? false,
        phoneRequired: req.body.formFields?.phoneRequired ?? false,
        collectName: req.body.formFields?.collectName ?? false,
        nameRequired: req.body.formFields?.nameRequired ?? false,
        collectLastName: req.body.formFields?.collectLastName ?? false,
        lastNameRequired: req.body.formFields?.lastNameRequired ?? false,
        collectCity: req.body.formFields?.collectCity ?? false,
        cityRequired: req.body.formFields?.cityRequired ?? false
      },
      formFieldsB: req.body.formFieldsB ? {
        collectEmail: req.body.formFieldsB?.collectEmail ?? true,
        emailRequired: req.body.formFieldsB?.emailRequired ?? true,
        collectPhone: req.body.formFieldsB?.collectPhone ?? false,
        phoneRequired: req.body.formFieldsB?.phoneRequired ?? false,
        collectName: req.body.formFieldsB?.collectName ?? false,
        nameRequired: req.body.formFieldsB?.nameRequired ?? false,
        collectLastName: req.body.formFieldsB?.collectLastName ?? false,
        lastNameRequired: req.body.formFieldsB?.lastNameRequired ?? false,
        collectCity: req.body.formFieldsB?.collectCity ?? false,
        cityRequired: req.body.formFieldsB?.cityRequired ?? false
      } : undefined,
      themeId: req.body.themeId,
      themeB: req.body.themeB ? {
        id: req.body.themeB.id,
        backgroundColor: req.body.themeB.backgroundColor ?? '#FFFFFF',
        textColor: req.body.themeB.textColor ?? '#000000',
        buttonColor: req.body.themeB.buttonColor ?? '#2196F3',
        buttonTextColor: req.body.themeB.buttonTextColor ?? '#ffffff',
        borderColor: req.body.themeB.borderColor ?? '#e0e0e0',
        borderWidth: req.body.themeB.borderWidth ?? '0',
        backgroundStyle: req.body.themeB.backgroundStyle ?? {}
      } : undefined
    };

    const popup = await Popup.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.auth.userId
      },
      updateData,
      { 
        new: true,
        runValidators: true
      }
    );

    if (!popup) {
      logger.warn('Popup not found:', { id: req.params.id, userId: req.auth.userId });
      return res.status(404).json({
        status: 'error',
        message: 'Popup not found'
      });
    }

    logger.info('Popup updated successfully:', popup);
    res.json({
      status: 'success',
      message: 'Popup updated successfully',
      data: popup
    });
  } catch (error) {
    logger.error('Error updating popup:', { 
      error: error.message,
      stack: error.stack,
      id: req.params.id 
    });
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error updating popup'
    });
  }
});

// Delete a popup
router.delete('/:id', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const popup = await Popup.findOneAndDelete({
      _id: req.params.id,
      userId: req.auth.userId
    });

    if (!popup) {
      return res.status(404).json({
        status: 'error',
        message: 'Popup not found'
      });
    }

    res.json({
      status: 'success',
      message: 'Popup deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting popup:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error deleting popup'
    });
  }
});

// Get popup code
router.get('/:id/code', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const popup = await Popup.findOne({
      _id: req.params.id,
      userId: req.auth.userId
    });

    if (!popup) {
      return res.status(404).json({
        status: 'error',
        message: 'Popup not found'
      });
    }

    // Generate the popup code
    const code = generatePopupCode(popup, req.auth.userId);
    
    res.json({
      status: 'success',
      data: code
    });
  } catch (error) {
    logger.error('Error generating popup code:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error generating popup code'
    });
  }
});

// Get popup script
router.get('/:id/script', async (req, res) => {
  try {
    const popup = await Popup.findById(req.params.id)
      .select('-userId -createdAt -updatedAt');
    
    if (!popup) {
      return res.status(404).json({ status: 'error', message: 'Popup not found' });
    }
    
    // Generate the popup script
    const script = generatePopupCodeOld(popup);
    
    res.set('Content-Type', 'application/javascript');
    res.send(script);
  } catch (error) {
    logger.error('Error generating popup script:', error);
    res.status(500).json({ status: 'error', message: 'Error generating popup script' });
  }
});

// Serve the popup loader script
router.get('/loader.js', (req, res) => {
  try {
    // Set CORS headers
    res.set({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/javascript; charset=utf-8'
    });

    // Define the loader script inline to avoid file system issues
    const loaderScript = `
      class PopupLoader {
        constructor(config) {
          this.config = config;
          this.init();
        }

        async init() {
          try {
            // Create container
            this.createContainer();
            
            // Apply styles
            this.applyStyles();
            
            // Setup triggers
            this.setupTriggers();
            
            // Initialize features
            await this.initFeatures();
          } catch (error) {
            console.error('Popup initialization failed:', error);
          }
        }

        createContainer() {
          // Create isolated container using Shadow DOM
          this.container = document.createElement('div');
          this.container.id = \`np-\${this.config.popupId}\`;
          this.shadow = this.container.attachShadow({ mode: 'open' });
          document.body.appendChild(this.container);
        }

        applyStyles() {
          const style = document.createElement('style');
          style.textContent = \`
            .np-popup {
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              background-color: \${this.config.theme.backgroundColor};
              color: \${this.config.theme.textColor};
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              z-index: 10000;
              max-width: 90%;
              width: 400px;
            }
            .np-close {
              position: absolute;
              top: 10px;
              right: 10px;
              cursor: pointer;
              background: none;
              border: none;
              font-size: 20px;
              color: \${this.config.theme.textColor};
            }
            .np-button {
              background-color: \${this.config.theme.buttonColor};
              color: \${this.config.theme.buttonTextColor};
              border: none;
              padding: 10px 20px;
              border-radius: 4px;
              cursor: pointer;
              font-size: 16px;
              margin-top: 15px;
            }
            .np-input {
              width: 100%;
              padding: 8px;
              margin: 5px 0;
              border: 1px solid #ddd;
              border-radius: 4px;
            }
          \`;
          this.shadow.appendChild(style);
        }

        setupTriggers() {
          const { trigger } = this.config.settings;
          if (trigger.type === 'time') {
            setTimeout(() => this.show(), parseInt(trigger.value) * 1000);
          }
        }

        async initFeatures() {
          // Initialize enabled features
          this.config.features.forEach(feature => {
            switch(feature) {
              case 'aa':
                this.initDomainScanning();
                break;
              case 'bb':
                this.initTriggerControls();
                break;
              // Add other feature initializations as needed
            }
          });
        }

        show() {
          const popup = document.createElement('div');
          popup.className = 'np-popup';
          
          // Create close button
          const closeBtn = document.createElement('button');
          closeBtn.className = 'np-close';
          closeBtn.innerHTML = '×';
          closeBtn.onclick = () => this.hide();
          
          // Create form
          const form = document.createElement('form');
          form.onsubmit = (e) => this.handleSubmit(e);
          
          // Add form fields based on configuration
          if (this.config.formFields.collectEmail) {
            const emailInput = document.createElement('input');
            emailInput.type = 'email';
            emailInput.className = 'np-input';
            emailInput.placeholder = 'Email';
            emailInput.required = this.config.formFields.emailRequired;
            form.appendChild(emailInput);
          }
          
          // Add submit button
          const submitBtn = document.createElement('button');
          submitBtn.className = 'np-button';
          submitBtn.type = 'submit';
          submitBtn.textContent = 'Subscribe';
          
          form.appendChild(submitBtn);
          popup.appendChild(closeBtn);
          popup.appendChild(form);
          
          this.shadow.appendChild(popup);
        }

        hide() {
          const popup = this.shadow.querySelector('.np-popup');
          if (popup) {
            popup.remove();
          }
        }

        async handleSubmit(e) {
          e.preventDefault();
          const form = e.target;
          const email = form.querySelector('input[type="email"]')?.value;
          
          try {
            // Send subscription request
            const response = await fetch(\`\${window.NewsletterPopup.baseUrl}/api/subscribe/\${this.config.popupId}\`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email })
            });
            
            if (response.ok) {
              this.hide();
              alert('Thank you for subscribing!');
            } else {
              throw new Error('Subscription failed');
            }
          } catch (error) {
            console.error('Error:', error);
            alert('Sorry, there was an error. Please try again.');
          }
        }
      }

      // Initialize popup if configuration is available
      if (window.NewsletterPopup && window.NewsletterPopup.config) {
        new PopupLoader(window.NewsletterPopup.config);
      }
    `;
    
    res.send(loaderScript);
  } catch (error) {
    console.error('Error serving loader script:', error);
    res.status(500).send('Error loading script');
  }
});

// Get popup configuration
router.get('/config/:popupId', async (req, res) => {
  try {
    const popup = await Popup.findById(req.params.popupId);
    if (!popup) {
      return res.status(404).json({ status: 'error', message: 'Popup not found' });
    }

    // Generate CSS for the popup
    const css = generateCSS(popup);

    // Prepare the configuration
    const config = {
      styles: {
        compiled_css: css,
        backgroundColor: popup.backgroundColor || '#ffffff',
        textColor: popup.textColor || '#333333',
        buttonColor: popup.buttonColor || '#007bff',
        buttonTextColor: popup.buttonTextColor || '#ffffff',
        borderWidth: popup.borderWidth || 0,
        borderColor: popup.borderColor || '#cccccc',
        responsive: popup.responsive || {}
      },
      content: {
        title: popup.title || 'Subscribe to Newsletter',
        description: popup.description || 'Stay updated with our latest news and updates.',
        buttonText: popup.buttonText || 'Subscribe'
      },
      formFields: popup.formFields || {
        collectEmail: true,
        collectName: false,
        nameRequired: false,
        collectPhone: false,
        phoneRequired: false
      },
      settings: popup.settings || {
        trigger: {
          type: 'time',
          value: 0
        },
        frequency: {
          type: 'once',
          cooldown: 86400000 // 24 hours
        }
      },
      features: popup.features || []
    };

    // If A/B testing is enabled, include variants
    if (popup.ab_testing?.enabled) {
      config.ab_testing = {
        enabled: true,
        split: popup.ab_testing.split,
        variants: popup.ab_testing.variants
      };
    }

    res.json({
      status: 'success',
      data: config
    });
  } catch (error) {
    logger.error('Error fetching popup config:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Error fetching popup configuration' 
    });
  }
});

// Track A/B testing events
router.post('/track', async (req, res) => {
  try {
    const { popup_id, event, data } = req.body;
    
    if (!popup_id || !event || !data.variant) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Missing required fields' 
      });
    }

    // Update popup analytics based on variant
    const updateQuery = {};
    const variant = data.variant === 'A' ? 'A' : 'B';
    
    if (event === 'view') {
      updateQuery[`ab_testing.variants.${variant}.stats.views`] = 1;
    } else if (event === 'conversion') {
      updateQuery[`ab_testing.variants.${variant}.stats.conversions`] = 1;
    }

    if (Object.keys(updateQuery).length > 0) {
      const popup = await Popup.findById(popup_id);
      
      if (!popup || !popup.ab_testing?.enabled) {
        return res.status(400).json({ 
          status: 'error', 
          message: 'Popup not found or A/B testing not enabled' 
        });
      }

      await Popup.findByIdAndUpdate(popup_id, {
        $inc: updateQuery
      });

      res.json({ status: 'success' });
    } else {
      res.status(400).json({ 
        status: 'error', 
        message: 'Invalid event type' 
      });
    }
  } catch (error) {
    logger.error('Error tracking A/B testing event:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Error tracking event' 
    });
  }
});

// Track popup events
router.post('/track', async (req, res) => {
  try {
    const { popup_id, user_id, event, data } = req.body;
    
    // Log the event
    logger.info('Popup event:', { popup_id, user_id, event, data });
    
    // Update analytics in database
    const popup = await Popup.findById(popup_id);
    if (popup) {
      // Update relevant counters based on event type
      switch(event) {
        case 'view':
          popup.views = (popup.views || 0) + 1;
          break;
        case 'dismiss':
          popup.dismissals = (popup.dismissals || 0) + 1;
          break;
        case 'submit':
          popup.submissions = (popup.submissions || 0) + 1;
          break;
      }
      await popup.save();
    }

    res.json({ status: 'success' });
  } catch (error) {
    logger.error('Error tracking popup event:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Error tracking event' 
    });
  }
});

function generateCSS(popup) {
  return `
    .np-popup {
      background-color: ${popup.backgroundColor};
      color: ${popup.textColor};
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .np-title {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 16px;
    }
    .np-description {
      margin-bottom: 20px;
    }
    .np-button {
      background-color: ${popup.buttonColor};
      color: ${popup.buttonTextColor};
      padding: 12px 24px;
      border-radius: 4px;
      border: none;
      cursor: pointer;
    }
    .np-close {
      position: absolute;
      top: 10px;
      right: 10px;
      cursor: pointer;
    }
  `;
}

module.exports = router;

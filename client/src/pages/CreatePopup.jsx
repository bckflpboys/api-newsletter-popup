import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@clerk/clerk-react';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { createPopup, getPopupCode } from '../utils/api';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Stack,
  Divider,
  Card,
  IconButton,
  Tooltip,
  Slider,
  Switch,
  FormControlLabel,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Timer as TimerIcon,
  Settings as SettingsIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  FormatListBulleted as FormatListBulletedIcon,
  ContentCopy as ContentCopyIcon
} from '@mui/icons-material';
import { debounce } from 'lodash';
import ThemeSelector from '../components/ThemeSelector';
import FeatureSelector from '../components/FeatureSelector';
import AdvancedSettings from '../components/AdvancedSettings';
import { popupThemes } from '../config/popupThemes';

const ColorPicker = React.memo(({ label, value, onChange, helperText }) => (
  <Box>
    <Stack direction="row" spacing={2} alignItems="center">
      <Typography variant="subtitle2" color="text.secondary">
        {label}
      </Typography>
      <Tooltip title={helperText} arrow>
        <IconButton size="small">
          <InfoIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Stack>
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        mt: 1
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: 1,
          border: '2px solid',
          borderColor: 'divider',
          backgroundColor: value,
          cursor: 'pointer',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'scale(1.05)'
          }
        }}
      />
      <TextField
        type="color"
        value={value}
        onChange={onChange}
        sx={{
          width: '100%',
          '& input': {
            cursor: 'pointer',
            height: 48,
            padding: 1
          }
        }}
      />
    </Box>
  </Box>
));

export default function CreatePopup() {
  const navigate = useNavigate();
  const { session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedThemeId, setSelectedThemeId] = useState(null);
  const [selectedThemeBId, setSelectedThemeBId] = useState(null);
  const [embedCode, setEmbedCode] = useState('');
  const [showPreviewValidation, setShowPreviewValidation] = useState(false);
  const [previewForm, setPreviewForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    city: ''
  });
  const [previewFormB, setPreviewFormB] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    city: ''
  });
  const [selectedFeatures, setSelectedFeatures] = useState({
    aa: true, // Domain scanning
    bb: true, // Trigger controls
    cc: true, // Popup counter
    dd: false, // Dismissal tracking
    ee: false, // Submission tracking
    ff: false, // Database operations
    gg: false, // Geolocation
    hh: false, // A/B Testing
    ii: false, // Analytics
    jj: false, // Exit intent
    kk: false, // Device targeting
    ll: false  // Real-time dashboard
  });
  const [selectedFeaturesB, setSelectedFeaturesB] = useState({
    autoShow: false,
    showOnce: false,
    exitIntent: false,
    scrollTrigger: false
  });
  const [formFields, setFormFields] = useState({
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
  });
  const [formFieldsB, setFormFieldsB] = useState({
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
  });

  const [settings, setSettings] = useState({
    trigger: {
      type: 'time',
      value: '7'
    },
    frequency: {
      show_once: false,
      cooldown: '24h'
    },
    targeting: {
      devices: [],
      countries: [],
      languages: []
    },
    display: {
      delay: 7
    }
  });

  const [selectedTab, setSelectedTab] = useState(0);

  const [abTestingEnabled, setAbTestingEnabled] = useState(false);
  const [splitRatio, setSplitRatio] = useState(50);
  const [variantA, setVariantA] = useState({
    theme: selectedThemeId ? popupThemes[selectedThemeId] : {
      backgroundColor: '#FFFFFF',
      textColor: '#000000',
      buttonColor: '#2196F3',
      buttonTextColor: '#FFFFFF'
    },
    content: {
      title: '',
      description: '',
      buttonText: ''
    }
  });
  const [variantB, setVariantB] = useState({
    theme: selectedThemeBId ? popupThemes[selectedThemeBId] : {
      backgroundColor: '#FFFFFF',
      textColor: '#000000',
      buttonColor: '#2196F3',
      buttonTextColor: '#FFFFFF'
    },
    content: {
      title: '',
      description: '',
      buttonText: ''
    }
  });

  const handleThemeSelect = (theme) => {
    setSelectedThemeId(theme.id);
    form.setValues({
      ...form.values,
      backgroundColor: theme.backgroundColor,
      textColor: theme.textColor,
      buttonColor: theme.buttonColor,
      buttonTextColor: theme.buttonTextColor,
      backgroundStyle: theme.backgroundStyle || {}
    });
    notifications.show({
      title: '🎨 Theme Applied',
      message: `Applied theme: ${theme.name}`,
      color: 'blue',
      withBorder: true,
      autoClose: 2000
    });
  };

  const handleThemeBSelect = (theme) => {
    setSelectedThemeBId(theme.id);
    formB.setValues({
      ...formB.values,
      backgroundColor: theme.backgroundColor,
      textColor: theme.textColor,
      buttonColor: theme.buttonColor,
      buttonTextColor: theme.buttonTextColor,
      backgroundStyle: theme.backgroundStyle || {}
    });
    notifications.show({
      title: '🎨 Theme B Applied',
      message: `Applied theme B: ${theme.name}`,
      color: 'orange',
      withBorder: true,
      autoClose: 2000
    });
  };

  const handleFieldToggle = (field) => (event) => {
    const isChecked = event.target.checked;
    
    // Special handling for email and phone collection/requirement
    if (field === 'collectEmail' || field === 'collectPhone') {
      // If unchecking collection
      if (!isChecked) {
        // Check if this would leave us with no contact method
        const isEmailSelected = field === 'collectEmail' ? false : formFields.collectEmail;
        const isPhoneSelected = field === 'collectPhone' ? false : formFields.collectPhone;
        
        if (!isEmailSelected && !isPhoneSelected) {
          notifications.show({
            title: '⚠️ Contact Method Required',
            message: 'At least one contact method (email or phone) must be selected',
            color: 'red',
            withBorder: true,
            autoClose: 2000
          });
          return;
        }

        setFormFields(prev => ({
          ...prev,
          [field]: false,
          [field.replace('collect', '').toLowerCase() + 'Required']: false
        }));
        
        // If unchecking the last required contact field, make the other one required
        const isEmailRequired = field === 'collectEmail' ? false : formFields.emailRequired;
        const isPhoneRequired = field === 'collectPhone' ? false : formFields.phoneRequired;
        if (!isEmailRequired && !isPhoneRequired) {
          const otherField = field === 'collectEmail' ? 'phoneRequired' : 'emailRequired';
          setFormFields(prev => ({
            ...prev,
            [field]: false,
            [field.replace('collect', '').toLowerCase() + 'Required']: false,
            [otherField]: true
          }));
        }
      } else {
        // When enabling collection, automatically set as required
        setFormFields(prev => ({
          ...prev,
          [field]: true,
          [field.replace('collect', '').toLowerCase() + 'Required']: true
        }));
      }
    } else if (field === 'emailRequired' || field === 'phoneRequired') {
      // Prevent unchecking if it's the last required contact method
      if (!isChecked) {
        const isEmailRequired = field === 'emailRequired' ? false : formFields.emailRequired;
        const isPhoneRequired = field === 'phoneRequired' ? false : formFields.phoneRequired;
        if (!isEmailRequired && !isPhoneRequired) {
          notifications.show({
            title: '⚠️ Validation Error',
            message: 'At least one contact method (email or phone) must be required',
            color: 'red',
            withBorder: true,
            autoClose: 2000
          });
          return;
        }
      }
      setFormFields(prev => ({
        ...prev,
        [field]: isChecked
      }));
    } else {
      // Normal handling for other fields
      if (field.includes('collect')) {
        setFormFields(prev => ({
          ...prev,
          [field]: isChecked,
          [field.replace('collect', '').toLowerCase() + 'Required']: isChecked ? prev[field.replace('collect', '').toLowerCase() + 'Required'] : false
        }));
      } else {
        setFormFields(prev => ({
          ...prev,
          [field]: isChecked
        }));
      }
    }
  };

  const handleFieldToggleB = (field) => (event) => {
    const isChecked = event.target.checked;
    
    // Special handling for email and phone collection/requirement
    if (field === 'collectEmail' || field === 'collectPhone') {
      // If unchecking collection
      if (!isChecked) {
        // Check if this would leave us with no contact method
        const isEmailSelected = field === 'collectEmail' ? false : formFieldsB.collectEmail;
        const isPhoneSelected = field === 'collectPhone' ? false : formFieldsB.collectPhone;
        
        if (!isEmailSelected && !isPhoneSelected) {
          notifications.show({
            title: '⚠️ Contact Method Required',
            message: 'At least one contact method (email or phone) must be selected',
            color: 'red',
            withBorder: true,
            autoClose: 2000
          });
          return;
        }

        setFormFieldsB(prev => ({
          ...prev,
          [field]: false,
          [field.replace('collect', '').toLowerCase() + 'Required']: false
        }));
        
        // If unchecking the last required contact field, make the other one required
        const isEmailRequired = field === 'collectEmail' ? false : formFieldsB.emailRequired;
        const isPhoneRequired = field === 'collectPhone' ? false : formFieldsB.phoneRequired;
        if (!isEmailRequired && !isPhoneRequired) {
          const otherField = field === 'collectEmail' ? 'phoneRequired' : 'emailRequired';
          setFormFieldsB(prev => ({
            ...prev,
            [field]: false,
            [field.replace('collect', '').toLowerCase() + 'Required']: false,
            [otherField]: true
          }));
        }
      } else {
        // When enabling collection, automatically set as required
        setFormFieldsB(prev => ({
          ...prev,
          [field]: true,
          [field.replace('collect', '').toLowerCase() + 'Required']: true
        }));
      }
    } else if (field === 'emailRequired' || field === 'phoneRequired') {
      // Prevent unchecking if it's the last required contact method
      if (!isChecked) {
        const isEmailRequired = field === 'emailRequired' ? false : formFieldsB.emailRequired;
        const isPhoneRequired = field === 'phoneRequired' ? false : formFieldsB.phoneRequired;
        if (!isEmailRequired && !isPhoneRequired) {
          notifications.show({
            title: '⚠️ Validation Error',
            message: 'At least one contact method (email or phone) must be required',
            color: 'red',
            withBorder: true,
            autoClose: 2000
          });
          return;
        }
      }
      setFormFieldsB(prev => ({
        ...prev,
        [field]: isChecked
      }));
    } else {
      // Normal handling for other fields
      if (field.includes('collect')) {
        setFormFieldsB(prev => ({
          ...prev,
          [field]: isChecked,
          [field.replace('collect', '').toLowerCase() + 'Required']: isChecked ? prev[field.replace('collect', '').toLowerCase() + 'Required'] : false
        }));
      } else {
        setFormFieldsB(prev => ({
          ...prev,
          [field]: isChecked
        }));
      }
    }
  };

  const handleRequiredToggle = (field) => (event) => {
    setFormFields(prev => {
      // Only handle email and phone required toggles
      if (field !== 'emailRequired' && field !== 'phoneRequired') {
        return {
          ...prev,
          [field]: event.target.checked
        };
      }

      const isEmailField = field === 'emailRequired';
      const isPhoneField = field === 'phoneRequired';

      // If trying to uncheck required status
      if (!event.target.checked) {
        const isOnlyEmailSelected = prev.collectEmail && !prev.collectPhone;
        const isOnlyPhoneSelected = prev.collectPhone && !prev.collectEmail;
        const isEmailRequired = isEmailField ? false : prev.emailRequired;
        const isPhoneRequired = isPhoneField ? false : prev.phoneRequired;

        // If this is the only selected contact method, prevent unchecking required
        if ((isOnlyEmailSelected && isEmailField) || (isOnlyPhoneSelected && isPhoneField)) {
          notifications.show({
            title: '⚠️ Required Field',
            message: 'This field must remain required as it is the only contact method.',
            color: 'yellow',
            withBorder: true,
            autoClose: 3000
          });
          return prev;
        }

        // If both are selected but trying to uncheck the last required one
        if (!isEmailRequired && !isPhoneRequired) {
          notifications.show({
            title: '⚠️ Required Contact Method',
            message: 'At least one contact method must be required.',
            color: 'yellow',
            withBorder: true,
            autoClose: 3000
          });
          return prev;
        }
      }

      return {
        ...prev,
        [field]: event.target.checked
      };
    });
  };

  const handleRequiredToggleB = (field) => (event) => {
    setFormFieldsB(prev => {
      // Only handle email and phone required toggles
      if (field !== 'emailRequired' && field !== 'phoneRequired') {
        return {
          ...prev,
          [field]: event.target.checked
        };
      }

      const isEmailField = field === 'emailRequired';
      const isPhoneField = field === 'phoneRequired';

      // If trying to uncheck required status
      if (!event.target.checked) {
        const isOnlyEmailSelected = prev.collectEmail && !prev.collectPhone;
        const isOnlyPhoneSelected = prev.collectPhone && !prev.collectEmail;
        const isEmailRequired = isEmailField ? false : prev.emailRequired;
        const isPhoneRequired = isPhoneField ? false : prev.phoneRequired;

        // If this is the only selected contact method, prevent unchecking required
        if ((isOnlyEmailSelected && isEmailField) || (isOnlyPhoneSelected && isPhoneField)) {
          notifications.show({
            title: '⚠️ Required Field',
            message: 'This field must remain required as it is the only contact method.',
            color: 'yellow',
            withBorder: true,
            autoClose: 3000
          });
          return prev;
        }

        // If both are selected but trying to uncheck the last required one
        if (!isEmailRequired && !isPhoneRequired) {
          notifications.show({
            title: '⚠️ Required Contact Method',
            message: 'At least one contact method must be required.',
            color: 'yellow',
            withBorder: true,
            autoClose: 3000
          });
          return prev;
        }
      }

      return {
        ...prev,
        [field]: event.target.checked
      };
    });
  };

  const handleSettingsChange = (newSettings) => {
    setSettings(newSettings);
    // Sync the display delay with the trigger value when it changes
    if (newSettings.trigger.type === 'time') {
      form.setFieldValue('displayDelay', parseInt(newSettings.trigger.value));
    }
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    form.setFieldValue('selectedTab', newValue);
  };

  const form = useForm({
    initialValues: {
      name: '',  // Add this field
      title: 'Join Our Newsletter',
      description: 'Stay updated with our latest news and special offers!',
      buttonText: 'Subscribe Now',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      buttonColor: '#007bff',
      buttonTextColor: '#ffffff',
      borderColor: '#e0e0e0',
      borderWidth: '0',
      backgroundStyle: {},
      settings: {
        domain: {
          detected: window.location.hostname || '',
          override: false,
          manual: ''
        },
        trigger: {
          type: 'time',
          value: '7'
        },
        frequency: {
          show_once: false,
          cooldown: '24h'
        },
        targeting: {
          devices: [],
          countries: [],
          languages: []
        },
        display: {
          delay: 7
        }
      }
    },
    validate: {
      name: (value) => (value.length < 1 ? 'Name is required' : null),
      title: (value) => (value.length < 1 ? 'Title is required' : null),
      description: (value) => (value.length < 1 ? 'Description is required' : null),
      buttonText: (value) => (value.length < 1 ? 'Button text is required' : null),
      settings: {
        domain: {
          detected: (value, values) => {
            if (!value && !values.settings.domain.manual) {
              return 'Domain is required';
            }
            return null;
          }
        }
      }
    }
  });

  const formB = useForm({
    initialValues: {
      title: 'Join Our Newsletter',
      description: 'Stay updated with our latest news and special offers!',
      buttonText: 'Subscribe Now',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      buttonColor: '#007bff',
      buttonTextColor: '#ffffff',
      borderColor: '#e0e0e0',
      borderWidth: '0',
      backgroundStyle: {}
    }
  });

  // Debounce form updates to improve color picker performance
  const debouncedUpdate = useMemo(
    () => debounce((field, value) => {
      form.setFieldValue(field, value);
    }, 50),
    [form]
  );

  const handleSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      const token = await session?.getToken();
      
      if (!token) {
        notifications.show({
          title: '❌ Error',
          message: 'Authentication token not found. Please log in again.',
          color: 'red',
          withBorder: true
        });
        setIsSubmitting(false);
        return;
      }

      // Get domain from settings
      const domain = values.settings.domain.override ? values.settings.domain.manual : values.settings.domain.detected;
      if (!domain) {
        notifications.show({
          title: '❌ Error',
          message: 'Please provide a domain name',
          color: 'red',
          withBorder: true
        });
        setIsSubmitting(false);
        return;
      }

      // Update features if A/B testing is enabled
      if (abTestingEnabled) {
        setSelectedFeatures(prev => ({
          ...prev,
          hh: true // Enable A/B Testing feature
        }));
      }

      const popupData = {
        name: values.name || 'My Popup',
        ...values,
        settings: {
          domain: {
            detected: values.settings.domain.detected || '',
            override: values.settings.domain.override || false,
            manual: values.settings.domain.manual || ''
          },
          frequency: {
            show_once: settings.frequency.show_once || false,
            cooldown: settings.frequency.cooldown || '24h'
          },
          trigger: {
            type: settings.trigger.type || 'time',
            value: settings.trigger.value || '7'
          },
          targeting: {
            devices: settings.targeting.devices || [],
            countries: settings.targeting.countries || [],
            languages: settings.targeting.languages || []
          },
          display: {
            delay: settings.display.delay || 7
          }
        },
        features: Object.entries(selectedFeatures)
          .filter(([_, enabled]) => enabled)
          .map(([key]) => key)
          .join('.'),
        ab_testing: abTestingEnabled ? {
          enabled: true,
          split: splitRatio,
          variants: {
            A: {
              title: values.title,
              description: values.description,
              buttonText: values.buttonText,
              backgroundColor: values.backgroundColor,
              textColor: values.textColor,
              buttonColor: values.buttonColor,
              buttonTextColor: values.buttonTextColor,
              borderColor: values.borderColor,
              borderWidth: values.borderWidth,
              theme: selectedThemeId ? popupThemes[selectedThemeId] : null
            },
            B: {
              title: formB.values.title,
              description: formB.values.description,
              buttonText: formB.values.buttonText,
              backgroundColor: formB.values.backgroundColor,
              textColor: formB.values.textColor,
              buttonColor: formB.values.buttonColor,
              buttonTextColor: formB.values.buttonTextColor,
              borderColor: formB.values.borderColor,
              borderWidth: formB.values.borderWidth,
              theme: selectedThemeBId ? popupThemes[selectedThemeBId] : null
            }
          }
        } : {
          enabled: false,
          split: 100,
          variants: {
            A: {
              title: values.title,
              description: values.description,
              buttonText: values.buttonText,
              backgroundColor: values.backgroundColor,
              textColor: values.textColor,
              buttonColor: values.buttonColor,
              buttonTextColor: values.buttonTextColor,
              borderColor: values.borderColor,
              borderWidth: values.borderWidth,
              theme: selectedThemeId ? popupThemes[selectedThemeId] : null
            }
          }
        },
        formFields: {
          collectEmail: formFields.collectEmail || false,
          emailRequired: formFields.emailRequired || false,
          collectName: formFields.collectFirstName || false,
          nameRequired: formFields.firstNameRequired || false,
          collectLastName: formFields.collectLastName || false,
          lastNameRequired: formFields.lastNameRequired || false,
          collectPhone: formFields.collectPhone || false,
          phoneRequired: formFields.phoneRequired || false,
          collectCity: formFields.collectCity || false,
          cityRequired: formFields.cityRequired || false
        }
      };

      console.log('Creating popup with data:', popupData);
      const response = await createPopup(token, popupData);
      console.log('Popup creation response:', response);

      // Get the generated popup code
      const codeResponse = await getPopupCode(token, response.data._id);
      setEmbedCode(codeResponse.data);

      notifications.show({
        title: '✨ Success',
        message: 'Popup created successfully! You can now copy the embed code.',
        color: 'green',
        withBorder: true,
        autoClose: 3000
      });

      navigate('/dashboard', { state: { activeTab: 1 } });
    } catch (error) {
      console.error('Popup creation error:', error);
      notifications.show({
        title: '❌ Error',
        message: error.response?.data?.message || 'Failed to create popup. Please try again.',
        color: 'red',
        withBorder: true
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode).then(() => {
      notifications.show({
        title: '📋 Copied!',
        message: 'Embed code copied to clipboard',
        color: 'blue',
        withBorder: true,
        autoClose: 2000
      });
    });
  };

  const handlePreviewSubmit = (e, variant = 'A') => {
    e.preventDefault();
    setShowPreviewValidation(true);

    const currentForm = variant === 'A' ? previewForm : previewFormB;
    const setForm = variant === 'A' ? setPreviewForm : setPreviewFormB;

    // Check if required fields are filled
    const isValid = Object.entries(formFields).reduce((valid, [field, required]) => {
      if (field.includes('Required') && required) {
        const fieldName = field.replace('Required', '');
        const collectField = 'collect' + fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
        if (formFields[collectField] && !currentForm[fieldName.toLowerCase()].trim()) {
          return false;
        }
      }
      return valid;
    }, true);

    if (isValid) {
      notifications.show({
        title: '✨ Success!',
        message: `Form submitted successfully in preview ${variant} mode`,
        color: 'green',
        withBorder: true,
        autoClose: 2000
      });
      setShowPreviewValidation(false);
      setForm({
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        city: ''
      });
    }
  };

  const handlePreviewInputChange = (field, variant = 'A') => (e) => {
    const setForm = variant === 'A' ? setPreviewForm : setPreviewFormB;
    setForm(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  // Sync A/B testing feature with the dedicated toggle
  useEffect(() => {
    setSelectedFeatures(prev => ({
      ...prev,
      hh: abTestingEnabled
    }));
  }, [abTestingEnabled]);

  // Sync dedicated toggle with A/B testing feature
  useEffect(() => {
    setAbTestingEnabled(selectedFeatures.hh);
  }, [selectedFeatures.hh]);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', py: 4 }}>
      <Container maxWidth="lg">
        <Stack spacing={4}>
          {/* Header */}
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton onClick={() => navigate('/dashboard')} sx={{ color: 'text.secondary' }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" gutterBottom>
              Create New Popup
            </Typography>
          </Stack>

          <Box sx={{ mb: 4 }}>
            <Stack spacing={3}>
              <Box>
                <Typography variant="h6" gutterBottom>Theme - Preview A</Typography>
                <ThemeSelector 
                  onSelectTheme={handleThemeSelect}
                  selectedThemeId={selectedThemeId}
                />
              </Box>

              {selectedFeatures.hh && (
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ color: 'warning.main' }}>Theme - Preview B</Typography>
                  <ThemeSelector 
                    onSelectTheme={handleThemeBSelect}
                    selectedThemeId={selectedThemeBId}
                  />
                </Box>
              )}
            </Stack>
          </Box>

          <Grid container spacing={3}>
            {/* Form */}
            <Grid item xs={12} md={7}>
              <Stack spacing={3}>
                {/* Basic Settings */}
                <Card 
                  elevation={0} 
                  sx={{ 
                    borderRadius: 3, 
                    border: '1px solid',
                    borderColor: 'grey.300',
                    '&:hover': {
                      borderColor: 'grey.400'
                    }
                  }}
                >
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>Basic Information - Preview A</Typography>
                    <Stack spacing={3}>
                      <TextField
                        label="Name"
                        {...form.getInputProps('name')}
                        fullWidth
                      />
                      <TextField
                        label="Title"
                        {...form.getInputProps('title')}
                        fullWidth
                      />
                      <TextField
                        label="Description"
                        {...form.getInputProps('description')}
                        multiline
                        rows={4}
                        fullWidth
                      />
                      <TextField
                        label="Button Text"
                        {...form.getInputProps('buttonText')}
                        fullWidth
                      />
                    </Stack>
                  </Paper>
                </Card>

                {/* Basic Settings for Preview B */}
                {selectedFeatures.hh && (
                  <Card 
                    elevation={0} 
                    sx={{ 
                      borderRadius: 3, 
                      border: '2px solid',
                      borderColor: 'orange',
                      '&:hover': {
                        borderColor: 'orange'
                      }
                    }}
                  >
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>Basic Information - Preview B</Typography>
                      <Stack spacing={3}>
                        <TextField
                          label="Title"
                          {...formB.getInputProps('title')}
                          fullWidth
                        />
                        <TextField
                          label="Description"
                          {...formB.getInputProps('description')}
                          multiline
                          rows={4}
                          fullWidth
                        />
                        <TextField
                          label="Button Text"
                          {...formB.getInputProps('buttonText')}
                          fullWidth
                        />
                      </Stack>
                    </Paper>
                  </Card>
                )}
                {/* Color Settings */}
                <Card 
                  elevation={0} 
                  sx={{ 
                    borderRadius: 3, 
                    border: '1px solid',
                    borderColor: 'grey.300',
                    '&:hover': {
                      borderColor: 'grey.400'
                    }
                  }}
                >
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>Colors - Preview A</Typography>
                    <Stack spacing={3}>
                      <ColorPicker
                        label="Background Color"
                        value={form.values.backgroundColor}
                        onChange={(e) => form.setFieldValue('backgroundColor', e.target.value)}
                        helperText="Main background color of the popup"
                      />
                      <ColorPicker
                        label="Text Color"
                        value={form.values.textColor}
                        onChange={(e) => form.setFieldValue('textColor', e.target.value)}
                        helperText="Main text color"
                      />
                      <ColorPicker
                        label="Button Color"
                        value={form.values.buttonColor}
                        onChange={(e) => form.setFieldValue('buttonColor', e.target.value)}
                        helperText="Background color of the main button"
                      />
                      <ColorPicker
                        label="Button Text Color"
                        value={form.values.buttonTextColor}
                        onChange={(e) => form.setFieldValue('buttonTextColor', e.target.value)}
                        helperText="Text color of the main button"
                      />
                      <Divider />
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>Border</Typography>
                        <Stack spacing={2}>
                          <ColorPicker
                            label="Border Color"
                            value={form.values.borderColor}
                            onChange={(e) => form.setFieldValue('borderColor', e.target.value)}
                            helperText="Color of the popup border"
                          />
                          <FormControl fullWidth>
                            <InputLabel>Border Width</InputLabel>
                            <Select
                              value={form.values.borderWidth}
                              label="Border Width"
                              onChange={(e) => form.setFieldValue('borderWidth', e.target.value)}
                            >
                              <MenuItem value="0">No Border</MenuItem>
                              <MenuItem value="1">Thin (1px)</MenuItem>
                              <MenuItem value="2">Medium (2px)</MenuItem>
                              <MenuItem value="3">Thick (3px)</MenuItem>
                            </Select>
                            <FormHelperText>Width of the popup border</FormHelperText>
                          </FormControl>
                        </Stack>
                      </Box>
                    </Stack>
                  </Paper>
                </Card>

                {/* Color Settings for Preview B */}
                {selectedFeatures.hh && (
                  <Card 
                    elevation={0} 
                    sx={{ 
                      borderRadius: 3, 
                      border: '2px solid',
                      borderColor: 'orange',
                      '&:hover': {
                        borderColor: 'orange'
                      }
                    }}
                  >
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>Colors - Preview B</Typography>
                      <Stack spacing={3}>
                        <ColorPicker
                          label="Background Color"
                          value={formB.values.backgroundColor}
                          onChange={(e) => formB.setFieldValue('backgroundColor', e.target.value)}
                          helperText="Main background color of the popup"
                        />
                        <ColorPicker
                          label="Text Color"
                          value={formB.values.textColor}
                          onChange={(e) => formB.setFieldValue('textColor', e.target.value)}
                          helperText="Main text color"
                        />
                        <ColorPicker
                          label="Button Color"
                          value={formB.values.buttonColor}
                          onChange={(e) => formB.setFieldValue('buttonColor', e.target.value)}
                          helperText="Background color of the main button"
                        />
                        <ColorPicker
                          label="Button Text Color"
                          value={formB.values.buttonTextColor}
                          onChange={(e) => formB.setFieldValue('buttonTextColor', e.target.value)}
                          helperText="Text color of the main button"
                        />
                        <Divider />
                        <Box>
                          <Typography variant="subtitle2" gutterBottom>Border</Typography>
                          <Stack spacing={2}>
                            <ColorPicker
                              label="Border Color"
                              value={formB.values.borderColor}
                              onChange={(e) => formB.setFieldValue('borderColor', e.target.value)}
                              helperText="Color of the popup border"
                            />
                            <FormControl fullWidth>
                              <InputLabel>Border Width</InputLabel>
                              <Select
                                value={formB.values.borderWidth}
                                label="Border Width"
                                onChange={(e) => formB.setFieldValue('borderWidth', e.target.value)}
                              >
                                <MenuItem value="0">No Border</MenuItem>
                                <MenuItem value="1">Thin (1px)</MenuItem>
                                <MenuItem value="2">Medium (2px)</MenuItem>
                                <MenuItem value="3">Thick (3px)</MenuItem>
                              </Select>
                              <FormHelperText>Width of the popup border</FormHelperText>
                            </FormControl>
                          </Stack>
                        </Box>
                      </Stack>
                    </Paper>
                  </Card>
                )}
                {/* Domain Settings */}
                <Card 
                  elevation={0} 
                  sx={{ 
                    borderRadius: 3, 
                    border: '1px solid',
                    borderColor: 'grey.300',
                    '&:hover': {
                      borderColor: 'grey.400'
                    }
                  }}
                >
                  <Box sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Domain Settings
                    </Typography>
                    <Stack spacing={2}>
                      <TextField
                        label="Detected Domain"
                        value={form.values.settings.domain.detected || ''}
                        onChange={(e) => form.setFieldValue('settings.domain.detected', e.target.value)}
                        disabled
                        fullWidth
                        helperText="Automatically detected from the current page"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={form.values.settings.domain.override || false}
                            onChange={(e) => form.setFieldValue('settings.domain.override', e.target.checked)}
                          />
                        }
                        label="Override detected domain"
                      />
                      {form.values.settings.domain.override && (
                        <TextField
                          label="Manual Domain"
                          value={form.values.settings.domain.manual || ''}
                          onChange={(e) => form.setFieldValue('settings.domain.manual', e.target.value)}
                          fullWidth
                          error={!!form.errors?.settings?.domain?.manual}
                          helperText={form.errors?.settings?.domain?.manual || "Enter your domain manually"}
                        />
                      )}
                    </Stack>
                  </Box>
                </Card>
                {/* Form Fields */}
                <Card 
                  elevation={0} 
                  sx={{ 
                    borderRadius: 3, 
                    border: '1px solid',
                    borderColor: 'grey.300',
                    '&:hover': {
                      borderColor: 'grey.400'
                    }
                  }}
                >
                  <Box sx={{ p: 3 }}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                      <FormatListBulletedIcon color="primary" />
                      <Typography variant="h6" fontWeight="bold">
                        Form Fields
                      </Typography>
                    </Stack>
                    <Stack spacing={2}>
                      {Object.entries({
                        'Email': ['collectEmail', 'emailRequired'],
                        'Name': ['collectFirstName', 'firstNameRequired'],         // Changed from 'First Name'
                        'Last Name': ['collectLastName', 'lastNameRequired'],
                        'Phone': ['collectPhone', 'phoneRequired'],
                        'City': ['collectCity', 'cityRequired']
                      }).map(([label, [collectKey, requiredKey]]) => (
                        <Box key={collectKey}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={formFields[collectKey]}
                                onChange={handleFieldToggle(collectKey)}
                              />
                            }
                            label={label}
                          />
                          {formFields[collectKey] && (
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={formFields[requiredKey]}
                                  onChange={handleFieldToggle(requiredKey)}
                                  size="small"
                                />
                              }
                              label="Required"
                              sx={{ ml: 4 }}
                            />
                          )}
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                </Card>
                

                {/* Form Fields Section - Preview B */}
                {selectedFeatures.hh && (
                  <Card 
                    elevation={0} 
                    sx={{ 
                      borderRadius: 3, 
                      border: '2px solid',
                      borderColor: 'orange',
                      '&:hover': {
                        borderColor: 'orange'
                      }
                    }}
                  >
                    <Paper sx={{ p: 3 }}>
                      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                        <FormatListBulletedIcon color="primary" />
                        <Typography variant="h6" fontWeight="bold">
                          Form Fields - Preview B
                        </Typography>
                      </Stack>
                      <Stack spacing={2}>
                        {Object.entries(formFieldsB).map(([key]) => {
                          if (key.startsWith('collect')) {
                            const collectKey = key;
                            const requiredKey = key.replace('collect', '').toLowerCase() + 'Required';
                            const label = key.replace('collect', '').match(/[A-Z][a-z]+/g).join(' ');
                            
                            return (
                              <Box key={collectKey}>
                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={formFieldsB[collectKey]}
                                      onChange={handleFieldToggleB(collectKey)}
                                    />
                                  }
                                  label={`Collect ${label}`}
                                />
                                {formFieldsB[collectKey] && (
                                  <FormControlLabel
                                    control={
                                      <Switch
                                        checked={formFieldsB[requiredKey]}
                                        onChange={handleFieldToggleB(requiredKey)}
                                      />
                                    }
                                    label={`${label} Required`}
                                    sx={{ ml: 4 }}
                                  />
                                )}
                              </Box>
                            );
                          }
                          return null;
                        })}
                      </Stack>
                    </Paper>
                  </Card>
                )}
                {/* Features */}
                <Card 
                  elevation={0} 
                  sx={{ 
                    borderRadius: 3, 
                    border: '1px solid',
                    borderColor: 'grey.300',
                    '&:hover': {
                      borderColor: 'grey.400'
                    }
                  }}
                >
                  <Box sx={{ p: 3 }}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                      <SettingsIcon color="primary" />
                      <Typography variant="h6" fontWeight="bold">
                        Features & Settings
                      </Typography>
                    </Stack>
                    <Stack spacing={3}>
                      <FeatureSelector
                        selectedFeatures={selectedFeatures}
                        onChange={setSelectedFeatures}
                      />
                      <Divider />
                      <AdvancedSettings
                        settings={settings}
                        onChange={handleSettingsChange}
                      />
                    </Stack>
                  </Box>
                </Card>

                {/* A/B Testing */}
                <Card 
                  elevation={0} 
                  sx={{ 
                    borderRadius: 3, 
                    border: '2px solid',
                    borderColor: abTestingEnabled ? 'orange' : 'grey.300',
                    transition: 'border-color 0.3s ease',
                    '&:hover': {
                      borderColor: abTestingEnabled ? 'orange' : 'grey.400'
                    }
                  }}
                >
                  <Paper sx={{ 
                    p: 3,
                    bgcolor: 'background.paper'
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      mb: 2 
                    }}>
                      <Typography variant="h6" component="div" sx={{ 
                        color: abTestingEnabled ? 'warning.main' : 'text.primary',
                        fontWeight: 600
                      }}>
                        A/B Testing
                      </Typography>
                      <Tooltip title="Test different variants of your popup to optimize conversion">
                        <InfoIcon fontSize="small" color={abTestingEnabled ? "warning" : "action"} />
                      </Tooltip>
                    </Box>
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={abTestingEnabled}
                          onChange={(e) => {
                            setAbTestingEnabled(e.target.checked);
                          }}
                          color="warning"
                          sx={{
                            '& .MuiSwitch-track': {
                              opacity: 0.2
                            }
                          }}
                        />
                      }
                      label="Enable A/B Testing"
                    />

                    {abTestingEnabled && (
                      <Box sx={{ mt: 3 }}>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          gap: 1,
                          mb: 1
                        }}>
                          <Typography>Traffic Split (Variant A/B)</Typography>
                          <Tooltip title="Control how traffic is distributed between variants. For example, 60% means 60% of visitors will see Variant A, while 40% will see Variant B." arrow>
                            <InfoIcon 
                              fontSize="small" 
                              color="action"
                              sx={{ 
                                cursor: 'help',
                                '&:hover': { color: 'warning.main' }
                              }} 
                            />
                          </Tooltip>
                        </Box>
                        <Box sx={{ px: 2, mt: 2 }}>
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            mb: 1 
                          }}>
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                gap: 0.5
                              }}
                            >
                              Variant A
                            </Typography>
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                gap: 0.5
                              }}
                            >
                              Variant B
                            </Typography>
                          </Box>
                          <Slider
                            value={splitRatio}
                            onChange={(_, value) => setSplitRatio(value)}
                            valueLabelDisplay="on"
                            valueLabelFormat={(value) => `${value}% / ${100-value}%`}
                            step={5}
                            marks
                            min={0}
                            max={100}
                            sx={{
                              color: 'warning.main',
                              '& .MuiSlider-thumb': {
                                '&:hover, &.Mui-focusVisible': {
                                  boxShadow: '0 0 0 8px rgba(255, 152, 0, 0.16)'
                                }
                              },
                              '& .MuiSlider-valueLabel': {
                                backgroundColor: 'warning.main'
                              }
                            }}
                          />
                        </Box>
                      </Box>
                    )}
                  </Paper>
                </Card>

                {/* Embed Code */}
                {embedCode && (
                  <Card 
                    elevation={0} 
                    sx={{ 
                      borderRadius: 3, 
                      border: '1px solid',
                      borderColor: 'grey.300',
                      '&:hover': {
                        borderColor: 'grey.400'
                      }
                    }}
                  >
                    <Box sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Embed Code
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Copy and paste this code into your website to display the popup
                      </Typography>
                      <Box
                        component="pre"
                        sx={{
                          p: 2,
                          bgcolor: 'grey.100',
                          borderRadius: 1,
                          overflow: 'auto',
                          maxHeight: '200px',
                          '&:hover': {
                            bgcolor: 'grey.200'
                          }
                        }}
                      >
                        <code>{embedCode}</code>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Tooltip title="Copy to clipboard">
                          <IconButton onClick={copyEmbedCode} size="small">
                            <ContentCopyIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Card>
                )}
              </Stack>
            </Grid>

            {/* Preview */}
            <Grid item xs={12} md={5}>
              <Box sx={{ position: 'sticky', top: 24 }}>
                <Stack spacing={3}>
                  <Card 
                    elevation={0} 
                    sx={{ 
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    <Box sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Preview A
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Try it out! This is a fully interactive preview.
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                      <Box
                        sx={{
                          backgroundColor: form.values.backgroundColor,
                          borderRadius: 2,
                          p: 3,
                          transition: 'all 0.3s ease',
                          position: 'relative',
                          border: form.values.borderWidth !== '0' ? `${form.values.borderWidth}px solid ${form.values.borderColor}` : 'none'
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() => {
                            notifications.show({
                              title: '❌ Popup Closed',
                              message: 'This is how visitors can dismiss your popup',
                              color: 'blue',
                              withBorder: true,
                              autoClose: 2000
                            });
                          }}
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            color: form.values.textColor,
                            opacity: 0.7,
                            '&:hover': {
                              opacity: 1,
                              backgroundColor: 'rgba(0, 0, 0, 0.04)'
                            },
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                        <Stack spacing={2} alignItems="center" textAlign="center">
                          <Typography
                            variant="h5"
                            sx={{ 
                              color: form.values.textColor,
                              fontWeight: 'bold',
                              transition: 'color 0.3s ease'
                            }}
                          >
                            {form.values.title || "Join Our Newsletter"}
                          </Typography>
                          <Typography 
                            sx={{ 
                              color: form.values.textColor,
                              transition: 'color 0.3s ease'
                            }}
                          >
                            {form.values.description || "Stay updated with our latest news and special offers!"}
                          </Typography>
                          <Box
                            component="form"
                            onSubmit={handlePreviewSubmit}
                            sx={{ width: '100%', maxWidth: 300 }}
                          >
                            <Stack spacing={2}>
                              {formFields.collectFirstName && (
                                <TextField
                                  fullWidth
                                  size="small"
                                  placeholder="Name"
                                  required={formFields.firstNameRequired}
                                  value={previewForm.firstName}
                                  onChange={handlePreviewInputChange('firstName')}
                                  error={showPreviewValidation && formFields.firstNameRequired && !previewForm.firstName.trim()}
                                  helperText={showPreviewValidation && formFields.firstNameRequired && !previewForm.firstName.trim() ? "Name is required" : ""}
                                  sx={{
                                    backgroundColor: 'white',
                                    '& .MuiOutlinedInput-root': {
                                      borderRadius: 1.5
                                    }
                                  }}
                                />
                              )}
                              {formFields.collectLastName && (
                                <TextField
                                  fullWidth
                                  size="small"
                                  placeholder="Last Name"
                                  required={formFields.lastNameRequired}
                                  value={previewForm.lastName}
                                  onChange={handlePreviewInputChange('lastName')}
                                  error={showPreviewValidation && formFields.lastNameRequired && !previewForm.lastName.trim()}
                                  helperText={showPreviewValidation && formFields.lastNameRequired && !previewForm.lastName.trim() ? "Last name is required" : ""}
                                  sx={{
                                    backgroundColor: 'white',
                                    '& .MuiOutlinedInput-root': {
                                      borderRadius: 1.5
                                    }
                                  }}
                                />
                              )}
                              {formFields.collectPhone && (
                                <TextField
                                  fullWidth
                                  size="small"
                                  placeholder="Phone Number"
                                  required={formFields.phoneRequired}
                                  value={previewForm.phone}
                                  onChange={handlePreviewInputChange('phone')}
                                  error={showPreviewValidation && formFields.phoneRequired && !previewForm.phone.trim()}
                                  helperText={showPreviewValidation && formFields.phoneRequired && !previewForm.phone.trim() ? "Phone number is required" : ""}
                                  sx={{
                                    backgroundColor: 'white',
                                    '& .MuiOutlinedInput-root': {
                                      borderRadius: 1.5
                                    }
                                  }}
                                />
                              )}
                              {formFields.collectCity && (
                                <TextField
                                  fullWidth
                                  size="small"
                                  placeholder="City"
                                  required={formFields.cityRequired}
                                  value={previewForm.city}
                                  onChange={handlePreviewInputChange('city')}
                                  error={showPreviewValidation && formFields.cityRequired && !previewForm.city.trim()}
                                  helperText={showPreviewValidation && formFields.cityRequired && !previewForm.city.trim() ? "City is required" : ""}
                                  sx={{
                                    backgroundColor: 'white',
                                    '& .MuiOutlinedInput-root': {
                                      borderRadius: 1.5
                                    }
                                  }}
                                />
                              )}
                              {formFields.collectEmail && (
                                <TextField
                                  fullWidth
                                  placeholder="Enter your email"
                                  size="small"
                                  required={formFields.emailRequired}
                                  type="email"
                                  value={previewForm.email}
                                  onChange={handlePreviewInputChange('email')}
                                  error={showPreviewValidation && formFields.emailRequired && !previewForm.email.trim()}
                                  helperText={showPreviewValidation && formFields.emailRequired && !previewForm.email.trim() ? "Email is required" : ""}
                                  sx={{
                                    backgroundColor: 'white',
                                    '& .MuiOutlinedInput-root': {
                                      borderRadius: 1.5
                                    }
                                  }}
                                />
                              )}
                              <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                sx={{
                                  backgroundColor: form.values.buttonColor + ' !important',
                                  color: form.values.buttonTextColor + ' !important',
                                  '&:hover': {
                                    backgroundColor: form.values.buttonColor + '!important',
                                    filter: 'brightness(0.9)',
                                  },
                                  transition: 'all 0.3s ease'
                                }}
                              >
                                {form.values.buttonText || "Subscribe Now"}
                              </Button>
                            </Stack>
                          </Box>
                        </Stack>
                      </Box>
                    </Box>
                  </Card>

                  {/* Preview B */}
                  {selectedFeatures.hh && (
                    <Card 
                      elevation={0} 
                      sx={{ 
                        borderRadius: 3,
                        border: '2px solid',
                        borderColor: 'orange',
                        '&:hover': {
                          borderColor: 'orange'
                        }
                      }}
                    >
                      <Box sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          Preview B
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          A/B Testing variant. Try different styles and content!
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Box
                          sx={{
                            backgroundColor: formB.values.backgroundColor,
                            borderRadius: 2,
                            p: 3,
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            border: formB.values.borderWidth !== '0' ? `${formB.values.borderWidth}px solid ${formB.values.borderColor}` : 'none'
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={() => {
                              notifications.show({
                                title: '❌ Popup Closed',
                                message: 'This is how visitors can dismiss your popup',
                                color: 'blue',
                                withBorder: true,
                                autoClose: 2000
                              });
                            }}
                            sx={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              color: formB.values.textColor,
                              opacity: 0.7,
                              '&:hover': {
                                opacity: 1,
                                backgroundColor: 'rgba(0, 0, 0, 0.04)'
                              },
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                          <Stack spacing={2} alignItems="center" textAlign="center">
                            <Typography
                              variant="h5"
                              sx={{ 
                                color: formB.values.textColor,
                                fontWeight: 'bold',
                                transition: 'color 0.3s ease'
                              }}
                            >
                              {formB.values.title || "Join Our Newsletter"}
                            </Typography>
                            <Typography 
                              sx={{ 
                                color: formB.values.textColor,
                                transition: 'color 0.3s ease'
                              }}
                            >
                              {formB.values.description || "Stay updated with our latest news and special offers!"}
                            </Typography>
                            <Box
                              component="form"
                              onSubmit={(e) => handlePreviewSubmit(e, 'B')}
                              sx={{ width: '100%', maxWidth: 300 }}
                            >
                              <Stack spacing={2}>
                                {formFieldsB.collectFirstName && (
                                  <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Name"
                                    required={formFieldsB.firstNameRequired}
                                    value={previewFormB.firstName}
                                    onChange={handlePreviewInputChange('firstName', 'B')}
                                    error={showPreviewValidation && formFieldsB.firstNameRequired && !previewFormB.firstName.trim()}
                                    helperText={showPreviewValidation && formFieldsB.firstNameRequired && !previewFormB.firstName.trim() ? "Name is required" : ""}
                                    sx={{
                                      backgroundColor: 'white',
                                      '& .MuiOutlinedInput-root': {
                                        borderRadius: 1.5
                                      }
                                    }}
                                  />
                                )}
                                {formFieldsB.collectLastName && (
                                  <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Last Name"
                                    required={formFieldsB.lastNameRequired}
                                    value={previewFormB.lastName}
                                    onChange={handlePreviewInputChange('lastName', 'B')}
                                    error={showPreviewValidation && formFieldsB.lastNameRequired && !previewFormB.lastName.trim()}
                                    helperText={showPreviewValidation && formFieldsB.lastNameRequired && !previewFormB.lastName.trim() ? "Last name is required" : ""}
                                    sx={{
                                      backgroundColor: 'white',
                                      '& .MuiOutlinedInput-root': {
                                        borderRadius: 1.5
                                      }
                                    }}
                                  />
                                )}
                                {formFieldsB.collectPhone && (
                                  <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Phone Number"
                                    required={formFieldsB.phoneRequired}
                                    value={previewFormB.phone}
                                    onChange={handlePreviewInputChange('phone', 'B')}
                                    error={showPreviewValidation && formFieldsB.phoneRequired && !previewFormB.phone.trim()}
                                    helperText={showPreviewValidation && formFieldsB.phoneRequired && !previewFormB.phone.trim() ? "Phone number is required" : ""}
                                    sx={{
                                      backgroundColor: 'white',
                                      '& .MuiOutlinedInput-root': {
                                        borderRadius: 1.5
                                      }
                                    }}
                                  />
                                )}
                                {formFieldsB.collectCity && (
                                  <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="City"
                                    required={formFieldsB.cityRequired}
                                    value={previewFormB.city}
                                    onChange={handlePreviewInputChange('city', 'B')}
                                    error={showPreviewValidation && formFieldsB.cityRequired && !previewFormB.city.trim()}
                                    helperText={showPreviewValidation && formFieldsB.cityRequired && !previewFormB.city.trim() ? "City is required" : ""}
                                    sx={{
                                      backgroundColor: 'white',
                                      '& .MuiOutlinedInput-root': {
                                        borderRadius: 1.5
                                      }
                                    }}
                                  />
                                )}
                                {formFieldsB.collectEmail && (
                                  <TextField
                                    fullWidth
                                    placeholder="Enter your email"
                                    size="small"
                                    required={formFieldsB.emailRequired}
                                    type="email"
                                    value={previewFormB.email}
                                    onChange={handlePreviewInputChange('email', 'B')}
                                    error={showPreviewValidation && formFieldsB.emailRequired && !previewFormB.email.trim()}
                                    helperText={showPreviewValidation && formFieldsB.emailRequired && !previewFormB.email.trim() ? "Email is required" : ""}
                                    sx={{
                                      backgroundColor: 'white',
                                      '& .MuiOutlinedInput-root': {
                                        borderRadius: 1.5
                                      }
                                    }}
                                  />
                                )}
                                <Button
                                  type="submit"
                                  variant="contained"
                                  fullWidth
                                  sx={{
                                    backgroundColor: formB.values.buttonColor + ' !important',
                                    color: formB.values.buttonTextColor + ' !important',
                                    '&:hover': {
                                      backgroundColor: formB.values.buttonColor + '!important',
                                      filter: 'brightness(0.9)',
                                    },
                                    transition: 'all 0.3s ease'
                                  }}
                                >
                                  {formB.values.buttonText || "Subscribe Now"}
                                </Button>
                              </Stack>
                            </Box>
                          </Stack>
                        </Box>
                      </Box>
                    </Card>
                  )}
                </Stack>
              </Box>
            </Grid>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/dashboard')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={form.onSubmit(handleSubmit)}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Popup'}
              </Button>
            </Box>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}

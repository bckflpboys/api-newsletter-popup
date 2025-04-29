import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSession } from '@clerk/clerk-react';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { updatePopup, getPopups } from '../utils/api';
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
  CircularProgress
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Timer as TimerIcon,
  Settings as SettingsIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  FormatListBulleted as FormatListBulletedIcon
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

export default function EditPopup() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedThemeId, setSelectedThemeId] = useState(null);
  const [selectedThemeBId, setSelectedThemeBId] = useState(null);
  const [popupData, setPopupData] = useState(null);
  const [embedCode, setEmbedCode] = useState('');
  const [showPreviewValidation, setShowPreviewValidation] = useState(false);
  const [formFields, setFormFields] = useState({
    collectEmail: false,
    emailRequired: false,
    collectFirstName: false,
    firstNameRequired: false,
    collectLastName: false,
    lastNameRequired: false,
    collectPhone: false,
    phoneRequired: false,
    collectCity: false,
    cityRequired: false
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
    }
  });

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

  const [formBState, setFormBState] = useState({
    backgroundColor: '#ffffff',
    textColor: '#000000',
    buttonColor: '#007bff',
    buttonTextColor: '#ffffff',
    borderColor: '#e0e0e0',
    borderWidth: '0',
    backgroundStyle: {},
    themeId: null
  });

  const [abTestingEnabled, setAbTestingEnabled] = useState(false);
  const [splitRatio, setSplitRatio] = useState(50);
  const [variantA, setVariantA] = useState({
    theme: {
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
    theme: {
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

  useEffect(() => {
    if (popupData?.themeB) {
      setFormBState({
        backgroundColor: popupData.themeB.backgroundColor || '#ffffff',
        textColor: popupData.themeB.textColor || '#000000',
        buttonColor: popupData.themeB.buttonColor || '#007bff',
        buttonTextColor: popupData.themeB.buttonTextColor || '#ffffff',
        borderColor: popupData.themeB.borderColor || '#e0e0e0',
        borderWidth: popupData.themeB.borderWidth || '0',
        backgroundStyle: popupData.themeB.backgroundStyle || {},
        themeId: popupData.themeB.id || null
      });
      setSelectedThemeBId(popupData.themeB.id || null);
    }
  }, [popupData]);

  useEffect(() => {
    if (popupData?.formFieldsB) {
      setFormFieldsB({
        collectEmail: popupData.formFieldsB.collectEmail ?? true,
        emailRequired: popupData.formFieldsB.emailRequired ?? true,
        collectFirstName: popupData.formFieldsB.collectName ?? false,  // Changed from collectFirstName
        firstNameRequired: popupData.formFieldsB.nameRequired ?? false,  // Changed from firstNameRequired
        collectLastName: popupData.formFieldsB.collectLastName ?? false,
        lastNameRequired: popupData.formFieldsB.lastNameRequired ?? false,
        collectPhone: popupData.formFieldsB.collectPhone ?? false,
        phoneRequired: popupData.formFieldsB.phoneRequired ?? false,
        collectCity: popupData.formFieldsB.collectCity ?? false,
        cityRequired: popupData.formFieldsB.cityRequired ?? false
      });
    }
  }, [popupData]);

  useEffect(() => {
    if (popupData?.ab_testing) {
      setAbTestingEnabled(popupData.ab_testing.enabled);
      setSplitRatio(popupData.ab_testing.split);
      
      // Load variant A data
      if (popupData.ab_testing.variants?.A) {
        const variantA = popupData.ab_testing.variants.A;
        form.setValues({
          title: variantA.title || '',
          description: variantA.description || '',
          buttonText: variantA.buttonText || '',
          backgroundColor: variantA.backgroundColor || '#FFFFFF',
          textColor: variantA.textColor || '#000000',
          buttonColor: variantA.buttonColor || '#2196F3',
          buttonTextColor: variantA.buttonTextColor || '#FFFFFF',
          borderColor: variantA.borderColor || '#e0e0e0',
          borderWidth: variantA.borderWidth || '0'
        });
      }
      
      // Load variant B data
      if (popupData.ab_testing.variants?.B) {
        const variantB = popupData.ab_testing.variants.B;
        formB.setValues({
          title: variantB.title || '',
          description: variantB.description || '',
          buttonText: variantB.buttonText || '',
          backgroundColor: variantB.backgroundColor || '#FFFFFF',
          textColor: variantB.textColor || '#000000',
          buttonColor: variantB.buttonColor || '#2196F3',
          buttonTextColor: variantB.buttonTextColor || '#FFFFFF',
          borderColor: variantB.borderColor || '#e0e0e0',
          borderWidth: variantB.borderWidth || '0'
        });
      }
    }
  }, [popupData]);

  useEffect(() => {
    const abTestingFeature = selectedFeatures.hh;
    setAbTestingEnabled(abTestingFeature);
  }, [selectedFeatures]);

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

  const handleFormFieldToggle = (field) => (event) => {
    const updatedFields = { ...formFields };
    updatedFields[field] = event.target.checked;
    
    // If we're turning off collection of a field, also turn off its required status
    if (field.startsWith('collect') && !event.target.checked) {
      const requiredField = field.replace('collect', '') + 'Required';
      updatedFields[requiredField] = false;
    }
    
    setFormFields(updatedFields);
  };

  const handleFormFieldToggleB = (field) => (event) => {
    setFormFieldsB(prev => ({
      ...prev,
      [field]: event.target.checked,
      [field.replace('collect', '').toLowerCase() + 'Required']: event.target.checked ? prev[field.replace('collect', '').toLowerCase() + 'Required'] : false
    }));
  };

  const handleRequiredToggle = (field) => (event) => {
    setFormFields(prev => {
      // Special handling for email and phone required toggles
      if (field === 'emailRequired' || field === 'phoneRequired') {
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
      }

      return {
        ...prev,
        [field]: event.target.checked
      };
    });
  };

  const handleRequiredToggleB = (field) => (event) => {
    setFormFieldsB(prev => ({
      ...prev,
      [field]: event.target.checked
    }));
  };

  const form = useForm({
    initialValues: {
      name: '',
      title: '',
      description: '',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      buttonColor: '#007bff',
      buttonTextColor: '#ffffff',
      borderColor: '#e0e0e0',
      borderWidth: '0',
      backgroundStyle: {},
      settings: {
        domain: {
          detected: '',
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
        }
      }
    }
  });

  const formB = useForm({
    initialValues: {
      title: '',
      description: '',
      buttonText: '',
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

  const handleSettingsChange = (newSettings) => {
    setSettings(newSettings);
    // Sync the display delay with the trigger value when it changes
    if (newSettings.trigger.type === 'time') {
      form.setFieldValue('displayDelay', parseInt(newSettings.trigger.value));
    }
  };

  const handleSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      const token = await session.getToken();

      // Prepare update data
      const updateData = {
        ...values,
        formFields: {
          collectEmail: formFields.collectEmail,
          emailRequired: formFields.emailRequired,
          collectName: formFields.collectFirstName,
          nameRequired: formFields.firstNameRequired,
          collectLastName: formFields.collectLastName,
          lastNameRequired: formFields.lastNameRequired,
          collectPhone: formFields.collectPhone,
          phoneRequired: formFields.phoneRequired,
          collectCity: formFields.collectCity,
          cityRequired: formFields.cityRequired
        },
        ab_testing: {
          enabled: abTestingEnabled,
          split: splitRatio,
          variants: {
            A: {
              theme: {
                backgroundColor: values.backgroundColor,
                textColor: values.textColor,
                buttonColor: values.buttonColor,
                buttonTextColor: values.buttonTextColor,
                borderColor: values.borderColor,
                borderWidth: values.borderWidth
              },
              content: {
                title: values.title,
                description: values.description,
                buttonText: values.buttonText
              }
            },
            B: abTestingEnabled ? {
              theme: {
                backgroundColor: formBState.backgroundColor,
                textColor: formBState.textColor,
                buttonColor: formBState.buttonColor,
                buttonTextColor: formBState.buttonTextColor,
                borderColor: formBState.borderColor,
                borderWidth: formBState.borderWidth
              },
              content: {
                title: formB.values.title,
                description: formB.values.description,
                buttonText: formB.values.buttonText
              }
            } : undefined
          }
        },
        features: Object.entries(selectedFeatures)
          .filter(([_, enabled]) => enabled)
          .map(([code]) => code)
          .join('.'),
        settings: {
          frequency: {
            show_once: settings.frequency.show_once,
            cooldown: settings.frequency.cooldown
          },
          trigger: {
            type: settings.trigger.type,
            value: settings.trigger.value
          },
          targeting: {
            devices: settings.targeting.devices,
            countries: settings.targeting.countries,
            languages: settings.targeting.languages
          },
          domain: {
            detected: values.settings.domain.detected,
            override: values.settings.domain.override,
            manual: values.settings.domain.manual
          }
        },
        themeId: selectedThemeId,
        themeB: selectedFeatures.hh ? {
          id: selectedThemeBId,
          title: formB.values.title,
          description: formB.values.description,
          buttonText: formB.values.buttonText,
          backgroundColor: formBState.backgroundColor,
          textColor: formBState.textColor,
          buttonColor: formBState.buttonColor,
          buttonTextColor: formBState.buttonTextColor,
          borderColor: formBState.borderColor,
          borderWidth: formBState.borderWidth,
          backgroundStyle: formBState.backgroundStyle
        } : undefined
      };

      console.log('Updating popup with form fields:', updateData.formFields);
      let response = await updatePopup(token, id, updateData);
      console.log('Update response:', response);

      // If the server didn't preserve collectCity, try updating again
      if (response.status === 'success' && 
          updateData.formFields.collectCity === true && 
          response.data.formFields.collectCity === false) {
        console.log('Server did not preserve collectCity, retrying update...');
        
        // Wait a brief moment before retrying
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Try update again
        response = await updatePopup(token, id, updateData);
        console.log('Retry update response:', response);
      }

      if (response.status === 'success') {
        notifications.show({
          title: '✨ Success!',
          message: 'Your popup has been updated successfully.',
          color: 'green'
        });

        // Refresh the form fields from the server response
        setFormFields({
          collectEmail: response.data.formFields.collectEmail || false,
          emailRequired: response.data.formFields.emailRequired || false,
          collectFirstName: response.data.formFields.collectName || false,  // Changed from collectFirstName
          firstNameRequired: response.data.formFields.nameRequired || false,  // Changed from firstNameRequired
          collectLastName: response.data.formFields.collectLastName || false,
          lastNameRequired: response.data.formFields.lastNameRequired || false,
          collectPhone: response.data.formFields.collectPhone || false,
          phoneRequired: response.data.formFields.phoneRequired || false,
          collectCity: response.data.formFields.collectCity || false,
          cityRequired: response.data.formFields.cityRequired || false
        });

        setTimeout(() => {
          navigate('/dashboard', { state: { activeTab: 1 } });
        }, 1500);
      }
    } catch (error) {
      notifications.show({
        title: '❌ Error',
        message: error.message || 'Failed to update popup',
        color: 'red'
      });
    } finally {
      setIsSubmitting(false);
    }
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
    if (variant === 'A') {
      setPreviewForm(prev => ({
        ...prev,
        [field]: e.target.value || ''  // Ensure empty string if undefined
      }));
    } else {
      setPreviewFormB(prev => ({
        ...prev,
        [field]: e.target.value || ''  // Ensure empty string if undefined
      }));
    }
  };

  useEffect(() => {
    const loadPopup = async () => {
      try {
        setLoading(true);
        const token = await session.getToken();
        const response = await getPopups(token);
        const popup = response.find(p => p._id === id);
        
        if (popup) {
          setPopupData(popup);
          // Properly initialize settings with popup data
          setSettings(prev => ({
            ...prev,
            trigger: popup.settings?.trigger || { type: 'time', value: '7' },
            frequency: popup.settings?.frequency || { show_once: false, cooldown: '24h' },
            targeting: {
              devices: popup.settings?.targeting?.devices || [],
              countries: popup.settings?.targeting?.countries || [],
              languages: popup.settings?.targeting?.languages || []
            }
          }));
        }
      } catch (error) {
        notifications.show({
          title: 'Error',
          message: 'Failed to load popup data',
          color: 'red'
        });
      } finally {
        setLoading(false);
      }
    };

    if (session && id) {
      loadPopup();
    }
  }, [session, id]);

  useEffect(() => {
    if (popupData) {
      // Set form values for theme A
      form.setValues({
        ...form.values,
        name: popupData.name || '',
        title: popupData.title || '',
        description: popupData.description || '',
        buttonText: popupData.buttonText || '',
        backgroundColor: popupData.backgroundColor || '#ffffff',
        textColor: popupData.textColor || '#000000',
        buttonColor: popupData.buttonColor || '#007bff',
        buttonTextColor: popupData.buttonTextColor || '#ffffff',
        borderColor: popupData.borderColor || '#e0e0e0',
        borderWidth: popupData.borderWidth || '0',
        backgroundStyle: popupData.backgroundStyle || {},
        settings: popupData.settings || form.values.settings
      });
      setSelectedThemeId(popupData.themeId || null);

      // Set form values for theme B
      if (popupData.themeB) {
        formB.setValues({
          title: popupData.themeB.title || '',
          description: popupData.themeB.description || '',
          buttonText: popupData.themeB.buttonText || '',
          backgroundColor: popupData.themeB.backgroundColor || '#ffffff',
          textColor: popupData.themeB.textColor || '#000000',
          buttonColor: popupData.themeB.buttonColor || '#007bff',
          buttonTextColor: popupData.themeB.buttonTextColor || '#ffffff',
          borderColor: popupData.themeB.borderColor || '#e0e0e0',
          borderWidth: popupData.themeB.borderWidth || '0',
          backgroundStyle: popupData.themeB.backgroundStyle || {}
        });
        setFormBState({
          backgroundColor: popupData.themeB.backgroundColor || '#ffffff',
          textColor: popupData.themeB.textColor || '#000000',
          buttonColor: popupData.themeB.buttonColor || '#007bff',
          buttonTextColor: popupData.themeB.buttonTextColor || '#ffffff',
          borderColor: popupData.themeB.borderColor || '#e0e0e0',
          borderWidth: popupData.themeB.borderWidth || '0',
          backgroundStyle: popupData.themeB.backgroundStyle || {},
          themeId: popupData.themeB.id || null
        });
        setSelectedThemeBId(popupData.themeB.id || null);
      }

      // Set form fields
      if (popupData.formFields) {
        setFormFields({
          collectEmail: popupData.formFields.collectEmail || false,
          emailRequired: popupData.formFields.emailRequired || false,
          collectFirstName: popupData.formFields.collectName || false,
          firstNameRequired: popupData.formFields.nameRequired || false,
          collectLastName: popupData.formFields.collectLastName || false,
          lastNameRequired: popupData.formFields.lastNameRequired || false,
          collectPhone: popupData.formFields.collectPhone || false,
          phoneRequired: popupData.formFields.phoneRequired || false,
          collectCity: popupData.formFields.collectCity || false,
          cityRequired: popupData.formFields.cityRequired || false
        });
      }

      // Set form fields B
      if (popupData.formFieldsB) {
        setFormFieldsB({
          collectEmail: popupData.formFieldsB.collectEmail || false,
          emailRequired: popupData.formFieldsB.emailRequired || false,
          collectFirstName: popupData.formFieldsB.collectName || false,
          firstNameRequired: popupData.formFieldsB.nameRequired || false,
          collectLastName: popupData.formFieldsB.collectLastName || false,
          lastNameRequired: popupData.formFieldsB.lastNameRequired || false,
          collectPhone: popupData.formFieldsB.collectPhone || false,
          phoneRequired: popupData.formFieldsB.phoneRequired || false,
          collectCity: popupData.formFieldsB.collectCity || false,
          cityRequired: popupData.formFieldsB.cityRequired || false
        });
      }

      // Set features
      if (popupData.features) {
        const features = popupData.features.split('.').reduce((acc, code) => ({
          ...acc,
          [code]: true
        }), {
          aa: false,
          bb: false,
          cc: false,
          dd: false,
          ee: false,
          ff: false,
          gg: false,
          hh: false,
          ii: false,
          jj: false,
          kk: false,
          ll: false
        });
        setSelectedFeatures(features);
      }

      // Set settings
      if (popupData.settings) {
        setSettings(popupData.settings);
      }
    }
  }, [popupData]);

  const handleAbTestingToggle = (enabled) => {
    setAbTestingEnabled(enabled);
    setSelectedFeatures(prev => ({ ...prev, hh: enabled }));
  };

  // Add loading state check
  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: 'background.default' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

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
              Update Popup
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
                    onSelectTheme={(theme) => {
                      setFormBState(prev => ({
                        ...prev,
                        backgroundColor: theme.backgroundColor,
                        textColor: theme.textColor,
                        buttonColor: theme.buttonColor,
                        buttonTextColor: theme.buttonTextColor,
                        borderColor: theme.borderColor || '#e0e0e0',
                        borderWidth: theme.borderWidth || '0',
                        backgroundStyle: theme.backgroundStyle || {},
                        themeId: theme.id
                      }));
                      setSelectedThemeBId(theme.id);
                      notifications.show({
                        title: '🎨 Theme B Applied',
                        message: `Applied theme B: ${theme.name}`,
                        color: 'orange',
                        withBorder: true,
                        autoClose: 2000
                      });
                    }}
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
                              value={form.values.borderWidth || '0'}
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

                {/* Color Settings for Preview B - Only show when A/B Testing is enabled */}
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
                          value={formBState.backgroundColor}
                          onChange={(e) => setFormBState(prev => ({ ...prev, backgroundColor: e.target.value }))}
                          helperText="Main background color of the popup"
                        />
                        <ColorPicker
                          label="Text Color"
                          value={formBState.textColor}
                          onChange={(e) => setFormBState(prev => ({ ...prev, textColor: e.target.value }))}
                          helperText="Main text color"
                        />
                        <ColorPicker
                          label="Button Color"
                          value={formBState.buttonColor}
                          onChange={(e) => setFormBState(prev => ({ ...prev, buttonColor: e.target.value }))}
                          helperText="Background color of the main button"
                        />
                        <ColorPicker
                          label="Button Text Color"
                          value={formBState.buttonTextColor}
                          onChange={(e) => setFormBState(prev => ({ ...prev, buttonTextColor: e.target.value }))}
                          helperText="Text color of the main button"
                        />
                        <Divider />
                        <Box>
                          <Typography variant="subtitle2" gutterBottom>Border</Typography>
                          <Stack spacing={2}>
                            <ColorPicker
                              label="Border Color"
                              value={formBState.borderColor}
                              onChange={(e) => setFormBState(prev => ({ ...prev, borderColor: e.target.value }))}
                              helperText="Color of the popup border"
                            />
                            <FormControl fullWidth>
                              <InputLabel>Border Width</InputLabel>
                              <Select
                                value={formBState.borderWidth || '0'}
                                label="Border Width"
                                onChange={(e) => setFormBState(prev => ({ ...prev, borderWidth: e.target.value }))}
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
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Domain Settings
                    </Typography>
                    <Stack spacing={2}>
                      <TextField
                        label="Detected Domain"
                        value={form.values.settings.domain.detected}
                        disabled
                        fullWidth
                        helperText="Automatically detected from the current page"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={form.values.settings.domain.override}
                            onChange={(e) => form.setFieldValue('settings.domain.override', e.target.checked)}
                          />
                        }
                        label="Override Domain"
                      />
                      {form.values.settings.domain.override && (
                        <TextField
                          label="Manual Domain"
                          value={form.values.settings.domain.manual}
                          onChange={(e) => form.setFieldValue('settings.domain.manual', e.target.value)}
                          fullWidth
                          helperText="Enter the domain where this popup will be displayed (e.g., example.com)"
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
                        'First Name': ['collectFirstName', 'firstNameRequired'],
                        'Last Name': ['collectLastName', 'lastNameRequired'],
                        'Phone': ['collectPhone', 'phoneRequired'],
                        'City': ['collectCity', 'cityRequired']
                      }).map(([label, [collectKey, requiredKey]]) => (
                        <Box key={collectKey}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={formFields[collectKey] || false}
                                onChange={handleFormFieldToggle(collectKey)}
                              />
                            }
                            label={label}
                          />
                          {formFields[collectKey] && (
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={formFields[requiredKey] || false}
                                  onChange={handleRequiredToggle(requiredKey)}
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
                        {Object.entries({
                          'Email': ['collectEmail', 'emailRequired'],
                          'First Name': ['collectFirstName', 'firstNameRequired'],
                          'Last Name': ['collectLastName', 'lastNameRequired'],
                          'Phone': ['collectPhone', 'phoneRequired'],
                          'City': ['collectCity', 'cityRequired']
                        }).map(([label, [collectKey, requiredKey]]) => (
                          <Box key={collectKey}>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={formFieldsB[collectKey] || false}
                                  onChange={handleFormFieldToggleB(collectKey)}
                                />
                              }
                              label={label}
                            />
                            {formFieldsB[collectKey] && (
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={formFieldsB[requiredKey] || false}
                                    onChange={handleRequiredToggleB(requiredKey)}
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

                {/* A/B Testing Card */}
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
                          onChange={(e) => handleAbTestingToggle(e.target.checked)}
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
                      <TextField
                        value={embedCode}
                        multiline
                        rows={4}
                        fullWidth
                        InputProps={{
                          readOnly: true,
                        }}
                      />
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
                              {formFields.collectEmail && (
                                <TextField
                                  fullWidth
                                  size="small"
                                  placeholder="Email"
                                  required={formFields.emailRequired}
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
                              {formFields.collectFirstName && (
                                <TextField
                                  fullWidth
                                  size="small"
                                  placeholder="First Name"
                                  required={formFields.firstNameRequired}
                                  value={previewForm.firstName}
                                  onChange={handlePreviewInputChange('firstName')}
                                  error={showPreviewValidation && formFields.firstNameRequired && !previewForm.firstName.trim()}
                                  helperText={showPreviewValidation && formFields.firstNameRequired && !previewForm.firstName.trim() ? "First name is required" : ""}
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
                            backgroundColor: formBState.backgroundColor,
                            borderRadius: 2,
                            p: 3,
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            border: formBState.borderWidth !== '0' ? `${formBState.borderWidth}px solid ${formBState.borderColor}` : 'none'
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
                              color: formBState.textColor,
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
                                color: formBState.textColor,
                                fontWeight: 'bold',
                                transition: 'color 0.3s ease'
                              }}
                            >
                              {formB.values.title || "Join Our Newsletter"}
                            </Typography>
                            <Typography 
                              sx={{ 
                                color: formBState.textColor,
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
                                {formFieldsB.collectEmail && (
                                  <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Email"
                                    required={formFieldsB.emailRequired}
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
                                {formFieldsB.collectFirstName && (
                                  <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="First Name"
                                    required={formFieldsB.firstNameRequired}
                                    value={previewFormB.firstName}
                                    onChange={handlePreviewInputChange('firstName', 'B')}
                                    error={showPreviewValidation && formFieldsB.firstNameRequired && !previewFormB.firstName.trim()}
                                    helperText={showPreviewValidation && formFieldsB.firstNameRequired && !previewFormB.firstName.trim() ? "First name is required" : ""}
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
                                <Button
                                  type="submit"
                                  variant="contained"
                                  fullWidth
                                  sx={{
                                    backgroundColor: formBState.buttonColor + ' !important',
                                    color: formBState.buttonTextColor + ' !important',
                                    '&:hover': {
                                      backgroundColor: formBState.buttonColor + '!important',
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
                {isSubmitting ? 'Creating...' : 'Update Popup'}
              </Button>
            </Box>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}

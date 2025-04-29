import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Divider,
  Switch,
  TextField,
  Chip,
  FormControlLabel,
  FormHelperText,
  Slider
} from '@mui/material';

export default function AdvancedSettings({ settings = {}, onChange }) {
  // Initialize default settings if not provided
  const defaultSettings = {
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
  };

  // Merge provided settings with defaults
  const mergedSettings = {
    ...defaultSettings,
    ...settings,
    trigger: { ...defaultSettings.trigger, ...settings?.trigger },
    frequency: { ...defaultSettings.frequency, ...settings?.frequency },
    targeting: { ...defaultSettings.targeting, ...settings?.targeting },
    display: { ...defaultSettings.display, ...settings?.display }
  };

  // Only set default on first mount, not when settings change
  useEffect(() => {
    // Only set if trigger type is not set at all
    if (!mergedSettings.trigger.type) {
      onChange({
        ...mergedSettings,
        trigger: {
          ...mergedSettings.trigger,
          type: 'time',
          value: '7'
        }
      });
    }
  }, []); // Empty dependency array means it only runs once on mount

  const handleChange = (section, field, value) => {
    onChange({
      ...mergedSettings,
      [section]: {
        ...mergedSettings[section],
        [field]: value
      }
    });
  };

  const handleArrayChange = (section, field, value) => {
    onChange({
      ...mergedSettings,
      [section]: {
        ...mergedSettings[section],
        [field]: value.split(',').map(item => item.trim()).filter(Boolean)
      }
    });
  };

  const handleSettingChange = (section, value) => {
    onChange({
      ...mergedSettings,
      [section]: value
    });
  };

  return (
    <Paper 
      sx={{ 
        p: 3,
        border: '1px solid',
        borderColor: 'grey.300',
        '&:hover': {
          borderColor: 'grey.400'
        }
      }}
    >
      <Typography variant="h6" gutterBottom>
        Advanced Settings
      </Typography>
      <Divider sx={{ my: 2 }} />

      {/* Trigger Settings */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
          Trigger Settings
        </Typography>
        <Stack spacing={2}>
          <FormControl fullWidth>
            <InputLabel>Trigger Type</InputLabel>
            <Select
              value={mergedSettings.trigger.type}
              label="Trigger Type"
              onChange={(e) => handleSettingChange('trigger', {
                ...mergedSettings.trigger,
                type: e.target.value,
                value: e.target.value === 'time' ? '0' : '50'
              })}
            >
              <MenuItem value="time">Time Delay</MenuItem>
              <MenuItem value="scroll">Scroll Position</MenuItem>
            </Select>
          </FormControl>

          {mergedSettings.trigger.type === 'time' && (
            <Box sx={{ mt: 2 }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ minWidth: 65 }}>
                  {mergedSettings.trigger.value === '0' ? 'Immediate' : `${mergedSettings.trigger.value}s delay`}
                </Typography>
                <Slider
                  value={parseInt(mergedSettings.trigger.value)}
                  onChange={(_, newValue) => handleSettingChange('trigger', {
                    ...mergedSettings.trigger,
                    value: newValue.toString()
                  })}
                  min={0}
                  max={30}
                  marks={[
                    { value: 0, label: '0s' },
                    { value: 15, label: '15s' },
                    { value: 30, label: '30s' }
                  ]}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}s`}
                />
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                Set how long to wait before showing the popup
              </Typography>
            </Box>
          )}

          {mergedSettings.trigger.type === 'scroll' && (
            <Box sx={{ mt: 2 }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ minWidth: 65 }}>
                  {mergedSettings.trigger.value}% scroll
                </Typography>
                <Slider
                  value={parseInt(mergedSettings.trigger.value)}
                  onChange={(_, newValue) => handleSettingChange('trigger', {
                    ...mergedSettings.trigger,
                    value: newValue.toString()
                  })}
                  min={0}
                  max={100}
                  marks={[
                    { value: 0, label: 'Top' },
                    { value: 50, label: '50%' },
                    { value: 100, label: 'Bottom' }
                  ]}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}%`}
                />
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                Show popup when user scrolls to this position
              </Typography>
            </Box>
          )}
        </Stack>
      </Box>

      {/* Frequency Settings */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom>
          Frequency Settings
        </Typography>
        <Stack spacing={2}>
          <FormControlLabel
            control={
              <Switch
                checked={mergedSettings.frequency.show_once}
                onChange={(e) => handleSettingChange('frequency', {
                  ...mergedSettings.frequency,
                  show_once: e.target.checked,
                  // Reset cooldown when turning on show_once since it won't be needed
                  cooldown: e.target.checked ? '0' : mergedSettings.frequency.cooldown
                })}
              />
            }
            label="Show Only Once"
          />
          <FormControl 
            fullWidth 
            size="small" 
            sx={{ mt: 2 }}
            disabled={mergedSettings.frequency.show_once}
          >
            <InputLabel>Cooldown Period</InputLabel>
            <Select
              value={mergedSettings.frequency.cooldown}
              label="Cooldown Period"
              onChange={(e) => handleSettingChange('frequency', {
                ...mergedSettings.frequency,
                cooldown: e.target.value
              })}
            >
              <MenuItem value="1h">1 Hour</MenuItem>
              <MenuItem value="24h">24 Hours</MenuItem>
              <MenuItem value="7d">7 Days</MenuItem>
              <MenuItem value="30d">30 Days</MenuItem>
              <MenuItem value="forever">Forever</MenuItem>
            </Select>
            <FormHelperText>
              {mergedSettings.frequency.show_once 
                ? "Cooldown not needed when showing only once" 
                : "How long to wait before showing the popup again"}
            </FormHelperText>
          </FormControl>
        </Stack>
      </Box>

      {/* Targeting Settings */}
      <Box>
        <Typography variant="subtitle1" gutterBottom>
          Targeting Settings
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Target Devices"
            helperText="Comma-separated list (e.g., desktop, mobile, tablet)"
            value={mergedSettings.targeting.devices.join(', ')}
            onChange={(e) => handleArrayChange('targeting', 'devices', e.target.value)}
            fullWidth
          />
          
          <TextField
            label="Target Countries"
            helperText="Comma-separated list of country codes (e.g., US, UK, CA)"
            value={mergedSettings.targeting.countries.join(', ')}
            onChange={(e) => handleArrayChange('targeting', 'countries', e.target.value)}
            fullWidth
          />
          
          <TextField
            label="Target Languages"
            helperText="Comma-separated list of language codes (e.g., en, es, fr)"
            value={mergedSettings.targeting.languages.join(', ')}
            onChange={(e) => handleArrayChange('targeting', 'languages', e.target.value)}
            fullWidth
          />
        </Stack>
      </Box>
    </Paper>
  );
}

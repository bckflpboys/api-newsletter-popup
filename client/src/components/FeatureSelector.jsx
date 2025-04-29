import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Switch,
  Stack,
  Divider,
  Tooltip,
  IconButton,
  FormControlLabel
} from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';

const features = {
  aa: {
    name: 'Domain Scanning',
    description: 'Track which domains are using your popup'
  },
  bb: {
    name: 'Trigger Controls',
    description: 'Control when and how your popup appears'
  },
  cc: {
    name: 'Popup Counter',
    description: 'Track how many times your popup is shown'
  },
  dd: {
    name: 'Dismissal Tracking',
    description: 'Track when users dismiss your popup'
  },
  ee: {
    name: 'Submission Tracking',
    description: 'Track form submissions and conversion rates'
  },
  ff: {
    name: 'Database Operations',
    description: 'Store and manage subscriber data'
  },
  gg: {
    name: 'Geolocation',
    description: 'Target users based on location'
  },
  hh: {
    name: 'A/B Testing',
    description: 'Test different popup variants'
  },
  ii: {
    name: 'Analytics',
    description: 'Detailed performance analytics'
  },
  jj: {
    name: 'Exit Intent',
    description: 'Show popup when user is about to leave'
  },
  kk: {
    name: 'Device Targeting',
    description: 'Target specific devices'
  },
  ll: {
    name: 'Real-time Dashboard',
    description: 'Monitor performance in real-time'
  }
};

export default function FeatureSelector({ selectedFeatures, onChange }) {
  const handleToggle = (featureCode) => {
    onChange({
      ...selectedFeatures,
      [featureCode]: !selectedFeatures[featureCode]
    });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Features
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Select the features you want to enable for your popup
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Stack spacing={2}>
        {Object.entries(features).map(([code, feature]) => (
          <Box
            key={code}
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="subtitle2">
                  {feature.name}
                </Typography>
                <Tooltip title={feature.description} arrow>
                  <IconButton size="small">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
              <Typography variant="caption" color="text.secondary">
                {feature.description}
              </Typography>
            </Box>
            <Switch
              checked={selectedFeatures[code] || false}
              onChange={() => handleToggle(code)}
              inputProps={{ 'aria-label': feature.name }}
              sx={code === 'hh' ? {
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: 'orange',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 165, 0, 0.08)',
                  },
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: 'orange',
                },
              } : {}}
            />
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}

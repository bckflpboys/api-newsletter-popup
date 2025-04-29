import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Alert,
  Tooltip,
  Card,
  CardContent,
  Stack,
  Chip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Notifications,
  Email,
  Security,
  Backup,
  Storage,
  Language,
  CloudUpload,
  Info,
  Delete,
  Save,
  MoreVert,
  Check,
  Warning,
  Error,
  RestartAlt,
  CloudDownload,
  History
} from '@mui/icons-material';

const Settings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    securityAlerts: true,
    autoBackup: true,
    maintenanceMode: false,
    debugMode: false,
    apiKey: '******************',
    backupFrequency: 'daily',
    maxStorageSize: '1000',
    defaultLanguage: 'English (US)',
    timezone: 'UTC+02:00',
    retentionPeriod: '30 days'
  });

  const [showApiKey, setShowApiKey] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState(null);

  const handleToggle = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    setSaveStatus({ type: 'info', message: 'Changes not saved' });
  };

  const handleInputChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
    setSaveStatus({ type: 'info', message: 'Changes not saved' });
  };

  const handleSave = () => {
    setSaveStatus({ type: 'success', message: 'Settings saved successfully!' });
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const backupHistory = [
    { date: '2024-12-19', size: '245 MB', status: 'success' },
    { date: '2024-12-18', size: '242 MB', status: 'success' },
    { date: '2024-12-17', size: '240 MB', status: 'warning' }
  ];

  const settingSections = [
    {
      title: 'General Settings',
      icon: <Language />,
      color: '#2563eb',
      settings: [
        {
          name: 'defaultLanguage',
          label: 'System Language',
          description: 'Default language for the system interface',
          type: 'select',
          options: ['English (US)', 'Spanish', 'French', 'German']
        },
        {
          name: 'timezone',
          label: 'Time Zone',
          description: 'System default time zone',
          type: 'text'
        }
      ]
    },
    {
      title: 'Notifications',
      icon: <Notifications />,
      color: '#16a34a',
      settings: [
        {
          name: 'emailNotifications',
          label: 'Email Notifications',
          description: 'Receive important updates via email',
          type: 'switch',
          status: 'active'
        },
        {
          name: 'securityAlerts',
          label: 'Security Alerts',
          description: 'Get notified about security-related events',
          type: 'switch',
          status: 'active'
        }
      ]
    },
    {
      title: 'Security & API',
      icon: <Security />,
      color: '#dc2626',
      settings: [
        {
          name: 'apiKey',
          label: 'API Key',
          description: 'Your secret API key for external integrations',
          type: 'text',
          secure: true
        },
        {
          name: 'retentionPeriod',
          label: 'Data Retention',
          description: 'How long to keep system logs and data',
          type: 'text'
        }
      ]
    }
  ];

  const getStatusChip = (status) => {
    const statusConfig = {
      success: { color: 'success', icon: <Check sx={{ fontSize: 16 }} /> },
      warning: { color: 'warning', icon: <Warning sx={{ fontSize: 16 }} /> },
      error: { color: 'error', icon: <Error sx={{ fontSize: 16 }} /> },
      active: { color: 'primary', icon: <Check sx={{ fontSize: 16 }} /> }
    };

    const config = statusConfig[status] || statusConfig.success;

    return (
      <Chip
        size="small"
        icon={config.icon}
        color={config.color}
        label={status.charAt(0).toUpperCase() + status.slice(1)}
        sx={{ 
          fontWeight: 'medium',
          textTransform: 'capitalize'
        }}
      />
    );
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" fontWeight="bold">
            System Settings
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<RestartAlt />}
              onClick={() => setResetDialogOpen(true)}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'medium'
              }}
            >
              Reset
            </Button>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSave}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'bold'
              }}
            >
              Save Changes
            </Button>
          </Stack>
        </Box>
        {saveStatus && (
          <Alert 
            severity={saveStatus.type}
            sx={{ 
              borderRadius: 2,
              '& .MuiAlert-message': {
                fontWeight: 'medium'
              }
            }}
          >
            {saveStatus.message}
          </Alert>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Settings Sections */}
        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            {settingSections.map((section, index) => (
              <Paper
                key={index}
                elevation={0}
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden'
                }}
              >
                <Box
                  sx={{
                    p: 3,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                  }}
                >
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      backgroundColor: `${section.color}15`,
                      color: section.color
                    }}
                  >
                    {section.icon}
                  </Box>
                  <Typography variant="h6" fontWeight="bold">
                    {section.title}
                  </Typography>
                </Box>
                <Box sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    {section.settings.map((setting, settingIndex) => (
                      <Box
                        key={settingIndex}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                            {setting.label}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {setting.description}
                          </Typography>
                        </Box>
                        <Box sx={{ ml: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                          {setting.status && getStatusChip(setting.status)}
                          {setting.type === 'switch' ? (
                            <Switch
                              checked={settings[setting.name]}
                              onChange={() => handleToggle(setting.name)}
                              color="primary"
                            />
                          ) : setting.type === 'select' ? (
                            <TextField
                              select
                              size="small"
                              value={settings[setting.name]}
                              onChange={(e) => handleInputChange(setting.name, e.target.value)}
                              sx={{
                                minWidth: 200,
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2
                                }
                              }}
                            >
                              {setting.options.map((option) => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </TextField>
                          ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <TextField
                                size="small"
                                value={settings[setting.name]}
                                onChange={(e) => handleInputChange(setting.name, e.target.value)}
                                type={setting.secure && !showApiKey ? 'password' : 'text'}
                                sx={{
                                  minWidth: 200,
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2
                                  }
                                }}
                              />
                              {setting.secure && (
                                <Tooltip title={showApiKey ? 'Hide API Key' : 'Show API Key'}>
                                  <IconButton
                                    onClick={() => setShowApiKey(!showApiKey)}
                                    size="small"
                                  >
                                    <Info fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Box>
                          )}
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Paper>
            ))}
          </Stack>
        </Grid>

        {/* Side Panel */}
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            {/* System Status */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                System Status
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Maintenance Mode
                  </Typography>
                  <Switch
                    checked={settings.maintenanceMode}
                    onChange={() => handleToggle('maintenanceMode')}
                    color="warning"
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Debug Mode
                  </Typography>
                  <Switch
                    checked={settings.debugMode}
                    onChange={() => handleToggle('debugMode')}
                    color="warning"
                  />
                </Box>
              </Stack>
            </Paper>

            {/* Backup Status */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  Backup Status
                </Typography>
                <IconButton size="small" onClick={(e) => setMenuAnchor(e.currentTarget)}>
                  <MoreVert fontSize="small" />
                </IconButton>
              </Box>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Auto Backup
                  </Typography>
                  <Switch
                    checked={settings.autoBackup}
                    onChange={() => handleToggle('autoBackup')}
                  />
                </Box>
                <Divider />
                <Typography variant="subtitle2" fontWeight="medium">
                  Recent Backups
                </Typography>
                {backupHistory.map((backup, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {backup.date}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {backup.size}
                      </Typography>
                    </Box>
                    {getStatusChip(backup.status)}
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Stack>
        </Grid>
      </Grid>

      {/* Backup Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        PaperProps={{
          elevation: 0,
          sx: {
            borderRadius: 2,
            mt: 1
          }
        }}
      >
        <MenuItem onClick={() => setMenuAnchor(null)}>
          <CloudUpload sx={{ mr: 2, fontSize: 20 }} />
          Create Backup
        </MenuItem>
        <MenuItem onClick={() => setMenuAnchor(null)}>
          <CloudDownload sx={{ mr: 2, fontSize: 20 }} />
          Restore Backup
        </MenuItem>
        <MenuItem onClick={() => setMenuAnchor(null)}>
          <History sx={{ mr: 2, fontSize: 20 }} />
          View History
        </MenuItem>
      </Menu>

      {/* Reset Dialog */}
      <Dialog
        open={resetDialogOpen}
        onClose={() => setResetDialogOpen(false)}
        PaperProps={{
          elevation: 0,
          sx: {
            borderRadius: 3
          }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Warning color="warning" />
            Reset Settings
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to reset all settings to their default values? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 0 }}>
          <Button
            onClick={() => setResetDialogOpen(false)}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 'medium'
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              setResetDialogOpen(false);
              // Add reset logic here
            }}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 'bold'
            }}
          >
            Reset Settings
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings;

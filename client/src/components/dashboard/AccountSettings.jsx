import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Stack,
  TextField,
  Switch,
  Divider,
  IconButton,
  Avatar,
  Tooltip,
  Alert,
  Tab,
  Tabs
} from '@mui/material';
import {
  Save as SaveIcon,
  Edit as EditIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Email as EmailIcon,
  Language as LanguageIcon,
  CreditCard as CreditCardIcon,
  Upload as UploadIcon
} from '@mui/icons-material';
import { useUser, useClerk } from '@clerk/clerk-react';

const AccountSettings = () => {
  const { user } = useUser();
  const { openUserProfile } = useClerk();
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    companyName: user?.publicMetadata?.companyName || '',
    website: user?.publicMetadata?.website || '',
    bio: user?.publicMetadata?.bio || ''
  });

  const [notifications, setNotifications] = useState({
    emailDigest: true,
    newSubscriber: true,
    securityAlerts: true,
    marketingEmails: false,
    popupPerformance: true,
    weeklyReports: true
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleNotificationChange = (setting) => {
    setNotifications(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      // Implement save functionality
      setShowSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setShowSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleOpenSecuritySettings = () => {
    openUserProfile({
      appearance: {
        elements: {
          rootBox: {
            boxShadow: 'none',
            width: '100%'
          }
        }
      },
      initialTab: 'security'
    });
  };

  const renderProfile = () => (
    <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={user?.imageUrl}
              alt={user?.fullName}
              sx={{ width: 64, height: 64 }}
            />
            <Box>
              <Typography variant="h6" fontWeight="bold">
                {user?.fullName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.primaryEmailAddress?.emailAddress}
              </Typography>
            </Box>
          </Box>
          <Button
            variant="outlined"
            startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
            onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
            sx={{ borderRadius: 2 }}
          >
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </Button>
        </Box>

        {showSaveSuccess && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
            Profile updated successfully!
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              disabled={!isEditing}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Company Name"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              disabled={!isEditing}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Website"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              disabled={!isEditing}
              multiline
              rows={3}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderNotifications = () => (
    <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Notification Preferences
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Manage how you receive notifications and updates
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle1">Email Digest</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Receive a daily summary of your popup performance
                  </Typography>
                </Box>
                <Switch
                  checked={notifications.emailDigest}
                  onChange={() => handleNotificationChange('emailDigest')}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle1">New Subscriber Alerts</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Get notified when you get new subscribers
                  </Typography>
                </Box>
                <Switch
                  checked={notifications.newSubscriber}
                  onChange={() => handleNotificationChange('newSubscriber')}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle1">Security Alerts</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Get notified about important security updates
                  </Typography>
                </Box>
                <Switch
                  checked={notifications.securityAlerts}
                  onChange={() => handleNotificationChange('securityAlerts')}
                />
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle1">Marketing Emails</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Receive updates about new features and promotions
                  </Typography>
                </Box>
                <Switch
                  checked={notifications.marketingEmails}
                  onChange={() => handleNotificationChange('marketingEmails')}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle1">Popup Performance</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Real-time notifications about popup performance
                  </Typography>
                </Box>
                <Switch
                  checked={notifications.popupPerformance}
                  onChange={() => handleNotificationChange('popupPerformance')}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle1">Weekly Reports</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Receive detailed weekly performance reports
                  </Typography>
                </Box>
                <Switch
                  checked={notifications.weeklyReports}
                  onChange={() => handleNotificationChange('weeklyReports')}
                />
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderSecurity = () => (
    <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Security Settings
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Manage your account security and authentication preferences
        </Typography>

        <Stack spacing={3}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="subtitle1">Two-Factor Authentication</Typography>
              <Typography variant="body2" color="text.secondary">
                Add an extra layer of security to your account
              </Typography>
            </Box>
            <Button
              variant="outlined"
              onClick={handleOpenSecuritySettings}
              sx={{ borderRadius: 2 }}
            >
              Configure
            </Button>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="subtitle1">Password</Typography>
              <Typography variant="body2" color="text.secondary">
                Change your password or set up password recovery
              </Typography>
            </Box>
            <Button
              variant="outlined"
              onClick={handleOpenSecuritySettings}
              sx={{ borderRadius: 2 }}
            >
              Update
            </Button>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="subtitle1">Connected Devices</Typography>
              <Typography variant="body2" color="text.secondary">
                See all devices that have accessed your account
              </Typography>
            </Box>
            <Button
              variant="outlined"
              onClick={handleOpenSecuritySettings}
              sx={{ borderRadius: 2 }}
            >
              View All
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Account Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your account settings and preferences
        </Typography>
      </Box>

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        sx={{
          mb: 3,
          borderBottom: 1,
          borderColor: 'divider',
          '& .MuiTab-root': {
            textTransform: 'none',
            minWidth: 100,
            fontWeight: 600
          }
        }}
      >
        <Tab
          icon={<EditIcon sx={{ fontSize: 20 }} />}
          iconPosition="start"
          label="Profile"
        />
        <Tab
          icon={<NotificationsIcon sx={{ fontSize: 20 }} />}
          iconPosition="start"
          label="Notifications"
        />
        <Tab
          icon={<SecurityIcon sx={{ fontSize: 20 }} />}
          iconPosition="start"
          label="Security"
        />
      </Tabs>

      <Box sx={{ mt: 2 }}>
        {activeTab === 0 && renderProfile()}
        {activeTab === 1 && renderNotifications()}
        {activeTab === 2 && renderSecurity()}
      </Box>
    </Box>
  );
};

export default AccountSettings;

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  Button,
  IconButton,
  Tabs,
  Tab,
  Stack,
  Divider,
  useTheme
} from '@mui/material';
import {
  People as PeopleIcon,
  Campaign as CampaignIcon,
  Web as WebIcon,
  TrendingUp as TrendingUpIcon,
  MoreVert as MoreVertIcon,
  Language as LanguageIcon,
  InsertChart as InsertChartIcon,
  Settings as SettingsIcon,
  WebAsset as WebAssetIcon,
  Group as GroupIcon,
  Campaign as PopupIcon
} from '@mui/icons-material';
import { WebsitesList, PopupsList, SubscribersList, Analytics, AccountSettings } from '../../components/dashboard';
import DashboardHeader from '../../components/dashboard/DashboardHeader';

const CustomerDashboard = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    {
      title: 'Total Subscribers',
      value: '1,234',
      change: '+12.5%',
      icon: <PeopleIcon sx={{ fontSize: 24 }} />,
      color: theme.palette.primary.main
    },
    {
      title: 'Active Popups',
      value: '8',
      change: '+2',
      icon: <CampaignIcon sx={{ fontSize: 24 }} />,
      color: theme.palette.success.main
    },
    {
      title: 'Connected Websites',
      value: '3',
      change: '+1',
      icon: <WebIcon sx={{ fontSize: 24 }} />,
      color: theme.palette.info.main
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      change: '+0.8%',
      icon: <TrendingUpIcon sx={{ fontSize: 24 }} />,
      color: theme.palette.secondary.main
    }
  ];

  const tabItems = [
    {
      key: 'websites',
      label: 'Websites',
      icon: <WebAssetIcon />,
      description: 'Manage connected websites'
    },
    {
      key: 'popups',
      label: 'Popups',
      icon: <PopupIcon />,
      description: 'Design and manage popups'
    },
    {
      key: 'subscribers',
      label: 'Audience',
      icon: <GroupIcon />,
      description: 'View and manage subscribers'
    },
    {
      key: 'analytics',
      label: 'Insights',
      icon: <InsertChartIcon />,
      description: 'Performance analytics'
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: <SettingsIcon />,
      description: 'Account preferences'
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'websites':
        return <WebsitesList />;
      case 'popups':
        return <PopupsList />;
      case 'subscribers':
        return <SubscribersList />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <AccountSettings />;
      default:
        return (
          <Grid container spacing={3}>
            {/* Stats Cards */}
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    height: '100%',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[4]
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: 2,
                          backgroundColor: `${stat.color}15`,
                          color: stat.color
                        }}
                      >
                        {stat.icon}
                      </Box>
                      <IconButton size="small">
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="h4" fontWeight="bold">
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {stat.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: theme.palette.success.main,
                          display: 'inline-flex',
                          alignItems: 'center',
                          mt: 1
                        }}
                      >
                        {stat.change} this month
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}

            {/* Recent Activity */}
            <Grid item xs={12} md={8}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3,
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" fontWeight="bold">Recent Activity</Typography>
                  <Button 
                    size="small"
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600
                    }}
                  >
                    View All
                  </Button>
                </Box>
                <Analytics compact />
              </Paper>
            </Grid>

            {/* Quick Actions */}
            <Grid item xs={12} md={4}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3,
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => setActiveTab('popups')}
                    sx={{
                      borderRadius: 2,
                      py: 1,
                      textTransform: 'none',
                      fontWeight: 600
                    }}
                  >
                    Create New Popup
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => setActiveTab('websites')}
                    sx={{
                      borderRadius: 2,
                      py: 1,
                      textTransform: 'none',
                      fontWeight: 600
                    }}
                  >
                    Connect Website
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => setActiveTab('subscribers')}
                    sx={{
                      borderRadius: 2,
                      py: 1,
                      textTransform: 'none',
                      fontWeight: 600
                    }}
                  >
                    View Subscribers
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        );
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <DashboardHeader />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4,
          backgroundColor: theme.palette.background.default
        }}
      >
        <Container maxWidth="lg">
          {/* Tab Navigation */}
          <Box sx={{ mb: 4 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              {tabItems.map((tab) => (
                <Button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  variant={activeTab === tab.key ? 'contained' : 'outlined'}
                  startIcon={tab.icon}
                  sx={{
                    borderRadius: 2,
                    py: 1,
                    px: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    minWidth: 120,
                    backgroundColor: activeTab === tab.key ? 'primary.main' : 'transparent',
                    borderColor: activeTab === tab.key ? 'primary.main' : 'divider',
                    color: activeTab === tab.key ? 'white' : 'text.primary',
                    '&:hover': {
                      backgroundColor: activeTab === tab.key ? 'primary.dark' : 'action.hover',
                      borderColor: activeTab === tab.key ? 'primary.dark' : 'primary.main'
                    }
                  }}
                >
                  {tab.label}
                </Button>
              ))}
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {tabItems.find(tab => tab.key === activeTab)?.description}
            </Typography>
          </Box>

          {renderContent()}
        </Container>
      </Box>
    </Box>
  );
};

export default CustomerDashboard;

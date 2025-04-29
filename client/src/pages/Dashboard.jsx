import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
  IconButton,
  Avatar,
  Chip,
  Divider,
  LinearProgress
} from '@mui/material';
import {
  Language,
  NotificationsActive,
  People,
  Timeline,
  TrendingUp,
  Add as AddIcon,
  ArrowUpward,
  ArrowForward,
  Campaign,
  MoreVert
} from '@mui/icons-material';
import { useUser } from '@clerk/clerk-react';
import { useNavigate, useLocation } from 'react-router-dom';
import WebsitesList from '../components/dashboard/WebsitesList';
import PopupsList from '../components/dashboard/PopupsList';
import SubscribersList from '../components/dashboard/SubscribersList';
import Analytics from '../components/dashboard/Analytics';
import AccountSettings from '../components/dashboard/AccountSettings';
import DashboardLoader from '../components/DashboardLoader';

const Dashboard = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set active tab from navigation state
    if (location.state?.activeTab !== undefined) {
      setCurrentTab(location.state.activeTab);
      // Clear the state to prevent tab from changing on refresh
      navigate(location.pathname, { replace: true });
    }
  }, [location.state]);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <DashboardLoader />;
  }

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleCreatePopup = () => {
    navigate('/dashboard/create');
  };

  // Quick stats for the customer
  const stats = [
    {
      title: 'Total Subscribers',
      value: '1,250',
      change: '+12.5%',
      icon: <People sx={{ fontSize: 24 }} />,
      color: '#2563eb',
      progress: 75
    },
    {
      title: 'Active Popups',
      value: '8',
      change: '+2',
      icon: <Campaign sx={{ fontSize: 24 }} />,
      color: '#16a34a',
      progress: 60
    },
    {
      title: 'Connected Websites',
      value: '3',
      change: '+1',
      icon: <Language sx={{ fontSize: 24 }} />,
      color: '#9333ea',
      progress: 45
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      change: '+0.8%',
      icon: <TrendingUp sx={{ fontSize: 24 }} />,
      color: '#ea580c',
      progress: 32
    }
  ];

  const renderTabContent = () => {
    switch (currentTab) {
      case 0:
        return <WebsitesList />;
      case 1:
        return <PopupsList />;
      case 2:
        return <SubscribersList />;
      case 3:
        return <Analytics />;
      case 4:
        return <AccountSettings />;
      default:
        return <WebsitesList />;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Welcome Section */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            mb: 4, 
            background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
            color: 'white',
            borderRadius: 3
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={7}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar
                  src={user?.imageUrl}
                  alt={user?.firstName}
                  sx={{ width: 56, height: 56, border: '2px solid rgba(255,255,255,0.2)' }}
                />
                <Box>
                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Welcome back, {user?.firstName || 'User'}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Here's what's happening with your popups today
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={5} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Button
                variant="contained"
                color="inherit"
                size="large"
                onClick={handleCreatePopup}
                startIcon={<AddIcon />}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  color: '#2563eb',
                  '&:hover': {
                    backgroundColor: 'white'
                  }
                }}
              >
                Create New Popup
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Quick Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 3,
                  '&:hover': {
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
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
                      <MoreVert fontSize="small" />
                    </IconButton>
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h4" fontWeight="bold">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {stat.title}
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={stat.progress}
                      sx={{
                        backgroundColor: `${stat.color}20`,
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: stat.color
                        },
                        height: 6,
                        borderRadius: 3
                      }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <ArrowUpward sx={{ color: '#16a34a', fontSize: 16, mr: 0.5 }} />
                      <Typography
                        variant="caption"
                        sx={{ color: '#16a34a', fontWeight: 'medium' }}
                      >
                        {stat.change} this month
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Main Content */}
        <Paper 
          elevation={0}
          sx={{ 
            mb: 4,
            borderRadius: 3,
            overflow: 'hidden'
          }}
        >
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              px: 2,
              pt: 2,
              backgroundColor: 'white',
              borderBottom: '1px solid',
              borderColor: 'divider',
              '& .MuiTab-root': {
                minHeight: 48,
                fontWeight: 500,
                fontSize: '0.875rem'
              }
            }}
          >
            <Tab label="My Websites" />
            <Tab label="My Popups" />
            <Tab label="My Subscribers" />
            <Tab label="Analytics" />
            <Tab label="Account Settings" />
          </Tabs>
          <Box sx={{ p: 3 }}>
            {renderTabContent()}
          </Box>
        </Paper>

        {/* Subscription Status */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 3,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={7}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography variant="h6" fontWeight="bold">
                    {user?.publicMetadata?.plan || 'Free'} Plan
                  </Typography>
                  <Chip 
                    label="Current" 
                    size="small"
                    sx={{ 
                      backgroundColor: '#16a34a20',
                      color: '#16a34a',
                      fontWeight: 500
                    }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Next billing date: {user?.publicMetadata?.nextBillingDate || 'N/A'}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={5} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Button
                variant="outlined"
                color="primary"
                endIcon={<ArrowForward />}
                component="a"
                href="/upgrade"
                size="large"
                sx={{
                  borderRadius: 2,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2
                  }
                }}
              >
                Upgrade Plan
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default Dashboard;

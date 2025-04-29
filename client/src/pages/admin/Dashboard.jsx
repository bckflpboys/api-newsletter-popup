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
  IconButton,
  Avatar,
  LinearProgress,
  Tabs,
  Tab,
  Tooltip
} from '@mui/material';
import {
  TrendingUp,
  People,
  Web,
  Campaign,
  MoreVert,
  ArrowUpward,
  Add as AddIcon,
  Security,
  Speed,
  Dashboard as DashboardIcon,
  Group,
  GppGood,
  Info
} from '@mui/icons-material';
import { useUser } from '@clerk/clerk-react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import DashboardLoader from '../../components/DashboardLoader';

const AdminDashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(true);

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

  const stats = [
    {
      title: 'Total Users',
      value: '2,845',
      trend: '+12%',
      icon: <Group sx={{ fontSize: 40, color: 'primary.main' }} />,
      color: '#2563eb'
    },
    {
      title: 'Active Popups',
      value: '156',
      trend: '+8%',
      icon: <TrendingUp sx={{ fontSize: 40, color: '#16a34a' }} />,
      color: '#16a34a'
    },
    {
      title: 'Connected Websites',
      value: '64',
      trend: '+24%',
      icon: <Web sx={{ fontSize: 40, color: '#9333ea' }} />,
      color: '#9333ea'
    },
    {
      title: 'Security Score',
      value: '92',
      trend: '+5%',
      icon: <GppGood sx={{ fontSize: 40, color: '#dc2626' }} />,
      color: '#dc2626',
      isScore: true
    }
  ];

  const isRootAdminPath = location.pathname === '/dashboard/admin';

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Welcome Section */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 3,
            mb: 4,
            borderRadius: 3,
            background: 'linear-gradient(45deg, #2563eb 30%, #1e40af 90%)',
            color: 'white'
          }}
        >
          <Grid container alignItems="center" spacing={3}>
            <Grid item xs={12} md={8}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Admin Dashboard
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Manage your platform and monitor system performance
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: 'right' }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/dashboard/create')}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(8px)',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                  },
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'bold'
                }}
              >
                Create Popup
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Metrics Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    bgcolor: `${stat.color}08`,
                    borderColor: stat.color,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 12px ${stat.color}15`
                  }
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: -15,
                    right: -15,
                    width: 90,
                    height: 90,
                    borderRadius: '50%',
                    bgcolor: `${stat.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {stat.icon}
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {stat.title}
                    <Tooltip title="View details">
                      <IconButton size="small" sx={{ ml: 0.5, opacity: 0.7 }}>
                        <Info fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight="bold" gutterBottom>
                    {stat.isScore ? `${stat.value}%` : stat.value}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: stat.trend.startsWith('+') ? 'success.main' : 'error.main',
                        fontWeight: 'medium'
                      }}
                    >
                      {stat.trend} this month
                    </Typography>
                  </Box>
                  {stat.isScore && (
                    <LinearProgress
                      variant="determinate"
                      value={parseInt(stat.value)}
                      sx={{
                        mt: 1,
                        height: 6,
                        borderRadius: 3,
                        bgcolor: `${stat.color}20`,
                        '& .MuiLinearProgress-bar': {
                          bgcolor: stat.color
                        }
                      }}
                    />
                  )}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Tabs Section */}
        <Paper 
          elevation={0}
          sx={{ 
            borderRadius: 3,
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              borderBottom: '1px solid',
              borderColor: 'divider',
              bgcolor: 'white',
              px: 3,
              pt: 2
            }}
          >
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              TabIndicatorProps={{
                sx: {
                  height: 3,
                  borderRadius: '3px 3px 0 0'
                }
              }}
              sx={{
                '& .MuiTab-root': {
                  minHeight: 56,
                  minWidth: 120,
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  textTransform: 'none',
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                    opacity: 1
                  },
                  '&.Mui-selected': {
                    color: 'primary.main'
                  }
                },
                '& .MuiTabs-scrollButtons': {
                  '&.Mui-disabled': {
                    opacity: 0.3
                  }
                }
              }}
            >
              <Tab 
                icon={<DashboardIcon sx={{ fontSize: 20 }} />}
                iconPosition="start"
                label="Overview" 
                onClick={() => navigate('/dashboard/admin')}
              />
              <Tab 
                icon={<People sx={{ fontSize: 20 }} />}
                iconPosition="start"
                label="User Management" 
                onClick={() => navigate('/dashboard/admin/users')}
              />
              <Tab 
                icon={<Web sx={{ fontSize: 20 }} />}
                iconPosition="start"
                label="Website Management" 
                onClick={() => navigate('/dashboard/admin/websites')}
              />
              <Tab 
                icon={<Security sx={{ fontSize: 20 }} />}
                iconPosition="start"
                label="Security Reports" 
                onClick={() => navigate('/dashboard/admin/security')}
              />
              <Tab 
                icon={<Speed sx={{ fontSize: 20 }} />}
                iconPosition="start"
                label="System Settings" 
                onClick={() => navigate('/dashboard/admin/settings')}
              />
            </Tabs>
          </Box>
          <Box 
            sx={{ 
              p: 3,
              bgcolor: 'white',
              minHeight: 400
            }}
          >
            <Outlet />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminDashboard;

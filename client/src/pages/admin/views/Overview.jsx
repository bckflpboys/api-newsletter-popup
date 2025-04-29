import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from '@mui/material';
import {
  Memory,
  Storage,
  Speed,
  CloudQueue,
  CheckCircle,
  Warning,
  Error,
  Notifications,
  MoreVert
} from '@mui/icons-material';

const Overview = () => {
  const systemHealth = [
    {
      name: 'CPU Usage',
      value: 45,
      icon: <Memory />,
      status: 'healthy',
      details: '4/8 cores active'
    },
    {
      name: 'Memory',
      value: 62,
      icon: <Storage />,
      status: 'warning',
      details: '12.4/16 GB used'
    },
    {
      name: 'Storage',
      value: 28,
      icon: <CloudQueue />,
      status: 'healthy',
      details: '280/1000 GB used'
    }
  ];

  const performanceMetrics = [
    {
      name: 'Response Time',
      value: 85,
      status: 'healthy',
      details: '124ms average'
    },
    {
      name: 'Success Rate',
      value: 98,
      status: 'healthy',
      details: '98% requests successful'
    },
    {
      name: 'Error Rate',
      value: 2,
      status: 'healthy',
      details: '2% error rate'
    }
  ];

  const recentAlerts = [
    {
      severity: 'error',
      message: 'High memory usage detected',
      time: '5 minutes ago'
    },
    {
      severity: 'warning',
      message: 'API response time above threshold',
      time: '15 minutes ago'
    },
    {
      severity: 'success',
      message: 'System backup completed',
      time: '1 hour ago'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return '#16a34a';
      case 'warning':
        return '#eab308';
      case 'error':
        return '#dc2626';
      default:
        return '#6b7280';
    }
  };

  const getAlertIcon = (severity) => {
    switch (severity) {
      case 'error':
        return <Error sx={{ color: '#dc2626' }} />;
      case 'warning':
        return <Warning sx={{ color: '#eab308' }} />;
      case 'success':
        return <CheckCircle sx={{ color: '#16a34a' }} />;
      default:
        return <Notifications sx={{ color: '#6b7280' }} />;
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Overview
      </Typography>

      {/* System Health Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          System Health
        </Typography>
        <Grid container spacing={3}>
          {systemHealth.map((item, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  height: '100%',
                  backgroundColor: 'rgba(0,0,0,0.02)'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 1,
                        backgroundColor: `${getStatusColor(item.status)}20`,
                        color: getStatusColor(item.status)
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {item.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.details}
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton size="small">
                    <MoreVert fontSize="small" />
                  </IconButton>
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                    {item.value}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={item.value}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      bgcolor: `${getStatusColor(item.status)}20`,
                      '& .MuiLinearProgress-bar': {
                        bgcolor: getStatusColor(item.status)
                      }
                    }}
                  />
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Performance Metrics Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          Performance Metrics
        </Typography>
        <Grid container spacing={3}>
          {performanceMetrics.map((metric, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  height: '100%',
                  backgroundColor: 'rgba(0,0,0,0.02)'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {metric.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {metric.details}
                    </Typography>
                  </Box>
                  <IconButton size="small">
                    <MoreVert fontSize="small" />
                  </IconButton>
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                    {metric.value}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={metric.value}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      bgcolor: `${getStatusColor(metric.status)}20`,
                      '& .MuiLinearProgress-bar': {
                        bgcolor: getStatusColor(metric.status)
                      }
                    }}
                  />
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Recent Alerts Section */}
      <Box>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          Recent Alerts
        </Typography>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            backgroundColor: 'rgba(0,0,0,0.02)'
          }}
        >
          <List>
            {recentAlerts.map((alert, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemIcon>
                    {getAlertIcon(alert.severity)}
                  </ListItemIcon>
                  <ListItemText
                    primary={alert.message}
                    secondary={alert.time}
                    primaryTypographyProps={{
                      variant: 'body2',
                      fontWeight: 'medium'
                    }}
                    secondaryTypographyProps={{
                      variant: 'caption'
                    }}
                  />
                </ListItem>
                {index < recentAlerts.length - 1 && (
                  <Divider component="li" />
                )}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Box>
    </Box>
  );
};

export default Overview;

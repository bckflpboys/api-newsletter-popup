import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  LinearProgress,
  IconButton,
  Menu,
  MenuItem,
  Chip
} from '@mui/material';
import {
  Security,
  Warning,
  Error,
  CheckCircle,
  MoreVert,
  Refresh,
  Download,
  Flag,
  Block,
  Shield,
  VpnKey,
  Speed,
  Storage,
  FilterList
} from '@mui/icons-material';

const SecurityReports = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const securityScore = 85;
  const lastScan = '2 hours ago';

  const securityMetrics = [
    {
      label: 'SSL/TLS',
      score: 100,
      status: 'Secure',
      icon: <VpnKey />,
      color: '#16a34a'
    },
    {
      label: 'Authentication',
      score: 92,
      status: 'Good',
      icon: <Shield />,
      color: '#16a34a'
    },
    {
      label: 'Data Protection',
      score: 88,
      status: 'Good',
      icon: <Storage />,
      color: '#16a34a'
    },
    {
      label: 'Response Time',
      score: 75,
      status: 'Fair',
      icon: <Speed />,
      color: '#eab308'
    }
  ];

  const recentAlerts = [
    {
      severity: 'high',
      message: 'Multiple failed login attempts detected',
      time: '15 minutes ago',
      status: 'Active'
    },
    {
      severity: 'medium',
      message: 'Unusual traffic pattern detected',
      time: '1 hour ago',
      status: 'Investigating'
    },
    {
      severity: 'low',
      message: 'SSL certificate expiring in 30 days',
      time: '2 hours ago',
      status: 'Resolved'
    }
  ];

  const vulnerabilities = [
    {
      type: 'Critical',
      count: 0,
      color: '#dc2626'
    },
    {
      type: 'High',
      count: 2,
      color: '#ea580c'
    },
    {
      type: 'Medium',
      count: 5,
      color: '#eab308'
    },
    {
      type: 'Low',
      count: 8,
      color: '#16a34a'
    }
  ];

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getSeverityIcon = (severity) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return <Error sx={{ color: '#dc2626' }} />;
      case 'medium':
        return <Warning sx={{ color: '#eab308' }} />;
      case 'low':
        return <Flag sx={{ color: '#16a34a' }} />;
      default:
        return <CheckCircle sx={{ color: '#16a34a' }} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return {
          color: '#dc2626',
          bgcolor: '#dc262620'
        };
      case 'investigating':
        return {
          color: '#eab308',
          bgcolor: '#eab30820'
        };
      case 'resolved':
        return {
          color: '#16a34a',
          bgcolor: '#16a34a20'
        };
      default:
        return {
          color: '#2563eb',
          bgcolor: '#2563eb20'
        };
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" fontWeight="bold">
          Security Reports
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 'medium'
            }}
          >
            Filters
          </Button>
          <Button
            variant="contained"
            startIcon={<Refresh />}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 'bold'
            }}
          >
            Run Security Scan
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Security Score */}
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 3,
              borderRadius: 3,
              height: '100%',
              background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
              color: 'white'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Security Score
              </Typography>
              <IconButton
                size="small"
                sx={{ color: 'white' }}
                onClick={handleMenuOpen}
              >
                <MoreVert />
              </IconButton>
            </Box>
            <Box sx={{ position: 'relative', mt: 2 }}>
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                {securityScore}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={securityScore}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: 'white'
                  }
                }}
              />
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                Last scan: {lastScan}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Security Metrics */}
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 3,
              borderRadius: 3,
              height: '100%'
            }}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Security Metrics
            </Typography>
            <Grid container spacing={3}>
              {securityMetrics.map((metric, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card 
                    elevation={0}
                    sx={{ 
                      borderRadius: 2,
                      backgroundColor: 'rgba(0,0,0,0.02)'
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Box
                          sx={{
                            p: 1,
                            borderRadius: 1,
                            backgroundColor: `${metric.color}20`,
                            color: metric.color
                          }}
                        >
                          {metric.icon}
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {metric.label}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {metric.status}
                          </Typography>
                        </Box>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={metric.score}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: `${metric.color}20`,
                          '& .MuiLinearProgress-bar': {
                            bgcolor: metric.color
                          }
                        }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Vulnerabilities */}
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 3,
              borderRadius: 3
            }}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Vulnerabilities
            </Typography>
            <List>
              {vulnerabilities.map((vuln, index) => (
                <React.Fragment key={index}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" fontWeight="medium">
                            {vuln.type}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: vuln.color,
                              fontWeight: 'bold'
                            }}
                          >
                            {vuln.count}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < vulnerabilities.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Recent Alerts */}
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 3,
              borderRadius: 3
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                Recent Alerts
              </Typography>
              <Button
                variant="text"
                endIcon={<Download />}
                sx={{
                  textTransform: 'none',
                  fontWeight: 'medium'
                }}
              >
                Export Report
              </Button>
            </Box>
            <List>
              {recentAlerts.map((alert, index) => {
                const statusColor = getStatusColor(alert.status);
                return (
                  <React.Fragment key={index}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        {getSeverityIcon(alert.severity)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" fontWeight="medium">
                              {alert.message}
                            </Typography>
                            <Chip
                              label={alert.status}
                              size="small"
                              sx={{
                                color: statusColor.color,
                                bgcolor: statusColor.bgcolor,
                                fontWeight: 'medium',
                                borderRadius: 1
                              }}
                            />
                          </Box>
                        }
                        secondary={alert.time}
                      />
                    </ListItem>
                    {index < recentAlerts.length - 1 && <Divider />}
                  </React.Fragment>
                );
              })}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            borderRadius: 2,
            mt: 1
          }
        }}
      >
        <MenuItem onClick={handleMenuClose}>
          <Download sx={{ mr: 2, fontSize: 20 }} /> Download Report
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Block sx={{ mr: 2, fontSize: 20 }} /> Block Threats
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Refresh sx={{ mr: 2, fontSize: 20 }} /> Refresh Score
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default SecurityReports;

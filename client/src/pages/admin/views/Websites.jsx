import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Button,
  Chip,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Avatar
} from '@mui/material';
import {
  Language,
  MoreVert,
  TrendingUp,
  People,
  Campaign,
  Add as AddIcon,
  Search,
  FilterList,
  Edit,
  Delete,
  Link,
  Block,
  CheckCircle,
  Warning,
  Error
} from '@mui/icons-material';

const Websites = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedWebsite, setSelectedWebsite] = useState(null);

  const websites = [
    {
      id: 1,
      name: 'Tech Blog',
      url: 'https://techblog.com',
      status: 'Active',
      subscribers: 1234,
      activePopups: 5,
      conversionRate: 3.2,
      lastSync: '5 minutes ago',
      health: 'Healthy'
    },
    {
      id: 2,
      name: 'E-commerce Store',
      url: 'https://store.example.com',
      status: 'Active',
      subscribers: 2567,
      activePopups: 8,
      conversionRate: 4.5,
      lastSync: '2 hours ago',
      health: 'Warning'
    },
    {
      id: 3,
      name: 'Portfolio Site',
      url: 'https://portfolio.example.com',
      status: 'Inactive',
      subscribers: 456,
      activePopups: 2,
      conversionRate: 2.1,
      lastSync: '1 day ago',
      health: 'Error'
    }
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return {
          color: '#16a34a',
          bgcolor: '#16a34a20'
        };
      case 'inactive':
        return {
          color: '#dc2626',
          bgcolor: '#dc262620'
        };
      default:
        return {
          color: '#2563eb',
          bgcolor: '#2563eb20'
        };
    }
  };

  const getHealthIcon = (health) => {
    switch (health.toLowerCase()) {
      case 'healthy':
        return <CheckCircle sx={{ color: '#16a34a' }} />;
      case 'warning':
        return <Warning sx={{ color: '#eab308' }} />;
      case 'error':
        return <Error sx={{ color: '#dc2626' }} />;
      default:
        return <CheckCircle sx={{ color: '#16a34a' }} />;
    }
  };

  const handleMenuOpen = (event, website) => {
    setAnchorEl(event.currentTarget);
    setSelectedWebsite(website);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedWebsite(null);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" fontWeight="bold">
          Website Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 'bold',
            px: 3
          }}
        >
          Add Website
        </Button>
      </Box>

      {/* Search and Filter */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 2,
          mb: 3,
          borderRadius: 3,
          display: 'flex',
          gap: 2
        }}
      >
        <TextField
          placeholder="Search websites..."
          variant="outlined"
          size="small"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            )
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2
            }
          }}
        />
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
      </Paper>

      {/* Websites Grid */}
      <Grid container spacing={3}>
        {websites.map((website) => {
          const statusColor = getStatusColor(website.status);
          return (
            <Grid item xs={12} md={4} key={website.id}>
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 3,
                  height: '100%',
                  '&:hover': {
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar
                        sx={{
                          bgcolor: website.id % 2 === 0 ? '#2563eb20' : '#9333ea20',
                          color: website.id % 2 === 0 ? '#2563eb' : '#9333ea',
                          width: 40,
                          height: 40
                        }}
                      >
                        <Language />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {website.name}
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
                          <Link sx={{ fontSize: 16 }} />
                          {website.url}
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={(event) => handleMenuOpen(event, website)}
                    >
                      <MoreVert />
                    </IconButton>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Chip
                        label={website.status}
                        size="small"
                        sx={{
                          color: statusColor.color,
                          bgcolor: statusColor.bgcolor,
                          fontWeight: 'medium',
                          borderRadius: 1
                        }}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {getHealthIcon(website.health)}
                        <Typography variant="caption" fontWeight="medium">
                          {website.health}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Subscribers
                      </Typography>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {website.subscribers.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Active Popups
                      </Typography>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {website.activePopups}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Conversion
                      </Typography>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {website.conversionRate}%
                      </Typography>
                    </Grid>
                  </Grid>

                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Subscriber Growth
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={65}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: '#2563eb20',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: '#2563eb'
                        }
                      }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                      Last synced {website.lastSync}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
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
          <Edit sx={{ mr: 2, fontSize: 20 }} /> Edit Website
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Campaign sx={{ mr: 2, fontSize: 20 }} /> Manage Popups
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Block sx={{ mr: 2, fontSize: 20 }} /> Disable Website
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 2, fontSize: 20 }} /> Remove Website
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Websites;

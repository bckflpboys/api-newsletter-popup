import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Tooltip,
  LinearProgress
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Link as LinkIcon,
  ContentCopy as ContentCopyIcon
} from '@mui/icons-material';

const WebsitesList = () => {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedWebsite, setSelectedWebsite] = useState(null);
  const [websites, setWebsites] = useState([
    {
      id: 1,
      name: 'My Blog',
      url: 'https://myblog.com',
      status: 'active',
      health: 98,
      activePopups: 3,
      totalSubscribers: 450,
      lastChecked: '2 minutes ago'
    },
    {
      id: 2,
      name: 'E-commerce Store',
      url: 'https://mystore.com',
      status: 'warning',
      health: 85,
      activePopups: 2,
      totalSubscribers: 280,
      lastChecked: '5 minutes ago'
    },
    {
      id: 3,
      name: 'Portfolio',
      url: 'https://portfolio.com',
      status: 'error',
      health: 0,
      activePopups: 1,
      totalSubscribers: 120,
      lastChecked: '10 minutes ago'
    }
  ]);

  const handleOpenMenu = (event, website) => {
    setAnchorEl(event.currentTarget);
    setSelectedWebsite(website);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedWebsite(null);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon sx={{ color: '#16a34a' }} />;
      case 'warning':
        return <WarningIcon sx={{ color: '#eab308' }} />;
      case 'error':
        return <ErrorIcon sx={{ color: '#dc2626' }} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return '#16a34a';
      case 'warning':
        return '#eab308';
      case 'error':
        return '#dc2626';
      default:
        return '#94a3b8';
    }
  };

  const handleCopyScript = (url) => {
    navigator.clipboard.writeText(`https://api.newsletter.com/script?website=${url}`);
    // Add notification here
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            My Websites
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your connected websites and their popups
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenAddDialog(true)}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            px: 3
          }}
        >
          Add Website
        </Button>
      </Box>

      {/* Websites Grid */}
      <Grid container spacing={3}>
        {websites.map((website) => (
          <Grid item xs={12} key={website.id}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }
              }}
            >
              <CardContent>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        variant="rounded"
                        sx={{
                          width: 48,
                          height: 48,
                          backgroundColor: getStatusColor(website.status) + '20',
                          color: getStatusColor(website.status)
                        }}
                      >
                        {getStatusIcon(website.status)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
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
                          <LinkIcon sx={{ fontSize: 16 }} />
                          {website.url}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <Box sx={{ display: 'flex', gap: 3 }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Health
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={website.health}
                            sx={{
                              width: 100,
                              height: 6,
                              borderRadius: 3,
                              backgroundColor: getStatusColor(website.status) + '20',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: getStatusColor(website.status)
                              }
                            }}
                          />
                          <Typography variant="body2" fontWeight="medium">
                            {website.health}%
                          </Typography>
                        </Box>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Active Popups
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {website.activePopups}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Total Subscribers
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {website.totalSubscribers}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                      <Tooltip title="Copy Installation Script">
                        <IconButton
                          size="small"
                          onClick={() => handleCopyScript(website.url)}
                          sx={{ 
                            backgroundColor: 'action.hover',
                            '&:hover': { backgroundColor: 'action.selected' }
                          }}
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Refresh Status">
                        <IconButton
                          size="small"
                          sx={{ 
                            backgroundColor: 'action.hover',
                            '&:hover': { backgroundColor: 'action.selected' }
                          }}
                        >
                          <RefreshIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <IconButton
                        size="small"
                        onClick={(e) => handleOpenMenu(e, website)}
                        sx={{ 
                          backgroundColor: 'action.hover',
                          '&:hover': { backgroundColor: 'action.selected' }
                        }}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'block', textAlign: 'right', mt: 1 }}
                    >
                      Last checked {website.lastChecked}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add Website Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3
          }
        }}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            Add New Website
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Website Name"
              fullWidth
              placeholder="My Awesome Website"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
            <TextField
              label="Website URL"
              fullWidth
              placeholder="https://mywebsite.com"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            variant="outlined"
            onClick={() => setOpenAddDialog(false)}
            sx={{
              borderRadius: 2,
              textTransform: 'none'
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              px: 3
            }}
          >
            Add Website
          </Button>
        </DialogActions>
      </Dialog>

      {/* Website Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: 2,
            minWidth: 180
          }
        }}
      >
        <MenuItem onClick={handleCloseMenu}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Edit Website
        </MenuItem>
        <MenuItem onClick={handleCloseMenu} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" sx={{ color: 'error.main' }} />
          </ListItemIcon>
          Delete Website
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default WebsitesList;

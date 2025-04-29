import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
  LinearProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

const WebsiteCard = ({ website, onEdit, onDelete }) => {
  const getHealthStatus = () => {
    if (website.health >= 90) {
      return {
        color: 'success',
        icon: <CheckCircleIcon />,
        text: 'Healthy'
      };
    }
    return {
      color: 'warning',
      icon: <WarningIcon />,
      text: 'Needs Attention'
    };
  };

  const healthStatus = getHealthStatus();

  return (
    <Card>
      <CardContent>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div">
            {website.domain}
          </Typography>
          <Chip
            icon={healthStatus.icon}
            label={healthStatus.text}
            color={healthStatus.color}
            size="small"
          />
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography color="textSecondary" gutterBottom>
              Active Popups
            </Typography>
            <Typography variant="h6">
              {website.activePopups}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography color="textSecondary" gutterBottom>
              Subscribers
            </Typography>
            <Typography variant="h6">
              {website.subscribers}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography color="textSecondary" gutterBottom>
              Performance
            </Typography>
            <LinearProgress
              variant="determinate"
              value={website.performance}
              color={website.performance > 80 ? 'success' : 'warning'}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Grid>
        </Grid>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Tooltip title="Edit Website">
          <IconButton size="small" onClick={() => onEdit(website)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Remove Website">
          <IconButton size="small" onClick={() => onDelete(website)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

const MyWebsites = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedWebsite, setSelectedWebsite] = useState(null);

  // Example websites data
  const websites = [
    {
      id: 1,
      domain: 'mywebsite.com',
      activePopups: 3,
      subscribers: 450,
      health: 95,
      performance: 92
    },
    {
      id: 2,
      domain: 'myblog.com',
      activePopups: 2,
      subscribers: 280,
      health: 88,
      performance: 85
    }
  ];

  const handleAddWebsite = () => {
    setSelectedWebsite(null);
    setOpenDialog(true);
  };

  const handleEditWebsite = (website) => {
    setSelectedWebsite(website);
    setOpenDialog(true);
  };

  const handleDeleteWebsite = (website) => {
    // Implement delete functionality
    console.log('Delete website:', website);
  };

  const handleSaveWebsite = () => {
    // Implement save functionality
    setOpenDialog(false);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h5">
          My Websites
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddWebsite}
        >
          Add Website
        </Button>
      </Box>

      {/* Websites Grid */}
      <Grid container spacing={3}>
        {websites.map((website) => (
          <Grid item xs={12} md={6} key={website.id}>
            <WebsiteCard
              website={website}
              onEdit={handleEditWebsite}
              onDelete={handleDeleteWebsite}
            />
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit Website Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedWebsite ? 'Edit Website' : 'Add New Website'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Domain Name"
              defaultValue={selectedWebsite?.domain || ''}
              helperText="Enter your website domain (e.g., example.com)"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Website Name"
              defaultValue={selectedWebsite?.name || ''}
              helperText="Enter a friendly name for your website"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveWebsite}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyWebsites;

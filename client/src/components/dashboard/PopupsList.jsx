import React, { useState, useEffect } from 'react';
import { useSession } from '@clerk/clerk-react';
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
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  TextField,
  Tooltip,
  Snackbar
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Code as CodeIcon,
  ContentCopy as ContentCopyIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getPopups, deletePopup, getPopupCode } from '../../utils/api';
import { notifications } from '@mantine/notifications';

const PopupsList = () => {
  const { session } = useSession();
  const navigate = useNavigate();
  const [popups, setPopups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPopup, setSelectedPopup] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [codeDialogOpen, setCodeDialogOpen] = useState(false);
  const [embedCode, setEmbedCode] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (session) {
      fetchPopups();
    }
  }, [session]);

  const fetchPopups = async () => {
    if (!session) {
      console.error('No session available');
      notifications.show({
        title: '❌ Error',
        message: 'Please sign in to view your popups',
        color: 'red'
      });
      return;
    }

    try {
      setLoading(true);
      const token = await session.getToken();
      const response = await getPopups(token);
      if (response && Array.isArray(response)) {
        setPopups(response);
      } else {
        console.error('Invalid response format:', response);
        notifications.show({
          title: '❌ Error',
          message: 'Invalid data format received from server',
          color: 'red'
        });
      }
    } catch (error) {
      console.error('Error fetching popups:', error);
      notifications.show({
        title: '❌ Error',
        message: error.message || 'Failed to fetch popups',
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event, popup) => {
    setAnchorEl(event.currentTarget);
    setSelectedPopup(popup);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = (popup) => {
    setSelectedPopup(popup);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPopup?._id) {
      console.error('No popup selected for deletion');
      return;
    }

    try {
      setLoading(true);
      const token = await session.getToken();
      await deletePopup(token, selectedPopup._id);
      
      notifications.show({
        title: '✅ Success',
        message: 'Popup deleted successfully',
        color: 'green'
      });
      
      // Refresh the popups list
      fetchPopups();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting popup:', error);
      notifications.show({
        title: '❌ Error',
        message: 'Failed to delete popup',
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (popup) => {
    navigate(`/dashboard/edit/${popup._id}`);
    handleMenuClose();
  };

  const handleCodeClick = async (popup) => {
    try {
      const token = await session.getToken();
      const response = await getPopupCode(token, popup._id);
      const code = response?.data || '';
      setEmbedCode(code);
      setCodeDialogOpen(true);
    } catch (error) {
      console.error('Error getting popup code:', error);
      notifications.show({
        title: '❌ Error',
        message: 'Failed to get popup code',
        color: 'red'
      });
    }
    handleMenuClose();
  };

  const handleCopyCode = () => {
    if (!embedCode) return;
    navigator.clipboard.writeText(embedCode);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
    notifications.show({
      title: '✅ Success',
      message: 'Code copied to clipboard',
      color: 'green'
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h5" component="h1">
          My Popups
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/dashboard/create')}
        >
          Create Popup
        </Button>
      </Box>

      {popups.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No popups yet
          </Typography>
          <Typography color="text.secondary" mb={3}>
            Create your first popup to get started!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/dashboard/create')}
          >
            Create Popup
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {popups.map((popup) => (
            <Grid item xs={12} sm={6} md={4} key={popup._id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  border: '1px solid rgba(0, 0, 0, 0.12)',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                  '&:hover': {
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    borderColor: 'primary.main',
                    transition: 'all 0.3s ease'
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Typography variant="h6" component="div" gutterBottom>
                      {popup.name}
                    </Typography>
                    <IconButton 
                      size="small"
                      onClick={(e) => handleMenuOpen(e, popup)}
                      sx={{ mt: -1, mr: -1 }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                  <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
                    {popup.description || 'No description'}
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    <Chip
                      label={popup.status === 'active' ? 'Active' : 'Inactive'}
                      color={popup.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                    {popup.ab_testing?.enabled && (
                      <Chip label="A/B Testing" color="primary" size="small" />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleEditClick(selectedPopup)}>
          <EditIcon sx={{ mr: 1 }} fontSize="small" />
          Edit
        </MenuItem>
        <MenuItem onClick={() => handleCodeClick(selectedPopup)}>
          <CodeIcon sx={{ mr: 1 }} fontSize="small" />
          Get Code
        </MenuItem>
        <MenuItem onClick={() => handleDeleteClick(selectedPopup)} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
          Delete
        </MenuItem>
      </Menu>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Popup</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedPopup?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={codeDialogOpen} 
        onClose={() => setCodeDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Embed Code</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            fullWidth
            rows={6}
            value={embedCode || ''}
            variant="outlined"
            InputProps={{
              readOnly: true,
              sx: { 
                fontFamily: 'monospace',
                fontSize: '14px'
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCodeDialogOpen(false)}>Close</Button>
          <Button 
            onClick={handleCopyCode}
            color="primary"
            startIcon={<ContentCopyIcon />}
            disabled={!embedCode}
          >
            {copySuccess ? 'Copied!' : 'Copy Code'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PopupsList;

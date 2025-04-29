import React, { useState, useEffect } from 'react';
import { useSession } from '@clerk/clerk-react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Grid,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  ListItemIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Avatar,
  Checkbox,
  Tooltip,
  Stack,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Mail as MailIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Language as LanguageIcon,
  Campaign as CampaignIcon
} from '@mui/icons-material';
import { getSubscribers } from '../../utils/api';
import { notifications } from '@mantine/notifications';
import { format } from 'date-fns';

const SubscribersList = () => {
  const { session } = useSession();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const token = await session.getToken();
      const response = await getSubscribers(token);
      
      if (response.status === 'success') {
        setSubscribers(response.data);
      }
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      notifications.show({
        title: '❌ Error',
        message: 'Failed to fetch subscribers',
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setSelected(subscribers.map(subscriber => subscriber._id));
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleMenuOpen = (event, subscriber) => {
    setAnchorEl(event.currentTarget);
    setSelectedSubscriber(subscriber);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedSubscriber(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredSubscribers = subscribers.filter(subscriber =>
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (subscriber.popupId?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedSubscribers = filteredSubscribers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box>
      <Card>
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search subscribers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<FilterListIcon />}
                    size="small"
                  >
                    Filter
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    size="small"
                  >
                    Export
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          indeterminate={selected.length > 0 && selected.length < subscribers.length}
                          checked={subscribers.length > 0 && selected.length === subscribers.length}
                          onChange={handleSelectAllClick}
                        />
                      </TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Popup</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedSubscribers.map((subscriber) => (
                      <TableRow
                        hover
                        key={subscriber._id}
                        selected={selected.indexOf(subscriber._id) !== -1}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selected.indexOf(subscriber._id) !== -1}
                            onChange={(event) => handleClick(event, subscriber._id)}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ mr: 2, width: 32, height: 32 }}>
                              {subscriber.email[0].toUpperCase()}
                            </Avatar>
                            {subscriber.email}
                          </Box>
                        </TableCell>
                        <TableCell>{subscriber.popupId?.name || 'Unknown'}</TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={subscriber.status}
                            color={subscriber.status === 'active' ? 'success' : 'default'}
                          />
                        </TableCell>
                        <TableCell>
                          {format(new Date(subscriber.createdAt), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={(event) => handleMenuOpen(event, subscriber)}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredSubscribers.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}
        </CardContent>
      </Card>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <MailIcon fontSize="small" />
          </ListItemIcon>
          Send Email
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          Remove
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default SubscribersList;

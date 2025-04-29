import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  Badge
} from '@mui/material';
import {
  NotificationsOutlined,
  HelpOutlineOutlined,
  Settings,
  Person,
  ExitToApp
} from '@mui/icons-material';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const DashboardHeader = () => {
  const theme = useTheme();
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notificationsAnchor, setNotificationsAnchor] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsOpen = (event) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const notifications = [
    {
      id: 1,
      title: 'New Subscriber',
      message: 'You have a new subscriber from mywebsite.com',
      time: '5 minutes ago'
    },
    {
      id: 2,
      title: 'Popup Performance',
      message: 'Your "Special Offer" popup is performing well',
      time: '1 hour ago'
    }
  ];

  return (
    <AppBar 
      position="sticky" 
      color="inherit" 
      elevation={0}
      sx={{
        borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundColor: 'background.paper'
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            color: 'text.primary',
            fontWeight: 600
          }}
        >
          Newsletter Popup
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => navigate('/dashboard/create')}
            sx={{
              borderRadius: '20px',
              px: 2
            }}
          >
            Create Popup
          </Button>

          <IconButton
            size="small"
            color="default"
            onClick={handleNotificationsOpen}
          >
            <Badge badgeContent={notifications.length} color="error">
              <NotificationsOutlined />
            </Badge>
          </IconButton>

          <IconButton
            size="small"
            color="default"
            onClick={() => window.open('/docs', '_blank')}
          >
            <HelpOutlineOutlined />
          </IconButton>

          <IconButton
            size="small"
            onClick={handleMenu}
            sx={{ ml: 1 }}
          >
            <Avatar
              src={user?.imageUrl}
              alt={user?.fullName}
              sx={{ width: 32, height: 32 }}
            />
          </IconButton>
        </Box>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            sx: {
              width: 200,
              maxWidth: '100%',
              mt: 1.5,
              borderRadius: 2,
              boxShadow: theme.shadows[3]
            }
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle1" noWrap>
              {user?.fullName}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {user?.primaryEmailAddress?.emailAddress}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={() => navigate('/dashboard/account')}>
            <Person sx={{ mr: 2, fontSize: 20 }} />
            Profile
          </MenuItem>
          <MenuItem onClick={() => navigate('/dashboard/settings')}>
            <Settings sx={{ mr: 2, fontSize: 20 }} />
            Settings
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleSignOut} sx={{ color: 'error.main' }}>
            <ExitToApp sx={{ mr: 2, fontSize: 20 }} />
            Sign Out
          </MenuItem>
        </Menu>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notificationsAnchor}
          open={Boolean(notificationsAnchor)}
          onClose={handleNotificationsClose}
          onClick={handleNotificationsClose}
          PaperProps={{
            sx: {
              width: 320,
              maxWidth: '100%',
              mt: 1.5,
              borderRadius: 2,
              boxShadow: theme.shadows[3]
            }
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle1">
              Notifications
            </Typography>
          </Box>
          <Divider />
          {notifications.map((notification) => (
            <MenuItem key={notification.id} sx={{ py: 1.5 }}>
              <Box>
                <Typography variant="subtitle2">
                  {notification.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {notification.message}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {notification.time}
                </Typography>
              </Box>
            </MenuItem>
          ))}
          <Divider />
          <Box sx={{ p: 1 }}>
            <Button fullWidth size="small">
              View All Notifications
            </Button>
          </Box>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default DashboardHeader;

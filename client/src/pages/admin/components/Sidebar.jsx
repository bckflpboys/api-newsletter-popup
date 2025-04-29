import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Badge
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Language as LanguageIcon,
  Security as SecurityIcon,
  Subscriptions as SubscriptionsIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

const DRAWER_WIDTH = 240;

const menuItems = [
  { id: 'overview', text: 'Overview', icon: DashboardIcon },
  { id: 'users', text: 'Users', icon: PeopleIcon },
  { id: 'websites', text: 'Websites', icon: LanguageIcon },
  { id: 'security', text: 'Security', icon: SecurityIcon, alert: true },
  { id: 'subscriptions', text: 'Subscriptions', icon: SubscriptionsIcon },
  { id: 'analytics', text: 'Analytics', icon: AnalyticsIcon },
  { id: 'settings', text: 'Settings', icon: SettingsIcon }
];

const Sidebar = ({ currentView, setCurrentView }) => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          backgroundColor: '#1a237e',
          color: 'white'
        }
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Admin Dashboard
        </Typography>
      </Box>
      <List>
        {menuItems.map(({ id, text, icon: Icon, alert }) => (
          <ListItem
            button
            key={id}
            selected={currentView === id}
            onClick={() => setCurrentView(id)}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)'
                }
              },
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <ListItemIcon sx={{ color: 'white' }}>
              {alert ? (
                <Badge color="error" variant="dot">
                  <Icon />
                </Badge>
              ) : (
                <Icon />
              )}
            </ListItemIcon>
            <ListItemText primary={text} />
            {id === 'security' && (
              <Badge
                badgeContent={3}
                color="error"
                sx={{ ml: 2 }}
              />
            )}
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;

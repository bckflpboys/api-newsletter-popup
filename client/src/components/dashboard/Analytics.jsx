import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Stack,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Select,
  FormControl,
  InputLabel,
  Tooltip
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  CalendarToday as CalendarTodayIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  People as PeopleIcon,
  Campaign as CampaignIcon,
  Language as LanguageIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar
} from 'recharts';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Sample data
  const subscriberData = [
    { date: 'Dec 13', subscribers: 120 },
    { date: 'Dec 14', subscribers: 150 },
    { date: 'Dec 15', subscribers: 180 },
    { date: 'Dec 16', subscribers: 220 },
    { date: 'Dec 17', subscribers: 250 },
    { date: 'Dec 18', subscribers: 280 },
    { date: 'Dec 19', subscribers: 320 }
  ];

  const sourceData = [
    { name: 'Newsletter Popup', value: 45 },
    { name: 'Special Offer', value: 30 },
    { name: 'Welcome Message', value: 25 }
  ];

  const websiteData = [
    { name: 'myblog.com', subscribers: 450, views: 15000 },
    { name: 'store.com', subscribers: 280, views: 8500 },
    { name: 'portfolio.com', subscribers: 120, views: 4200 }
  ];

  const COLORS = ['#2563eb', '#16a34a', '#9333ea', '#ea580c'];

  const stats = [
    {
      title: 'Total Subscribers',
      value: '1,250',
      change: '+12.5%',
      trend: 'up',
      icon: <PeopleIcon />,
      color: '#2563eb'
    },
    {
      title: 'Active Popups',
      value: '8',
      change: '+2',
      trend: 'up',
      icon: <CampaignIcon />,
      color: '#16a34a'
    },
    {
      title: 'Websites',
      value: '3',
      change: '0',
      trend: 'neutral',
      icon: <LanguageIcon />,
      color: '#9333ea'
    },
    {
      title: 'Emails Sent',
      value: '2.5k',
      change: '+5.2%',
      trend: 'up',
      icon: <EmailIcon />,
      color: '#ea580c'
    }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: 'background.paper',
            p: 2,
            boxShadow: 1,
            borderRadius: 1
          }}
        >
          <Typography variant="subtitle2">{label}</Typography>
          <Typography variant="body2" color="text.secondary">
            Subscribers: {payload[0].value}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Analytics Overview
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track your newsletter performance and subscriber growth
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              sx={{
                borderRadius: 2,
                backgroundColor: 'background.paper'
              }}
            >
              <MenuItem value="7d">Last 7 days</MenuItem>
              <MenuItem value="30d">Last 30 days</MenuItem>
              <MenuItem value="90d">Last 90 days</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            sx={{
              borderRadius: 2,
              textTransform: 'none'
            }}
          >
            Export
          </Button>
        </Stack>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                height: '100%',
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      backgroundColor: stat.color + '15',
                      color: stat.color
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {stat.trend === 'up' && (
                      <TrendingUpIcon sx={{ fontSize: 16, color: '#16a34a' }} />
                    )}
                    {stat.trend === 'down' && (
                      <TrendingDownIcon sx={{ fontSize: 16, color: '#dc2626' }} />
                    )}
                    <Typography
                      variant="caption"
                      sx={{
                        color: stat.trend === 'up' ? '#16a34a' : stat.trend === 'down' ? '#dc2626' : 'text.secondary'
                      }}
                    >
                      {stat.change}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h4" fontWeight="bold">
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.title}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Subscriber Growth Chart */}
        <Grid item xs={12} lg={8}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              height: '100%'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  Subscriber Growth
                </Typography>
                <IconButton
                  size="small"
                  onClick={handleMenuOpen}
                  sx={{ 
                    backgroundColor: 'action.hover',
                    '&:hover': { backgroundColor: 'action.selected' }
                  }}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Box>
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <AreaChart data={subscriberData}>
                    <defs>
                      <linearGradient id="colorSubscribers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="date"
                      stroke="#94a3b8"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => value.toLocaleString()}
                    />
                    <ChartTooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="subscribers"
                      stroke="#2563eb"
                      strokeWidth={2}
                      fill="url(#colorSubscribers)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Source Distribution Chart */}
        <Grid item xs={12} lg={4}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              height: '100%'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  Subscriber Sources
                </Typography>
                <IconButton
                  size="small"
                  sx={{ 
                    backgroundColor: 'action.hover',
                    '&:hover': { backgroundColor: 'action.selected' }
                  }}
                >
                  <ShareIcon fontSize="small" />
                </IconButton>
              </Box>
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={sourceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {sourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend
                      verticalAlign="middle"
                      align="right"
                      layout="vertical"
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Website Performance Chart */}
        <Grid item xs={12}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  Website Performance
                </Typography>
                <IconButton
                  size="small"
                  sx={{ 
                    backgroundColor: 'action.hover',
                    '&:hover': { backgroundColor: 'action.selected' }
                  }}
                >
                  <DownloadIcon fontSize="small" />
                </IconButton>
              </Box>
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={websiteData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="name"
                      stroke="#94a3b8"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => value.toLocaleString()}
                    />
                    <ChartTooltip />
                    <Bar dataKey="subscribers" name="Subscribers" fill="#2563eb" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="views" name="Views" fill="#16a34a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: 2,
            minWidth: 180
          }
        }}
      >
        <MenuItem onClick={handleMenuClose}>
          <CalendarTodayIcon fontSize="small" sx={{ mr: 2 }} />
          Change Date Range
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <DownloadIcon fontSize="small" sx={{ mr: 2 }} />
          Download Report
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ShareIcon fontSize="small" sx={{ mr: 2 }} />
          Share Analytics
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Analytics;

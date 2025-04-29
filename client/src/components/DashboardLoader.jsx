import React from 'react';
import { Box, Paper, Skeleton, Grid } from '@mui/material';

const DashboardLoader = () => {
  return (
    <Box sx={{ p: 3 }}>
      {/* Welcome Section Skeleton */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 3,
          mb: 4,
          borderRadius: 3,
          background: 'linear-gradient(45deg, #2563eb30 30%, #1e40af30 90%)',
        }}
      >
        <Grid container alignItems="center" spacing={3}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="text" sx={{ fontSize: '2rem', width: '60%', mb: 1 }} />
            <Skeleton variant="text" sx={{ fontSize: '1rem', width: '80%' }} />
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: 'right' }}>
            <Skeleton variant="rounded" width={150} height={40} sx={{ ml: 'auto' }} />
          </Grid>
        </Grid>
      </Paper>

      {/* Metrics Section Skeleton */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[...Array(4)].map((_, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: -15,
                  right: -15,
                  width: 90,
                  height: 90,
                  borderRadius: '50%',
                  bgcolor: '#f1f5f9'
                }}
              />
              <Box>
                <Skeleton variant="text" sx={{ fontSize: '0.875rem', width: '60%', mb: 1 }} />
                <Skeleton variant="text" sx={{ fontSize: '2rem', width: '40%', mb: 1 }} />
                <Skeleton variant="text" sx={{ fontSize: '0.875rem', width: '70%' }} />
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Content Section Skeleton */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          overflow: 'hidden'
        }}
      >
        {/* Tabs Skeleton */}
        <Box sx={{ px: 2, py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {[...Array(5)].map((_, index) => (
              <Skeleton
                key={index}
                variant="rounded"
                width={120}
                height={32}
                sx={{ borderRadius: 1 }}
              />
            ))}
          </Box>
        </Box>

        {/* Content Skeleton */}
        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Skeleton variant="rounded" height={200} sx={{ borderRadius: 3, mb: 3 }} />
              <Skeleton variant="text" sx={{ fontSize: '1.5rem', width: '40%', mb: 2 }} />
              <Skeleton variant="text" sx={{ fontSize: '1rem', width: '100%' }} />
              <Skeleton variant="text" sx={{ fontSize: '1rem', width: '90%' }} />
              <Skeleton variant="text" sx={{ fontSize: '1rem', width: '95%' }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Skeleton variant="rounded" height={200} sx={{ borderRadius: 3, mb: 3 }} />
              <Skeleton variant="text" sx={{ fontSize: '1.5rem', width: '40%', mb: 2 }} />
              <Skeleton variant="text" sx={{ fontSize: '1rem', width: '100%' }} />
              <Skeleton variant="text" sx={{ fontSize: '1rem', width: '90%' }} />
              <Skeleton variant="text" sx={{ fontSize: '1rem', width: '95%' }} />
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default DashboardLoader;

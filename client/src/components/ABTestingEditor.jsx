import React from 'react';
import {
  Box,
  Switch,
  Slider,
  Typography,
  Paper,
  Divider,
  FormControlLabel
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PopupPreview from './PopupPreview';

const ABTestingEditor = ({
  enabled,
  setEnabled,
  splitRatio,
  setSplitRatio,
  variantA,
  variantB,
  onVariantAChange,
  onVariantBChange
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                color="primary"
              />
            }
            label="Enable A/B Testing"
          />
        </Box>

        {enabled && (
          <>
            <Box sx={{ mb: 4 }}>
              <Typography gutterBottom>Traffic Split (Variant A/B)</Typography>
              <Slider
                value={splitRatio}
                onChange={(_, value) => setSplitRatio(value)}
                valueLabelDisplay="on"
                valueLabelFormat={(value) => `${value}% / ${100-value}%`}
                step={5}
                marks
                min={0}
                max={100}
              />
            </Box>

            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: 3,
              mb: 3 
            }}>
              <Box>
                <Typography variant="h6" gutterBottom>Variant A</Typography>
                <PopupPreview
                  variant={variantA}
                  onChange={onVariantAChange}
                />
              </Box>

              <Box>
                <Typography variant="h6" gutterBottom>Variant B</Typography>
                <PopupPreview
                  variant={variantB}
                  onChange={onVariantBChange}
                />
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: 3 
            }}>
              <Paper 
                variant="outlined" 
                sx={{ p: 2, bgcolor: theme.palette.background.default }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  Variant A Stats
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Views: {variantA.stats?.views || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Conversions: {variantA.stats?.conversions || 0}
                  </Typography>
                </Box>
              </Paper>

              <Paper 
                variant="outlined" 
                sx={{ p: 2, bgcolor: theme.palette.background.default }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  Variant B Stats
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Views: {variantB.stats?.views || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Conversions: {variantB.stats?.conversions || 0}
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default ABTestingEditor;

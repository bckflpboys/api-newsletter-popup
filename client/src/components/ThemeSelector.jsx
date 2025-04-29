import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Palette as PaletteIcon
} from '@mui/icons-material';
import { popupThemes, themeStyles } from '../config/popupThemes';

export default function ThemeSelector({ onSelectTheme, selectedThemeId }) {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState(Object.keys(popupThemes)[0]);

  // Add theme styles to document
  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = themeStyles;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const handleAccordionChange = () => {
    setExpanded(!expanded);
  };

  const handleCategoryChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Accordion 
      expanded={expanded} 
      onChange={handleAccordionChange}
      sx={{
        backgroundColor: 'background.paper',
        '& .MuiAccordionSummary-root': {
          borderBottom: expanded ? 1 : 0,
          borderColor: 'divider',
        }
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          '& .MuiAccordionSummary-content': {
            alignItems: 'center'
          }
        }}
      >
        <PaletteIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography>Theme Selection</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0 }}>
        <Box>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={activeTab}
              onChange={handleCategoryChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ px: 2 }}
            >
              {Object.keys(popupThemes).map((category) => (
                <Tab
                  key={category}
                  label={popupThemes[category].name}
                  value={category}
                />
              ))}
            </Tabs>
          </Box>
          <Box sx={{ p: 2 }}>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
              gap: 2 
            }}>
              {popupThemes[activeTab].themes.map((theme) => (
                <Paper
                  key={theme.id}
                  onClick={() => onSelectTheme(theme)}
                  sx={{
                    cursor: 'pointer',
                    overflow: 'hidden',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    position: 'relative',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3,
                    },
                    ...(selectedThemeId === theme.id && {
                      outline: '2px solid',
                      outlineColor: 'primary.main',
                    }),
                  }}
                >
                  {/* Theme Preview */}
                  <Box
                    sx={{
                      height: 140,
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: theme.backgroundColor,
                      color: theme.textColor,
                      ...theme.backgroundStyle,
                    }}
                  >
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        color: 'inherit',
                        textAlign: 'center',
                        mb: 1,
                      }}
                    >
                      Newsletter
                    </Typography>
                    <Box
                      sx={{
                        backgroundColor: theme.buttonColor,
                        color: theme.buttonTextColor,
                        px: 2,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.875rem',
                      }}
                    >
                      Subscribe
                    </Box>
                  </Box>

                  {/* Theme Name */}
                  <Box sx={{ p: 1, textAlign: 'center' }}>
                    <Typography variant="body2">{theme.name}</Typography>
                  </Box>
                </Paper>
              ))}
            </Box>
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}

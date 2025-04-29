import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Text,
  Textarea,
  Button,
  Tabs,
  Divider,
  Group,
  ActionIcon,
  Tooltip,
  Switch,
  LoadingOverlay,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconRefresh, IconDeviceLaptop, IconDeviceMobile, IconDeviceTablet, IconCode, IconEye } from '@tabler/icons-react';

export default function PlaygroundPage() {
  const [embedCode, setEmbedCode] = useState('');
  const [activeTab, setActiveTab] = useState('preview');
  const [viewportDevice, setViewportDevice] = useState('desktop');
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleEmbedCodeChange = (event) => {
    setEmbedCode(event.currentTarget.value);
  };

  const handleTestCode = async () => {
    try {
      setIsLoading(true);
      
      // Clear any existing test popup
      const existingScript = document.getElementById('test-popup-script');
      if (existingScript) {
        existingScript.remove();
      }

      // Remove script tags if present and extract the code
      let cleanCode = embedCode;
      if (cleanCode.includes('<script>')) {
        cleanCode = cleanCode.replace(/<\/?script>/g, '');
      }

      // Create and inject the new script
      const script = document.createElement('script');
      script.id = 'test-popup-script';
      script.textContent = cleanCode;
      document.body.appendChild(script);

      notifications.show({
        title: '✨ Success',
        message: 'Popup code injected successfully',
        color: 'green'
      });
    } catch (error) {
      console.error('Error injecting popup:', error);
      notifications.show({
        title: '❌ Error',
        message: 'Failed to inject popup code: ' + error.message,
        color: 'red'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearTest = () => {
    const script = document.getElementById('test-popup-script');
    if (script) {
      script.remove();
    }
    // Remove any popups that might have been created
    const popups = document.querySelectorAll('.newsletter-popup');
    popups.forEach(popup => popup.remove());

    notifications.show({
      title: 'Info',
      message: 'Playground cleared',
      color: 'blue'
    });
  };

  const getViewportStyle = () => {
    switch (viewportDevice) {
      case 'mobile':
        return {
          width: '375px',
          minHeight: '667px', // iPhone SE height
          margin: '0 auto',
          transform: 'scale(0.9)',
          transformOrigin: 'top'
        };
      case 'tablet':
        return {
          width: '768px',
          minHeight: '1024px', // iPad height
          margin: '0 auto',
          transform: 'scale(0.8)',
          transformOrigin: 'top'
        };
      default:
        return {
          width: '100%',
          minHeight: '500px',
          transform: 'none'
        };
    }
  };

  return (
    <Box 
      sx={(theme) => ({
        backgroundColor: darkMode ? theme.colors.dark[8] : theme.colors.gray[0],
        minHeight: '100vh',
        transition: 'all 0.3s ease'
      })}
    >
      <Container size="xl" py="xl">
        <Paper 
          shadow="sm" 
          p="md" 
          withBorder
          sx={(theme) => ({
            backgroundColor: darkMode ? theme.colors.dark[7] : theme.white,
            borderColor: darkMode ? theme.colors.dark[4] : theme.colors.gray[3],
          })}
        >
          <Group position="apart" mb="xl">
            <Box>
              <Text size="xl" weight={700} color={darkMode ? 'white' : 'dark'}>
                Popup Playground
              </Text>
              <Text color="dimmed" size="sm">
                Test your popup code in a safe environment. Paste your embed code and see how it works in real-time.
              </Text>
            </Box>
            <Group>
              <Switch
                label="Dark Mode"
                checked={darkMode}
                onChange={(event) => setDarkMode(event.currentTarget.checked)}
                color="blue"
              />
            </Group>
          </Group>

          <Tabs 
            value={activeTab} 
            onChange={setActiveTab} 
            mb="xl"
            styles={(theme) => ({
              tab: {
                color: darkMode ? theme.white : theme.black,
              },
              tabActive: {
                color: darkMode ? theme.white : theme.black,
                borderColor: theme.colors.blue[5],
              },
            })}
          >
            <Group position="apart" mb="md">
              <Tabs.List>
                <Tabs.Tab 
                  value="preview" 
                  icon={<IconEye size={16} />}
                >
                  Preview
                </Tabs.Tab>
                <Tabs.Tab 
                  value="code"
                  icon={<IconCode size={16} />}
                >
                  Code
                </Tabs.Tab>
              </Tabs.List>

              {activeTab === 'preview' && (
                <Group spacing="xs">
                  <Tooltip label="Desktop View">
                    <ActionIcon
                      variant={viewportDevice === 'desktop' ? 'filled' : 'subtle'}
                      onClick={() => setViewportDevice('desktop')}
                      color="blue"
                    >
                      <IconDeviceLaptop size={18} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Tablet View">
                    <ActionIcon
                      variant={viewportDevice === 'tablet' ? 'filled' : 'subtle'}
                      onClick={() => setViewportDevice('tablet')}
                      color="blue"
                    >
                      <IconDeviceTablet size={18} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Mobile View">
                    <ActionIcon
                      variant={viewportDevice === 'mobile' ? 'filled' : 'subtle'}
                      onClick={() => setViewportDevice('mobile')}
                      color="blue"
                    >
                      <IconDeviceMobile size={18} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              )}
            </Group>

            <Tabs.Panel value="preview">
              <Box 
                sx={(theme) => ({
                  backgroundColor: darkMode ? theme.colors.dark[6] : theme.white,
                  border: `1px solid ${darkMode ? theme.colors.dark[4] : theme.colors.gray[3]}`,
                  borderRadius: theme.radius.md,
                  padding: theme.spacing.xl,
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  overflow: 'hidden',
                  ...getViewportStyle()
                })}
              >
                <LoadingOverlay visible={isLoading} overlayBlur={2} />
                
                <Box 
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}
                >
                  <Text 
                    align="center" 
                    size="xl" 
                    weight={700} 
                    color={darkMode ? 'gray.4' : 'dark'}
                    mb="lg"
                  >
                    Sample Website Content
                  </Text>
                  
                  <Text color={darkMode ? 'gray.4' : 'dark'}>
                    This is a sample website page where you can test your popup. The content here simulates a real website environment.
                  </Text>
                  
                  <Text color={darkMode ? 'gray.4' : 'dark'}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </Text>

                  <Box mt="auto">
                    <Text size="lg" weight={600} mb="sm" color={darkMode ? 'gray.4' : 'dark'}>
                      Sample Header
                    </Text>
                    <Text color={darkMode ? 'gray.4' : 'dark'}>
                      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                      Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </Text>
                  </Box>
                </Box>
              </Box>
            </Tabs.Panel>

            <Tabs.Panel value="code">
              <Box mt="md">
                <Textarea
                  label={
                    <Box component="span" color={darkMode ? 'gray.4' : 'dark'}>
                      Embed Code
                    </Box>
                  }
                  description={
                    <Box component="span" color={darkMode ? 'gray.6' : 'dimmed'}>
                      Paste your popup embed code here
                    </Box>
                  }
                  placeholder="<script>...</script>"
                  minRows={10}
                  value={embedCode}
                  onChange={handleEmbedCodeChange}
                  styles={(theme) => ({
                    input: {
                      fontFamily: 'monospace',
                      backgroundColor: darkMode ? theme.colors.dark[6] : theme.white,
                      color: darkMode ? theme.colors.gray[4] : theme.black,
                      borderColor: darkMode ? theme.colors.dark[4] : theme.colors.gray[4],
                    }
                  })}
                />
              </Box>
            </Tabs.Panel>
          </Tabs>

          <Divider 
            my="lg" 
            color={darkMode ? 'dark.4' : 'gray.3'} 
          />

          <Group position="apart">
            <Tooltip label="Reset playground">
              <ActionIcon 
                variant="light" 
                color="blue" 
                size="lg"
                onClick={handleClearTest}
              >
                <IconRefresh size={18} />
              </ActionIcon>
            </Tooltip>

            <Button 
              onClick={handleTestCode}
              disabled={!embedCode.trim()}
              loading={isLoading}
            >
              Test Popup
            </Button>
          </Group>
        </Paper>
      </Container>
    </Box>
  );
}

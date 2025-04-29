import { useNavigate, useLocation } from 'react-router-dom';
import { useUser, UserButton, SignInButton } from '@clerk/clerk-react';
import { 
  Container,
  Group,
  Button,
  Text,
  Box,
  rem,
  Menu,
  ActionIcon,
} from '@mantine/core';
import { IconMenu2 } from '@tabler/icons-react';
import { useWindowScroll } from '@mantine/hooks';

export default function Navbar() {
  const { isSignedIn, user, isLoaded } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [scroll] = useWindowScroll();

  const isAdmin = user?.publicMetadata?.role === 'admin';

  const handlePricingClick = (e) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete before scrolling
      setTimeout(() => {
        const pricingSection = document.getElementById('pricing-section');
        if (pricingSection) {
          pricingSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const pricingSection = document.getElementById('pricing-section');
      if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <Box
        component="nav"
        style={(theme) => ({
          backgroundColor: scroll.y > 0 ? 'rgba(255, 255, 255, 0.65)' : 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)', // For Safari support
          borderBottom: scroll.y > 0 ? `1px solid ${theme.colors.gray[2]}` : 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          transition: 'all 0.3s ease',
          boxShadow: scroll.y > 0 ? '0 4px 12px rgba(0, 0, 0, 0.03)' : 'none',
        })}
      >
        <Container 
          fluid 
          px={{ base: 'xs', sm: 36 }} 
          style={{ width: '100%' }}
        >
          <Group 
            justify="space-between"
            h={rem(60)} 
            px={{ base: 'xs', sm: 'md' }}
            wrap="nowrap"
          >
            {/* Logo */}
            <Text 
              size="xl" 
              fw={700} 
              onClick={() => navigate('/')} 
              style={{ cursor: 'pointer', flex: '0 0 auto' }}
            >
              Newsletter Popup
            </Text>

            {/* Desktop Navigation - Centered */}
            {isSignedIn && (
              <Group 
                visibleFrom="sm" 
                gap="xs"
                wrap="nowrap"
                style={{ 
                  flex: '1 1 auto',
                  justifyContent: 'center',
                }}
              >
                {isAdmin ? (
                  <Menu
                    width={200}
                    position="bottom-start"
                    transitionProps={{ transition: 'pop-top-left' }}
                    withinPortal
                  >
                    <Menu.Target>
                      <Button
                        variant="subtle"
                        px="xs"
                        size="sm"
                      >
                        Dashboard
                      </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item onClick={() => navigate('/dashboard/admin')}>
                        Admin Dashboard
                      </Menu.Item>
                      <Menu.Item onClick={() => navigate('/dashboard')}>
                        Main Dashboard
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                ) : (
                  <Button 
                    variant="subtle" 
                    onClick={() => navigate('/dashboard')}
                    px="xs"
                    size="sm"
                  >
                    Dashboard
                  </Button>
                )}
                <Button 
                  variant="subtle"
                  onClick={() => navigate('/dashboard/create')}
                  px="xs"
                  size="sm"
                >
                  Create Popup
                </Button>
                <Button 
                  variant="subtle"
                  onClick={() => navigate('/playground')}
                  px="xs"
                  size="sm"
                >
                  Playground
                </Button>
                <Button 
                  variant="subtle"
                  onClick={() => navigate('/upgrade')}
                  px="xs"
                  size="sm"
                >
                  Upgrade
                </Button>
              </Group>
            )}

            {/* Account Section - Desktop */}
            <Group visibleFrom="sm" gap="xs" wrap="nowrap" style={{ flex: '0 0 auto' }}>
              {isSignedIn ? (
                <>
                  <Text size="sm" fw={500} style={{ whiteSpace: 'nowrap' }}>{user.fullName}</Text>
                  <UserButton afterSignOutUrl="/" />
                </>
              ) : (
                <>
                  <Button 
                    variant="subtle"
                    onClick={handlePricingClick}
                    px="xs"
                    size="sm"
                  >
                    Pricing
                  </Button>
                  <SignInButton mode="modal">
                    <Button size="sm">Sign In</Button>
                  </SignInButton>
                </>
              )}
            </Group>

            {/* Mobile Menu */}
            <Menu shadow="md" width={200} hiddenFrom="sm">
              <Menu.Target>
                <ActionIcon variant="subtle" size="lg">
                  <IconMenu2 />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                {isSignedIn ? (
                  <>
                    <Menu.Label>Navigation</Menu.Label>
                    {isAdmin ? (
                      <>
                        <Menu.Item onClick={() => navigate('/dashboard/admin')}>
                          Admin Dashboard
                        </Menu.Item>
                        <Menu.Item onClick={() => navigate('/dashboard')}>
                          Main Dashboard
                        </Menu.Item>
                      </>
                    ) : (
                      <Menu.Item onClick={() => navigate('/dashboard')}>
                        Dashboard
                      </Menu.Item>
                    )}
                    <Menu.Item onClick={() => navigate('/dashboard/create')}>
                      Create Popup
                    </Menu.Item>
                    <Menu.Item onClick={() => navigate('/playground')}>
                      Playground
                    </Menu.Item>
                    <Menu.Item onClick={() => navigate('/upgrade')}>
                      Upgrade
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Label>Account</Menu.Label>
                    <Box p="xs">
                      <Group gap="sm" wrap="nowrap">
                        <UserButton 
                          afterSignOutUrl="/" 
                          appearance={{
                            elements: {
                              card: {
                                position: 'absolute',
                                inset: 'auto 0 auto 0',
                                margin: '1.5rem auto',
                                width: '90%',
                                maxWidth: '360px'
                              }
                            }
                          }}
                        />
                        <Text size="sm" fw={500}>{user.fullName}</Text>
                      </Group>
                    </Box>
                  </>
                ) : (
                  <Menu.Item>
                    <SignInButton mode="modal">
                      Sign In
                    </SignInButton>
                  </Menu.Item>
                )}
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Container>
      </Box>
      <Box style={{ height: rem(60) }} />
    </>
  );
}

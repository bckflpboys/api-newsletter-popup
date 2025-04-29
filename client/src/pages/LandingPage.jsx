import { useNavigate } from 'react-router-dom';
import { useUser, SignInButton, SignUpButton } from '@clerk/clerk-react';
import { 
  Container,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Card,
  SimpleGrid,
  List,
  ThemeIcon,
  rem,
  Box,
  Image,
  useMantineTheme,
  Badge,
  Tooltip,
  Accordion,
  Tabs
} from '@mantine/core';
import { IconCheck, IconPalette, IconCode, IconChartBar, IconClock } from '@tabler/icons-react';
import FAQ from '../components/FAQ';
import HowItWorks from '../components/HowItWorks';
import SocialProof from '../components/SocialProof';
import ContactUs from '../components/ContactUs';
import Footer from '../components/Footer';
import PricingSection from '../components/PricingSection';

const features = [
  {
    title: 'Custom Popups',
    description: 'Design beautiful newsletter popups that match your brand. Customize colors, timing, and content.',
    icon: IconPalette,
    color: 'violet',
  },
  {
    title: 'Easy Integration',
    description: 'Add your popup to any website with a single line of code. No technical knowledge required.',
    icon: IconCode,
    color: 'blue',
  },
  {
    title: 'Analytics Dashboard',
    description: 'Track subscriber growth and popup performance with our intuitive dashboard.',
    icon: IconChartBar,
    color: 'green',
  },
  {
    title: 'Smart Timing',
    description: 'Set the perfect moment to show your popup based on user behavior and engagement.',
    icon: IconClock,
    color: 'orange',
  },
];

const benefits = [
  'Unlimited popups and subscribers',
  'Real-time analytics',
  'Custom branding',
  'A/B testing capabilities',
  'Export subscriber data',
  'Advanced targeting options',
];

const tooltipProps = {
  position: "right",
  multiline: true,
  width: 160,
  transitionProps: { transition: 'fade', duration: 200 },
  color: "dark",
  withArrow: true,
  arrowSize: 6,
  styles: {
    tooltip: {
      fontSize: '0.875rem',
      padding: '0.75rem 1rem',
      lineHeight: 1.5,
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      border: '1px solid #333333',
      borderRadius: '6px',
      backgroundColor: '#ffffff',
      color: '#333333'
    },
    arrow: {
      border: '1px solid #333333'
    }
  }
};

export default function LandingPage() {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const theme = useMantineTheme();

  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing-section');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        style={(theme) => ({
          backgroundColor: theme.colors.blue[7],
          color: 'white',
          padding: `${rem(10)} 0`,
          width: '100vw',
          maxWidth: '100%',
        })}
      >
        <Container fluid px="md" style={{ width: '100%' }}>
          <Stack align="center" spacing="xl" py={80}>
            <Title order={1} size={rem(48)} ta="center" style={{ maxWidth: '800px' }}>
              Create Beautiful Newsletter Popups
              <Text span inherit c="yellow"> in Minutes</Text>
            </Title>
            <Text size="xl" ta="center" style={{ maxWidth: '600px' }}>
              Convert more visitors into subscribers with customizable, 
              high-converting newsletter popups. No coding required.
            </Text>
            <Group justify="center" mt="xl">
              {!isSignedIn && (
                <>
                  <Button 
                    size="lg" 
                    color="yellow"
                    onClick={scrollToPricing}
                  >
                    Get Started Free
                  </Button>
                  <SignInButton mode="modal">
                    <Button 
                      size="lg" 
                      variant="white" 
                      c="dark"
                    >
                      Sign In
                    </Button>
                  </SignInButton>
                </>
              )}
              <Button
                size="lg"
                variant="outline"
                color="white"
                onClick={() => navigate('/integrations')}
              >
                Integrations
              </Button>
            </Group>
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Container size="xl" px="md" py={20} style={{ width: '100%' }}>
        <Stack align="center" spacing="xl">
          <Title order={2} size={rem(36)} ta="center" style={{ maxWidth: '800px', marginBottom: '3rem', marginTop: '2rem' }}>
            Everything You Need to Grow Your Email List
          </Title>
          <SimpleGrid 
            cols={{ base: 1, sm: 2 }}
            spacing={30} 
            style={{ width: '100%' }}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  shadow="sm" 
                  padding="xl" 
                  radius="md" 
                  style={{ height: '100%' }}
                  withBorder
                >
                  <Stack justify="flex-start" spacing="md">
                    <ThemeIcon 
                      size={50} 
                      radius="md" 
                      variant="light" 
                      color={feature.color}
                      style={{ marginBottom: '0.5rem' }}
                    >
                      <Icon size={26} />
                    </ThemeIcon>
                    <Title order={3} size="h4" style={{ marginTop: '0.5rem' }}>
                      {feature.title}
                    </Title>
                    <Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
                      {feature.description}
                    </Text>
                  </Stack>
                </Card>
              );
            })}
          </SimpleGrid>
        </Stack>
      </Container>

      {/* Benefits Section */}
      <Box bg="gray.0" py={60} style={{ width: '100vw', maxWidth: '100%' }}>
        <Container size="xl" px="md" style={{ width: '100%' }}>
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing={{ base: 30, md: 50 }}>
            <Stack justify="center" spacing="xl" style={{ 
              textAlign: { base: 'center', md: 'left' },
              alignItems: { base: 'center', md: 'flex-start' }
            }}>
              <Title 
                order={2} 
                size={rem(36)} 
                style={{ 
                  marginBottom: '1rem',
                  textAlign: { base: 'center', md: 'left' }
                }}
              >
                Built for Modern Creators
              </Title>
              <List
                spacing="lg"
                size="lg"
                icon={
                  <ThemeIcon size={22} radius="xl" color="blue.6">
                    <IconCheck style={{ width: rem(14), height: rem(14) }} />
                  </ThemeIcon>
                }
                sx={(theme) => ({
                  item: {
                    paddingLeft: '1rem',
                    textAlign: 'left',
                    [theme.fn.smallerThan('md')]: {
                      justifyContent: 'center',
                    }
                  },
                })}
              >
                {benefits.map((benefit, index) => (
                  <List.Item 
                    key={index}
                    style={{
                      fontSize: rem(18),
                      lineHeight: 1.6,
                    }}
                  >
                    {benefit}
                  </List.Item>
                ))}
              </List>
              <Button 
                size="lg"
                sx={(theme) => ({
                  root: {
                    marginTop: '1rem',
                    [theme.fn.smallerThan('md')]: {
                      alignSelf: 'center'
                    }
                  }
                })}
                variant="gradient"
                gradient={{ from: 'blue.6', to: 'cyan.4', deg: 90 }}
              >
                Start Growing Your List
              </Button>
            </Stack>
            <Box style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              position: 'relative',
              padding: '1rem'
            }}>
              <Image
                src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                alt="Analytics Dashboard"
                radius="lg"
                style={{ 
                  width: '100%', 
                  height: 'auto',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  transform: 'perspective(1000px) rotateY(-5deg)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'perspective(1000px) rotateY(0deg)',
                  }
                }}
              />
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Pricing Section */}
      <Box id="pricing-section">
        <PricingSection />
      </Box>

      {/* Social Proof Section */}
      <SocialProof />

      {/* FAQ Section */}
      <FAQ />

      {/* Contact Section */}
      <ContactUs />

      {/* Footer */}
      <Footer />
    </Box>
  );
}

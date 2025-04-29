import { 
  Container,
  Title,
  Text,
  Card,
  Group,
  Badge,
  Button,
  List,
  ThemeIcon,
  SimpleGrid,
  rem,
  Box,
  Tooltip,
  Stack,
  useMantineTheme
} from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useUser, SignUpButton } from '@clerk/clerk-react';

const tooltipProps = {
  position: "right",
  multiline: true,
  width: 160,
  transitionProps: { transition: 'fade', duration: 200 },
  color: "dark",
  withArrow: true,
  arrowSize: 6,
  styles: (theme) => ({
    tooltip: {
      fontSize: '0.875rem',
      padding: '0.75rem 1rem',
      lineHeight: 1.5,
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: '#333333',
      borderRadius: '6px',
      backgroundColor: '#ffffff',
      color: '#333333'
    },
    arrow: {
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: '#333333'
    }
  })
};

const plans = [
  {
    title: 'Free',
    price: '$0',
    period: 'Get started now',
    features: [
      { text: '1 Basic Popup', tooltip: 'Create one popup with our basic templates and easy customization options' },
      { text: 'Up to 1,000 Subscribers', tooltip: 'Collect up to 1,000 subscribers from your popup forms' },
      { text: 'Basic Analytics', tooltip: 'View basic metrics like views and conversion rates' },
      { text: 'Community Support', tooltip: 'Access our community forum and helpful documentation' }
    ],
    color: 'blue',
    variant: 'light',
    popular: false
  },
  {
    title: 'Single Popup',
    price: '$2',
    period: 'One-time payment',
    features: [
      { text: '1 Premium Popup', tooltip: 'Create one popup with premium templates and advanced options' },
      { text: 'Up to 10,000 Subscribers', tooltip: 'Collect up to 10,000 subscribers from your popups' },
      { text: 'Basic Analytics', tooltip: 'Track detailed performance with conversion analytics' },
      { text: '30 Days Support', tooltip: 'Get dedicated email support for your first month' }
    ],
    color: 'blue',
    variant: 'gradient',
    gradient: { from: 'blue.6', to: 'cyan.4' },
    popular: true,
    badge: 'Most Popular'
  },
  {
    title: 'Starter',
    price: '$5',
    period: 'per month',
    features: [
      { text: '3 Popup Designs', tooltip: 'Create up to 3 popups with premium templates and full control' },
      { text: 'Up to 25,000 Subscribers', tooltip: 'Collect up to 25,000 subscribers across all your popups' },
      { text: 'A/B Testing', tooltip: 'Test different popup variants to maximize conversions' },
      { text: 'Advanced Analytics', tooltip: 'Track user behavior and export detailed analytics reports' },
      { text: 'Priority Support', tooltip: 'Get priority support with 24-hour response time' }
    ],
    color: 'blue',
    variant: 'light',
    popular: false
  },
  {
    title: 'Pro',
    price: '$29',
    period: 'per month',
    features: [
      { text: 'Unlimited Popups', tooltip: 'Create unlimited popups with premium templates and custom CSS' },
      { text: 'Up to 100,000 Subscribers', tooltip: 'Collect up to 100,000 subscribers across all your websites' },
      { text: 'Email Campaign Tools', tooltip: 'Send targeted email campaigns with advanced automation' },
      { text: 'A/B Testing', tooltip: 'Test different popup variants to maximize conversions' },
      { text: 'Premium Support', tooltip: 'Get premium support with video calls and fast responses' }
    ],
    color: 'orange',
    variant: 'gradient',
    gradient: { from: 'orange.6', to: 'yellow.4' },
    popular: false,
    badge: 'Premium Suite'
  }
];

export default function PricingSection() {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const { isSignedIn } = useUser();

  const renderGetStartedButton = (plan) => {
    if (plan.title === 'Free' && !isSignedIn) {
      return (
        <SignUpButton mode="modal">
          <Button
            variant={plan.variant}
            color={plan.color}
            fullWidth
            mt="auto"
            gradient={plan.gradient}
          >
            Get Started
          </Button>
        </SignUpButton>
      );
    }

    return (
      <Button
        variant={plan.variant}
        color={plan.color}
        fullWidth
        mt="auto"
        gradient={plan.gradient}
        onClick={() => {
          console.log(`Selected plan: ${plan.title}`);
        }}
      >
        Get Started
      </Button>
    );
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        style={{
          backgroundColor: theme.colors.blue[7],
          color: 'white',
          padding: `${rem(10)} 0`,
          width: '100vw',
          maxWidth: '100%',
        }}
      >
        <Container fluid px="md" style={{ width: '100%' }}>
          <Stack align="center" spacing="xl" py={80}>
            <Title order={1} size={rem(48)} ta="center" style={{ maxWidth: '800px' }}>
              Choose Your Perfect Plan
              <Text span inherit c="yellow"> and Grow</Text>
            </Title>
            <Text size="xl" ta="center" style={{ maxWidth: '600px' }}>
              Unlock powerful features and grow your email list with our flexible pricing plans. 
              Choose the plan that best fits your needs.
            </Text>
          </Stack>
        </Container>
      </Box>

      {/* Pricing Section */}
      <Container size="xl" px="md" py={60}>
        <Stack align="center" spacing="xl" mb={40}>
          <Title order={2} size={rem(36)} ta="center" style={{ maxWidth: '800px' }}>
            Upgrade Plan
          </Title>
          <Text size="lg" c="dimmed" ta="center" style={{ maxWidth: '600px' }}>
            Choose the plan that best fits your needs. All plans include analytics and customization options.
          </Text>
        </Stack>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing={30}>
          {plans.map((plan) => (
            <Card
              key={plan.title}
              shadow="sm"
              padding="xl"
              radius="md"
              withBorder
              sx={{ 
                minWidth: '320px'
              }}
              style={{ 
                ...(plan.title === 'Single Popup' && {
                  border: '1px solid var(--mantine-color-blue-6)',
                  background: 'linear-gradient(to bottom right, var(--mantine-color-blue-0), white)'
                }),
                ...(plan.title === 'Pro' && {
                  border: '1px solid var(--mantine-color-orange-6)',
                  background: 'linear-gradient(to bottom right, var(--mantine-color-orange-0), white)'
                })
              }}
            >
              <Stack spacing="sm" style={{ height: '100%' }}>
                <Group position="apart">
                  <Text size="lg" fw={500} c={plan.popular || plan.badge ? `${plan.color}.6` : 'dimmed'}>
                    {plan.title}
                  </Text>
                  {plan.badge && (
                    <Badge variant="filled" color={plan.color}>
                      {plan.badge}
                    </Badge>
                  )}
                </Group>

                <Group spacing="xs">
                  <Title order={3} size="h2">{plan.price}</Title>
                  {plan.period !== 'Get started now' && (
                    <Text size="sm" c="dimmed" style={{ alignSelf: 'flex-end' }}>
                      {plan.period}
                    </Text>
                  )}
                </Group>

                <Text size="sm" c="dimmed">
                  {plan.period === 'Get started now' ? plan.period : 'Perfect for your needs'}
                </Text>

                <List
                  spacing="sm"
                  size="sm"
                  mt="md"
                  icon={
                    <ThemeIcon size={20} radius="xl" color={`${plan.color}.6`}>
                      <IconCheck style={{ width: rem(12), height: rem(12) }} />
                    </ThemeIcon>
                  }
                  styles={{
                    itemWrapper: {
                      width: '100%'
                    }
                  }}
                >
                  {plan.features.map((feature, index) => (
                    <Tooltip 
                      key={index}
                      label={feature.tooltip}
                      {...tooltipProps}
                    >
                      <List.Item>
                        {feature.text}
                      </List.Item>
                    </Tooltip>
                  ))}
                </List>

                {renderGetStartedButton(plan)}
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}

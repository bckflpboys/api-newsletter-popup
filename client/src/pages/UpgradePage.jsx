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
import FAQ from '../components/FAQ';
import PricingSection from '../components/PricingSection';

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

export default function UpgradePage() {
  const navigate = useNavigate();
  const theme = useMantineTheme();

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

  return (
    <Box>
      <PricingSection />
      <FAQ />
    </Box>
  );
}

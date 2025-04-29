import { 
  Container,
  Title,
  Text,
  Stack,
  SimpleGrid,
  Group,
  Badge,
  Paper,
  Avatar,
  Box,
  rem
} from '@mantine/core';
import { 
  IconBrandWordpress,
  IconBrandShopee,
  IconBrandWix,
  IconCode
} from '@tabler/icons-react';

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Content Creator",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?&w=100&h=100&dpr=2&q=80",
    quote: "I was able to double my subscriber count in just two months. The templates are beautiful and the analytics help me optimize my popups.",
  },
  {
    name: "Michael Chen",
    role: "E-commerce Owner",
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?&w=100&h=100&dpr=2&q=80",
    quote: "The ease of integration with Shopify and the customization options are fantastic. My conversion rate increased by 40%!",
  },
  {
    name: "Emma Davis",
    role: "Digital Marketer",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?&w=100&h=100&dpr=2&q=80",
    quote: "The A/B testing feature is a game-changer. I can now make data-driven decisions to improve my popup performance.",
  }
];

const stats = [
  { number: "10k+", label: "Active Users" },
  { number: "1M+", label: "Subscribers Collected" },
  { number: "98%", label: "Customer Satisfaction" }
];

export default function SocialProof() {
  return (
    <Box bg="gray.0" py={80} style={{ width: '100vw', maxWidth: '100%' }}>
      <Container size="xl">
        <Stack align="center" spacing={50}>
          {/* Testimonials */}
          <Stack align="center" spacing="lg">
            <Badge variant="filled" color="blue">TRUSTED BY CREATORS</Badge>
            <Title order={2} size={rem(36)} ta="center" style={{ maxWidth: '800px' }}>
              What Our Users Say
            </Title>
            <Text size="lg" c="dimmed" ta="center" style={{ maxWidth: '600px', marginBottom: '2rem' }}>
              Join thousands of satisfied customers who have grown their email lists with our popup builder
            </Text>
          </Stack>

          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing={30}>
            {testimonials.map((testimonial, index) => (
              <Paper
                key={index}
                shadow="sm"
                p="xl"
                radius="md"
                withBorder
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                <Text size="lg" style={{ flex: 1, fontStyle: 'italic', marginBottom: '1.5rem' }}>
                  "{testimonial.quote}"
                </Text>
                <Group>
                  <Avatar src={testimonial.image} alt={testimonial.name} radius="xl" size="lg" />
                  <div>
                    <Text size="sm" fw={500}>{testimonial.name}</Text>
                    <Text size="xs" c="dimmed">{testimonial.role}</Text>
                  </div>
                </Group>
              </Paper>
            ))}
          </SimpleGrid>

          {/* Integration Logos */}
          <Stack align="center" spacing="xl" mt={40}>
            <Text size="sm" c="dimmed" ta="center">
              WORKS WITH ALL MAJOR PLATFORMS
            </Text>
            <Group justify="center" gap={50} wrap="wrap">
              <IconBrandWordpress size={32} style={{ color: 'var(--mantine-color-gray-5)' }} />
              <IconBrandShopee size={32} style={{ color: 'var(--mantine-color-gray-5)' }} />
              <IconBrandWix size={32} style={{ color: 'var(--mantine-color-gray-5)' }} />
              <IconCode size={32} style={{ color: 'var(--mantine-color-gray-5)' }} />
            </Group>
          </Stack>

          {/* Stats */}
          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing={30} mt={20}>
            {stats.map((stat, index) => (
              <Stack key={index} align="center" spacing={0}>
                <Title order={2} size={rem(36)} c="blue">
                  {stat.number}
                </Title>
                <Text size="sm" c="dimmed">
                  {stat.label}
                </Text>
              </Stack>
            ))}
          </SimpleGrid>
        </Stack>
      </Container>
    </Box>
  );
}

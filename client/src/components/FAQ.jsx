import { 
  Container,
  Title,
  Text,
  Card,
  SimpleGrid,
  Tabs,
  rem,
  ThemeIcon,
  Group,
  Stack,
  Box
} from '@mantine/core';
import { 
  IconPalette,
  IconChartBar,
  IconCode,
  IconClock,
  IconDevices,
  IconApi,
  IconHeadset,
  IconBook,
  IconBulb
} from '@tabler/icons-react';

export default function FAQ() {
  return (
    <Container size="xl" px="md" py={80} id="qa">
      <Stack align="center" spacing={40}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Text size="lg" fw={500} c="blue.6" mb={8}>GOT QUESTIONS?</Text>
          <Title order={2} size={rem(36)} style={{ maxWidth: '800px' }}>
            Frequently Asked Questions
          </Title>
          <Text c="dimmed" size="lg" mt="md" style={{ maxWidth: '600px', margin: '0 auto' }}>
            Everything you need to know about our popup builder. Can't find the answer you're looking for? Reach out to our support team.
          </Text>
        </div>

        <Tabs 
          variant="pills" 
          defaultValue="general" 
          style={{ width: '100%', maxWidth: '1200px' }}
        >
          <Tabs.List position="center" mb="xl">
            <Tabs.Tab 
              value="general" 
              style={{ 
                fontSize: '1.1rem',
                padding: '1rem 2rem',
                fontWeight: 500
              }}
            >
              General
            </Tabs.Tab>
            <Tabs.Tab 
              value="integration" 
              style={{ 
                fontSize: '1.1rem',
                padding: '1rem 2rem',
                fontWeight: 500
              }}
            >
              Integration
            </Tabs.Tab>
            <Tabs.Tab 
              value="support" 
              style={{ 
                fontSize: '1.1rem',
                padding: '1rem 2rem',
                fontWeight: 500
              }}
            >
              Support
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="general">
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
              {[
                {
                  question: "What is the Newsletter Popup Builder?",
                  answer: "The Newsletter Popup Builder is a tool designed to help you create and manage popups for collecting email subscriptions, enhancing your email list growth.",
                  icon: IconPalette,
                  color: "violet"
                },
                {
                  question: "How does it help grow my email list?",
                  answer: "By using targeted popups, you can engage visitors and encourage them to subscribe, thus growing your email list effectively.",
                  icon: IconChartBar,
                  color: "blue"
                },
                {
                  question: "Do I need any coding knowledge?",
                  answer: "No coding knowledge is required. Our tool is user-friendly and designed for ease of use.",
                  icon: IconCode,
                  color: "green"
                },
                {
                  question: "What features are included?",
                  answer: "Our tool includes customizable templates, advanced targeting options, A/B testing capabilities, and comprehensive analytics.",
                  icon: IconClock,
                  color: "orange"
                }
              ].map((faq, index) => {
                const Icon = faq.icon;
                return (
                  <Card
                    key={index}
                    shadow="sm"
                    padding={0}
                    radius="lg"
                    withBorder
                    style={{
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <Box
                      style={{
                        background: `linear-gradient(45deg, var(--mantine-color-${faq.color}-6), var(--mantine-color-${faq.color}-4))`,
                        padding: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem'
                      }}
                    >
                      <ThemeIcon 
                        size={40} 
                        radius="md" 
                        variant="filled" 
                        color="white" 
                        style={{ background: 'rgba(255,255,255,0.2)' }}
                      >
                        <Icon size={24} />
                      </ThemeIcon>
                      <Text fw={500} size="lg" c="white" style={{ flex: 1 }}>
                        {faq.question}
                      </Text>
                    </Box>
                    <Box p="lg">
                      <Text size="md" c="dimmed" style={{ lineHeight: 1.6 }}>
                        {faq.answer}
                      </Text>
                    </Box>
                  </Card>
                );
              })}
            </SimpleGrid>
          </Tabs.Panel>

          <Tabs.Panel value="integration">
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
              {[
                {
                  question: "How do I integrate with my website?",
                  answer: "Simply add our script to your website's header. We provide step-by-step integration guides for all major platforms.",
                  icon: IconCode,
                  color: "blue"
                },
                {
                  question: "Is it compatible with my CMS?",
                  answer: "Yes, our tool works with all major CMS platforms including WordPress, Shopify, Wix, and custom websites.",
                  icon: IconDevices,
                  color: "green"
                },
                {
                  question: "Can I customize the popup design?",
                  answer: "Absolutely! You can fully customize the design to match your brand using our visual editor.",
                  icon: IconPalette,
                  color: "violet"
                },
                {
                  question: "Do you offer API access?",
                  answer: "Yes, we provide API access for advanced integrations and custom implementations.",
                  icon: IconApi,
                  color: "orange"
                }
              ].map((faq, index) => {
                const Icon = faq.icon;
                return (
                  <Card
                    key={index}
                    shadow="sm"
                    padding={0}
                    radius="lg"
                    withBorder
                    style={{
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <Box
                      style={{
                        background: `linear-gradient(45deg, var(--mantine-color-${faq.color}-6), var(--mantine-color-${faq.color}-4))`,
                        padding: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem'
                      }}
                    >
                      <ThemeIcon 
                        size={40} 
                        radius="md" 
                        variant="filled" 
                        color="white" 
                        style={{ background: 'rgba(255,255,255,0.2)' }}
                      >
                        <Icon size={24} />
                      </ThemeIcon>
                      <Text fw={500} size="lg" c="white" style={{ flex: 1 }}>
                        {faq.question}
                      </Text>
                    </Box>
                    <Box p="lg">
                      <Text size="md" c="dimmed" style={{ lineHeight: 1.6 }}>
                        {faq.answer}
                      </Text>
                    </Box>
                  </Card>
                );
              })}
            </SimpleGrid>
          </Tabs.Panel>

          <Tabs.Panel value="support">
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
              {[
                {
                  question: "What kind of support do you offer?",
                  answer: "We offer email support for all plans, with priority support and video calls available for higher-tier plans.",
                  icon: IconHeadset,
                  color: "blue"
                },
                {
                  question: "How quickly do you respond?",
                  answer: "We typically respond within 24 hours, with faster response times for priority support customers.",
                  icon: IconClock,
                  color: "green"
                },
                {
                  question: "Do you have documentation?",
                  answer: "Yes, we provide comprehensive documentation and video tutorials to help you get started.",
                  icon: IconBook,
                  color: "violet"
                },
                {
                  question: "Can I request new features?",
                  answer: "Absolutely! We welcome feature requests and regularly update our tool based on user feedback.",
                  icon: IconBulb,
                  color: "orange"
                }
              ].map((faq, index) => {
                const Icon = faq.icon;
                return (
                  <Card
                    key={index}
                    shadow="sm"
                    padding={0}
                    radius="lg"
                    withBorder
                    style={{
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <Box
                      style={{
                        background: `linear-gradient(45deg, var(--mantine-color-${faq.color}-6), var(--mantine-color-${faq.color}-4))`,
                        padding: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem'
                      }}
                    >
                      <ThemeIcon 
                        size={40} 
                        radius="md" 
                        variant="filled" 
                        color="white" 
                        style={{ background: 'rgba(255,255,255,0.2)' }}
                      >
                        <Icon size={24} />
                      </ThemeIcon>
                      <Text fw={500} size="lg" c="white" style={{ flex: 1 }}>
                        {faq.question}
                      </Text>
                    </Box>
                    <Box p="lg">
                      <Text size="md" c="dimmed" style={{ lineHeight: 1.6 }}>
                        {faq.answer}
                      </Text>
                    </Box>
                  </Card>
                );
              })}
            </SimpleGrid>
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
}

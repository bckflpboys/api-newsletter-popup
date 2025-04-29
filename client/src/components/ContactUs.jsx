import { useState } from 'react';
import {
  Container,
  Title,
  Text,
  TextInput,
  Textarea,
  Button,
  Group,
  Stack,
  Paper,
  useMantineTheme,
  SimpleGrid,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconMail, IconPhone, IconMapPin } from '@tabler/icons-react';

export default function ContactUs() {
  const theme = useMantineTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    notifications.show({
      title: 'Message Sent',
      message: 'Thank you for contacting us. We\'ll get back to you soon!',
      color: 'green',
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const contactInfo = [
    {
      icon: IconMail,
      title: 'Email',
      value: 'support@newsletter-popup.com',
    },
    {
      icon: IconPhone,
      title: 'Phone',
      value: '+1 (555) 123-4567',
    },
    {
      icon: IconMapPin,
      title: 'Address',
      value: '123 Newsletter Street, San Francisco, CA 94105',
    },
  ];

  return (
    <Container size="lg" py="xl">
      <Stack spacing="xl">
        <Stack spacing="xs" align="center">
          <Title order={2} size="h2" ta="center">
            Get in Touch
          </Title>
          <Text c="dimmed" size="lg" maw={600} ta="center" px="md">
            Have questions or need assistance? We're here to help! Reach out to our team using the form below.
          </Text>
        </Stack>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
          {/* Contact Form */}
          <Paper shadow="md" radius="lg" p="xl" withBorder>
            <form onSubmit={handleSubmit}>
              <Stack spacing="md">
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                  <TextInput
                    label="Name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange('name')}
                    required
                  />
                  <TextInput
                    label="Email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange('email')}
                    required
                  />
                </SimpleGrid>
                <TextInput
                  label="Subject"
                  placeholder="How can we help?"
                  value={formData.subject}
                  onChange={handleChange('subject')}
                  required
                />
                <Textarea
                  label="Message"
                  placeholder="Your message"
                  minRows={4}
                  value={formData.message}
                  onChange={handleChange('message')}
                  required
                />
                <Button 
                  type="submit" 
                  size="md"
                  fullWidth
                >
                  Send Message
                </Button>
              </Stack>
            </form>
          </Paper>

          {/* Contact Information */}
          <Stack spacing="xl">
            {contactInfo.map((item, index) => (
              <Paper
                key={index}
                shadow="md"
                radius="lg"
                p="xl"
                withBorder
                style={{
                  backgroundColor: theme.colors.blue[0],
                }}
              >
                <Group wrap="nowrap">
                  <item.icon 
                    size={20} 
                    stroke={1.5} 
                    color={theme.colors.blue[6]} 
                  />
                  <Stack spacing={0}>
                    <Text fw={500}>{item.title}</Text>
                    <Text size="sm" c="dimmed" style={{ wordBreak: 'break-word' }}>
                      {item.value}
                    </Text>
                  </Stack>
                </Group>
              </Paper>
            ))}
          </Stack>
        </SimpleGrid>
      </Stack>
    </Container>
  );
}

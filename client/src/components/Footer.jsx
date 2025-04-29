import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Group,
  Text,
  Stack,
  ActionIcon,
  Divider,
  Title,
  Anchor,
  useMantineTheme,
  Paper,
  SimpleGrid,
  rem,
  Tooltip,
  Center,
  BackgroundImage,
} from '@mantine/core';
import {
  IconBrandTwitter,
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandDiscord,
  IconMail,
  IconHeart,
} from '@tabler/icons-react';

export default function Footer() {
  const theme = useMantineTheme();

  const links = {
    product: [
      { label: 'Features', link: '/features' },
      { label: 'Pricing', link: '/pricing' },
      { label: 'Playground', link: '/playground' },
      { label: 'Examples', link: '/examples' },
      { label: 'Templates', link: '/templates' },
    ],
    resources: [
      { label: 'Documentation', link: '/docs' },
      { label: 'API Reference', link: '/api' },
      { label: 'Guides', link: '/guides' },
      { label: 'Blog', link: '/blog' },
      { label: 'Support', link: '/support' },
    ],
    company: [
      { label: 'About Us', link: '/about' },
      { label: 'Contact', link: '/contact' },
      { label: 'Privacy Policy', link: '/privacy' },
      { label: 'Terms of Service', link: '/terms' },
      { label: 'Status', link: '/status' },
    ],
  };

  const socials = [
    { icon: IconBrandTwitter, link: 'https://twitter.com/popupmanager', color: '#1DA1F2' },
    { icon: IconBrandGithub, link: 'https://github.com/popupmanager', color: '#333' },
    { icon: IconBrandLinkedin, link: 'https://linkedin.com/company/popupmanager', color: '#0077B5' },
    { icon: IconBrandDiscord, link: 'https://discord.gg/popupmanager', color: '#7289DA' },
    { icon: IconMail, link: 'mailto:support@popupmanager.com', color: '#EA4335' },
  ];

  return (
    <Box
      component="footer"
      sx={(theme) => ({
        position: 'relative',
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[0],
        color: theme.colorScheme === 'dark' ? theme.colors.gray[0] : theme.colors.dark[9],
        paddingTop: theme.spacing.xl * 2,
        paddingBottom: theme.spacing.xl * 2,
        overflow: 'hidden',
      })}
    >
      <BackgroundImage
        src="/path/to/background-image.jpg"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          zIndex: 0,
        }}
      />
      <Container size="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <SimpleGrid
          cols={{ base: 1, sm: 2, md: 4 }}
          spacing={{ base: 30, md: 50 }}
          verticalSpacing={{ base: 30, md: 50 }}
        >
          {/* Brand Section */}
          <Stack spacing="lg" align={{ base: 'center', sm: 'flex-start' }}>
            <Box sx={{ textAlign: { base: 'center', sm: 'left' }, maxWidth: 300 }}>
              <Title order={4} mb="md" sx={{ fontFamily: 'Poppins, sans-serif' }}>Newsletter Popup Manager</Title>
              <Text size="sm" mb="lg" sx={{ fontFamily: 'Roboto, sans-serif' }}>
                Create beautiful, customizable newsletter popups to grow your email list.
                Easy to set up, powerful to use.
              </Text>
            </Box>
            
            {/* Social Links */}
            <Group spacing="xs" position={{ base: 'center', sm: 'left' }}>
              {socials.map((social, index) => (
                <Tooltip key={index} label={social.link.split('/').pop()}>
                  <ActionIcon
                    size="lg"
                    variant="light"
                    component="a"
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={(theme) => ({
                      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                      color: social.color,
                      '&:hover': {
                        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
                        transform: 'translateY(-2px)',
                        transition: 'transform 0.2s ease',
                      },
                    })}
                  >
                    <social.icon size={22} />
                  </ActionIcon>
                </Tooltip>
              ))}
            </Group>
          </Stack>

          {/* Links Sections */}
          {Object.entries(links).map(([category, items]) => (
            <Stack 
              key={category} 
              spacing="xs"
              align={{ base: 'center', sm: 'flex-start' }}
            >
              <Text 
                transform="uppercase" 
                weight={700} 
                mb="md"
                align={{ base: 'center', sm: 'left' }}
                sx={{
                  fontFamily: 'Poppins, sans-serif',
                  letterSpacing: '0.1em',
                }}
              >
                {category}
              </Text>
              {items.map((link, index) => (
                <Anchor
                  key={index}
                  component={Link}
                  to={link.link}
                  size="sm"
                  sx={(theme) => ({
                    transition: 'all 0.2s ease',
                    textAlign: 'center',
                    fontFamily: 'Roboto, sans-serif',
                    '&:hover': {
                      textDecoration: 'none',
                      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
                      transform: 'translateX(5px)',
                    },
                  })}
                >
                  {link.label}
                </Anchor>
              ))}
            </Stack>
          ))}
        </SimpleGrid>

        <Divider my={rem(50)} />

        {/* Bottom Section */}
        <Group 
          position="apart" 
          align="center"
          spacing={50}
          sx={(theme) => ({
            flexDirection: { base: 'column', sm: 'row' },
            gap: theme.spacing.md,
          })}
        >
          <Group spacing="md" position="center" align="center">
            <Text size="sm" sx={{ fontFamily: 'Roboto, sans-serif' }}>
              {new Date().getFullYear()} Newsletter Popup Manager
            </Text>
            <Divider orientation="vertical" />
            <Group spacing={5} align="center">
              <Text size="sm" sx={{ fontFamily: 'Roboto, sans-serif' }}>Made with</Text>
              <IconHeart size={16} style={{ color: '#ff0000' }} />
              <Text size="sm" sx={{ fontFamily: 'Roboto, sans-serif' }}>for the web</Text>
            </Group>
          </Group>

          <Paper
            radius="xl"
            p={3}
            sx={(theme) => ({
              background: theme.fn.linearGradient(45, theme.colors.blue[5], theme.colors.cyan[5]),
            })}
          >
            <Paper
              radius="xl"
              px="xl"
              py={7}
              withBorder={theme.colorScheme === 'dark'}
              sx={(theme) => ({
                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
              })}
            >
              <Group spacing="md" position="center">
                <Group spacing={8}>
                  <Text size="sm" weight={500} sx={{ fontFamily: 'Roboto, sans-serif' }}>v1.0.0</Text>
                  <Box
                    sx={(theme) => ({
                      width: rem(6),
                      height: rem(6),
                      borderRadius: '50%',
                      backgroundColor: theme.colors.green[5],
                    })}
                  />
                  <Text size="sm" sx={{ fontFamily: 'Roboto, sans-serif' }}>All systems operational</Text>
                </Group>
              </Group>
            </Paper>
          </Paper>
        </Group>
      </Container>
    </Box>
  );
}

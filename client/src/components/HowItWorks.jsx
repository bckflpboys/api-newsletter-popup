import { 
  Container,
  Title,
  Text,
  Button,
  Stack,
  Timeline,
  rem,
  Box,
  Paper,
} from '@mantine/core';
import { 
  IconPalette, 
  IconCode, 
  IconChartBar, 
  IconStars,
  IconArrowRight
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { keyframes } from '@emotion/react';

export default function HowItWorks() {
  const navigate = useNavigate();
  const timelineRef = useRef(null);
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: Array.from({ length: 101 }, (_, i) => i / 100),
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          setScrollProgress(0);
          return;
        }

        const elementTop = entry.boundingClientRect.top;
        const elementHeight = entry.boundingClientRect.height;
        const windowHeight = window.innerHeight;
        const halfwayPoint = windowHeight * 0.5;

        let progress;
        if (elementTop >= halfwayPoint) {
          progress = 0;
        } else {
          const visibleAmount = halfwayPoint - elementTop;
          const maxDistance = elementHeight + halfwayPoint;
          progress = Math.max(0, Math.min(1, visibleAmount / maxDistance));
        }

        setScrollProgress(progress);
      });
    }, options);

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const fadeIn = keyframes({
    from: {
      opacity: 0,
      transform: 'translateY(20px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  });

  const activePoints = Math.min(4, Math.floor(scrollProgress * 5));
  const gradientProgress = (scrollProgress * 5) % 1;

  const timelineStyle = {
    '.mantine-Timeline-item::before': {
      background: `linear-gradient(to bottom, 
        var(--mantine-primary-color-filled) ${(activePoints + gradientProgress) * 100}%, 
        var(--mantine-primary-color-filled) ${(activePoints + gradientProgress) * 100 + 2}%,
        rgba(var(--mantine-primary-color-rgb), 0.3) ${(activePoints + gradientProgress) * 100 + 15}%, 
        var(--mantine-color-gray-3) ${(activePoints + gradientProgress) * 100 + 30}%)`,
      transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    '.mantine-Timeline-item': {
      paddingLeft: '2rem',
    },
    '.mantine-Timeline-itemBullet': {
      background: 'var(--mantine-primary-color-filled)',
      border: 'none',
      boxShadow: '0 0 15px 2px rgba(var(--mantine-primary-color-rgb), 0.4)',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        transform: 'scale(1.15)',
        boxShadow: '0 0 20px 5px rgba(var(--mantine-primary-color-rgb), 0.6)',
      },
    },
    '.mantine-Timeline-item[data-line-active]::before': {
      transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    '.mantine-Timeline-item[data-active]': {
      '.mantine-Timeline-itemBullet': {
        background: 'var(--mantine-primary-color-filled)',
        transform: 'scale(1.1)',
        boxShadow: '0 0 25px 8px rgba(var(--mantine-primary-color-rgb), 0.5)',
      },
    },
  };

  return (
    <Container ref={sectionRef} size="xl" px="md" py={120} style={{ display: 'flex', justifyContent: 'center' }}>
      <Stack 
        align="center" 
        spacing={48}
        style={{
          width: '100%',
          maxWidth: '1000px',
          margin: '0 auto',
        }}
      >
        <Box
          style={{
            animation: `${fadeIn} 1s ease`,
            textAlign: 'center',
            width: '100%',
          }}
        >
          <Title 
            order={2} 
            size={rem(42)} 
            fw={800}
            style={{ 
              marginBottom: '1.5rem',
              background: 'linear-gradient(45deg, var(--mantine-primary-color-filled), var(--mantine-color-cyan-5))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              maxWidth: '800px',
              margin: '0 auto 1.5rem',
            }}
          >
            Create Your First Popup in Minutes
          </Title>
          <Text size="xl" c="dimmed" maw={600} mx="auto" style={{ lineHeight: 1.6 }}>
            Follow these simple steps to start growing your email list today
          </Text>
        </Box>

        <Paper 
          shadow="sm" 
          radius="lg" 
          p={{ base: 20, sm: 40 }}
          style={{ 
            width: '100%',
            maxWidth: 900,
            margin: '0 auto',
            background: 'linear-gradient(180deg, var(--mantine-color-body) 0%, var(--mantine-color-gray-0) 100%)',
          }}
        >
          <Box 
            ref={timelineRef} 
            sx={(theme) => ({
              position: 'relative',
              marginLeft: 0,
              [theme.fn.largerThan('sm')]: {
                marginLeft: '40%'
              }
            })}
          >
            <Timeline 
              active={activePoints} 
              bulletSize={40} 
              lineWidth={3} 
              styles={timelineStyle}
              style={{ padding: '20px 0' }}
            >
              <Timeline.Item 
                bullet={<IconPalette size={20} />} 
                title={
                  <Text size="lg" fw={600} mb={7}>
                    Choose Your Template
                  </Text>
                }
              >
                <Text size="md" mb={7} style={{ lineHeight: 1.6 }}>
                  Select from our library of professionally designed templates
                </Text>
                <Text size="sm" c="dimmed">
                  Mobile-responsive designs for every use case
                </Text>
              </Timeline.Item>

              <Timeline.Item
                bullet={<IconCode size={20} />}
                title={
                  <Text size="lg" fw={600} mb={7}>
                    Customize Your Design
                  </Text>
                }
              >
                <Text size="md" mb={7} style={{ lineHeight: 1.6 }}>
                  Personalize colors, text, and timing to match your brand
                </Text>
                <Text size="sm" c="dimmed">
                  No coding required - use our visual editor
                </Text>
              </Timeline.Item>

              <Timeline.Item
                bullet={<IconChartBar size={20} />}
                title={
                  <Text size="lg" fw={600} mb={7}>
                    Add to Your Website
                  </Text>
                }
              >
                <Text size="md" mb={7} style={{ lineHeight: 1.6 }}>
                  Copy and paste a single line of code
                </Text>
                <Text size="sm" c="dimmed">
                  Works with all major platforms
                </Text>
              </Timeline.Item>

              <Timeline.Item
                bullet={<IconStars size={20} />}
                title={
                  <Text size="lg" fw={600} mb={7}>
                    Start Growing
                  </Text>
                }
              >
                <Text size="md" mb={7} style={{ lineHeight: 1.6 }}>
                  Watch your email list grow with real-time analytics
                </Text>
                <Text size="sm" c="dimmed">
                  Track performance and optimize conversion rates
                </Text>
              </Timeline.Item>
            </Timeline>
          </Box>
        </Paper>

        <Button 
          size="xl"
          radius="md"
          rightSection={<IconArrowRight size={20} />}
          onClick={() => navigate('/sign-up')}
          style={{
            background: 'linear-gradient(45deg, var(--mantine-primary-color-filled), var(--mantine-color-cyan-5))',
            transition: 'transform 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
            },
          }}
        >
          Start Creating Now
        </Button>
      </Stack>
    </Container>
  );
}

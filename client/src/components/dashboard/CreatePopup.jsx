import { useState } from 'react';
import { useClerk } from '@clerk/clerk-react';
import { 
  TextInput, 
  Button, 
  Group, 
  Stack, 
  Title, 
  Paper,
  ColorInput,
  Switch,
  Select,
  Code,
  CopyButton,
  Tooltip,
  Text
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { createPopup } from '../../utils/api';

const CreatePopup = () => {
  const { session } = useClerk();
  const [loading, setLoading] = useState(false);
  const [popupCode, setPopupCode] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    buttonText: 'Subscribe',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    buttonColor: '#007bff',
    buttonTextColor: '#ffffff',
    position: 'bottom-right',
    collectEmail: true,
    collectName: false,
    collectPhone: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = await session.getToken();
      const response = await createPopup(token, formData);
      setPopupCode(response.data.code);
      
      notifications.show({
        title: 'Success',
        message: 'Popup created successfully!',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to create popup',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Paper p="md" radius="md">
      <form onSubmit={handleSubmit}>
        <Stack spacing="md">
          <Title order={2}>Create New Popup</Title>

          <TextInput
            required
            label="Title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Enter popup title"
          />

          <TextInput
            required
            label="Description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Enter popup description"
          />

          <TextInput
            required
            label="Button Text"
            value={formData.buttonText}
            onChange={(e) => handleInputChange('buttonText', e.target.value)}
            placeholder="Enter button text"
          />

          <Group grow>
            <ColorInput
              label="Background Color"
              value={formData.backgroundColor}
              onChange={(value) => handleInputChange('backgroundColor', value)}
            />

            <ColorInput
              label="Text Color"
              value={formData.textColor}
              onChange={(value) => handleInputChange('textColor', value)}
            />
          </Group>

          <Group grow>
            <ColorInput
              label="Button Color"
              value={formData.buttonColor}
              onChange={(value) => handleInputChange('buttonColor', value)}
            />

            <ColorInput
              label="Button Text Color"
              value={formData.buttonTextColor}
              onChange={(value) => handleInputChange('buttonTextColor', value)}
            />
          </Group>

          <Select
            label="Position"
            value={formData.position}
            onChange={(value) => handleInputChange('position', value)}
            data={[
              { value: 'top-left', label: 'Top Left' },
              { value: 'top-right', label: 'Top Right' },
              { value: 'bottom-left', label: 'Bottom Left' },
              { value: 'bottom-right', label: 'Bottom Right' },
              { value: 'center', label: 'Center' },
            ]}
          />

          <Stack spacing="xs">
            <Switch
              label="Collect Email"
              checked={formData.collectEmail}
              onChange={(e) => handleInputChange('collectEmail', e.currentTarget.checked)}
            />

            <Switch
              label="Collect Name"
              checked={formData.collectName}
              onChange={(e) => handleInputChange('collectName', e.currentTarget.checked)}
            />

            <Switch
              label="Collect Phone"
              checked={formData.collectPhone}
              onChange={(e) => handleInputChange('collectPhone', e.currentTarget.checked)}
            />
          </Stack>

          <Button type="submit" loading={loading}>
            Create Popup
          </Button>

          {popupCode && (
            <Paper withBorder p="md" radius="md">
              <Group position="apart" mb="xs">
                <Text weight={500}>Installation Code</Text>
                <CopyButton value={popupCode}>
                  {({ copied, copy }) => (
                    <Tooltip label={copied ? 'Copied' : 'Copy'}>
                      <Button color={copied ? 'teal' : 'blue'} onClick={copy}>
                        {copied ? 'Copied' : 'Copy'}
                      </Button>
                    </Tooltip>
                  )}
                </CopyButton>
              </Group>
              <Code block>{popupCode}</Code>
            </Paper>
          )}
        </Stack>
      </form>
    </Paper>
  );
};

export default CreatePopup;

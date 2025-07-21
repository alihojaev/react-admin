import React from 'react';
import {
  TextInput,
  PasswordInput,
  NumberInput,
  Textarea,
  Select,
  MultiSelect,
  FileInput,
  Switch,
  Checkbox,
  Radio,
  ColorInput,
  SegmentedControl,
  Slider,
  RangeSlider,
  PinInput,
  JsonInput,
  Autocomplete,
  TagsInput,
  NativeSelect,
  Stack,
  Group,
  Paper,
  Title,
  Text,
  Box,
  Container,
  SimpleGrid,
  Button,
} from '@mantine/core';
import { IconUpload, IconEye, IconEyeOff, IconX, IconCheck } from '@tabler/icons-react';

// Basic Text Input with validation
export function ValidatedTextInput() {
  const [value, setValue] = React.useState('');
  const [error, setError] = React.useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setValue(newValue);
    
    if (newValue.length < 3) {
      setError('Value must be at least 3 characters long');
    } else {
      setError('');
    }
  };

  return (
    <TextInput
      label="Validated Input"
      placeholder="Enter at least 3 characters..."
      value={value}
      onChange={handleChange}
      error={error}
      rightSection={
        value.length >= 3 ? (
          <IconCheck size={16} style={{ color: 'var(--mantine-color-green-6)' }} />
        ) : null
      }
    />
  );
}

// Password Input with toggle visibility
export function PasswordInputWithToggle() {
  const [value, setValue] = React.useState('');

  return (
    <PasswordInput
      label="Password with Toggle"
      placeholder="Enter password..."
      value={value}
      onChange={(e) => setValue(e.target.value)}
      visibilityToggleIcon={({ reveal }) => (
        <Box style={{ cursor: 'pointer' }}>
          {reveal ? <IconEyeOff size={16} /> : <IconEye size={16} />}
        </Box>
      )}
    />
  );
}

// Number Input with currency formatting
export function CurrencyInput() {
  const [value, setValue] = React.useState<number | ''>('');

  return (
    <NumberInput
      label="Currency Input"
      placeholder="Enter amount..."
      value={value}
      onChange={(val) => setValue(typeof val === 'number' ? val : '')}
      leftSection="$"
      min={0}
      step={0.01}
    />
  );
}

// File Input with preview
export function FileInputWithPreview() {
  const [file, setFile] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  }, [file]);

  return (
    <Stack gap="xs">
      <FileInput
        label="Image Upload with Preview"
        placeholder="Upload image..."
        accept="image/*"
        value={file}
        onChange={setFile}
        leftSection={<IconUpload size={14} />}
        clearable
      />
      {preview && (
        <Box>
          <Text size="sm" fw={500} mb="xs">Preview:</Text>
          <img 
            src={preview} 
            alt="Preview" 
            style={{ 
              maxWidth: '200px', 
              maxHeight: '200px', 
              objectFit: 'cover',
              borderRadius: 'var(--mantine-radius-sm)'
            }} 
          />
        </Box>
      )}
    </Stack>
  );
}

// Search Input with suggestions
export function SearchInput() {
  const [value, setValue] = React.useState('');
  const [suggestions] = React.useState([
    'React', 'Angular', 'Vue', 'Svelte', 'Next.js', 'Nuxt.js', 'Gatsby', 'Remix'
  ]);

  const filteredSuggestions = suggestions.filter(item =>
    item.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <Autocomplete
      label="Search Frameworks"
      placeholder="Type to search..."
      value={value}
      onChange={setValue}
      data={filteredSuggestions}
      limit={5}
      rightSection={
        value && (
          <Box 
            style={{ cursor: 'pointer' }}
            onClick={() => setValue('')}
            p="xs"
          >
            <IconX size={16} />
          </Box>
        )
      }
    />
  );
}

// Rating Input using Segmented Control
export function RatingInput() {
  const [value, setValue] = React.useState('');

  return (
    <Box>
      <Text size="sm" fw={500} mb="xs">Rating</Text>
      <SegmentedControl
        value={value}
        onChange={setValue}
        data={[
          { label: '1', value: '1' },
          { label: '2', value: '2' },
          { label: '3', value: '3' },
          { label: '4', value: '4' },
          { label: '5', value: '5' },
        ]}
        fullWidth
      />
    </Box>
  );
}

// Color Palette Input
export function ColorPaletteInput() {
  const [value, setValue] = React.useState('#228be6');

  const colors = [
    '#228be6', '#40c057', '#fd7e14', '#e64980', '#be4bdb',
    '#7950f2', '#20c997', '#fa5252', '#868e96', '#495057'
  ];

  return (
    <ColorInput
      label="Color Palette"
      placeholder="Pick color"
      value={value}
      onChange={setValue}
      swatches={colors}
      swatchesPerRow={5}
    />
  );
}

// Multi-step Form Input
export function MultiStepInput() {
  const [step, setStep] = React.useState(1);
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    age: '',
    interests: [] as string[],
  });

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <TextInput
            label="Name"
            placeholder="Enter your name..."
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        );
      case 2:
        return (
          <TextInput
            label="Email"
            type="email"
            placeholder="Enter your email..."
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        );
      case 3:
        return (
          <NumberInput
            label="Age"
            placeholder="Enter your age..."
            value={formData.age}
            onChange={(value) => setFormData({ ...formData, age: value?.toString() || '' })}
            min={0}
            max={120}
          />
        );
      case 4:
        return (
          <MultiSelect
            label="Interests"
            placeholder="Select your interests..."
            data={['Reading', 'Gaming', 'Sports', 'Music', 'Travel', 'Cooking']}
            value={formData.interests}
            onChange={(value) => setFormData({ ...formData, interests: value })}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Stack gap="md">
      <Text size="sm" fw={500}>Step {step} of 4</Text>
      {renderStep()}
      <Group justify="space-between">
        <Button 
          variant="outline" 
          onClick={handlePrev} 
          disabled={step === 1}
        >
          Previous
        </Button>
        <Button 
          onClick={handleNext} 
          disabled={step === 4}
        >
          {step === 4 ? 'Finish' : 'Next'}
        </Button>
      </Group>
    </Stack>
  );
}

// All inputs component for easy import
export function AllInputs() {
  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="xl">Advanced Input Components</Title>
      
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
        <Paper shadow="xs" p="md" withBorder>
          <Title order={3} mb="md">Validation & Feedback</Title>
          <Stack gap="md">
            <ValidatedTextInput />
            <PasswordInputWithToggle />
            <CurrencyInput />
          </Stack>
        </Paper>

        <Paper shadow="xs" p="md" withBorder>
          <Title order={3} mb="md">File & Media</Title>
          <Stack gap="md">
            <FileInputWithPreview />
            <ColorPaletteInput />
          </Stack>
        </Paper>

        <Paper shadow="xs" p="md" withBorder>
          <Title order={3} mb="md">Search & Selection</Title>
          <Stack gap="md">
            <SearchInput />
            <RatingInput />
          </Stack>
        </Paper>

        <Paper shadow="xs" p="md" withBorder>
          <Title order={3} mb="md">Multi-step Form</Title>
          <MultiStepInput />
        </Paper>
      </SimpleGrid>
    </Container>
  );
} 
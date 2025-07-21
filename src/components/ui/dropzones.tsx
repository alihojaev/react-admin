import React, { useState, useCallback } from 'react';
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import {
  Text,
  Group,
  useMantineTheme,
  rem,
  Paper,
  Title,
  Stack,
  Container,
  SimpleGrid,
  Button,
  Box,
  Image,
  List,
  ThemeIcon,
  Badge,
} from '@mantine/core';
import { IconUpload, IconPhoto, IconX, IconFile, IconCheck } from '@tabler/icons-react';

// Basic Dropzone
export function BasicDropzone() {
  const theme = useMantineTheme();

  return (
    <Dropzone
      onDrop={(files) => console.log('accepted files', files)}
      onReject={(files) => console.log('rejected files', files)}
      maxSize={5 * 1024 ** 2}
      accept={IMAGE_MIME_TYPE}
    >
      <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
        <Dropzone.Accept>
          <IconUpload
            style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
            stroke={1.5}
          />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <IconX
            style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }}
            stroke={1.5}
          />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <IconPhoto style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }} stroke={1.5} />
        </Dropzone.Idle>

        <div>
          <Text size="xl" inline>
            Drag images here or click to select files
          </Text>
          <Text size="sm" c="dimmed" inline mt={7}>
            Attach as many files as you like, each file should not exceed 5mb
          </Text>
        </div>
      </Group>
    </Dropzone>
  );
}

// Dropzone with preview
export function DropzoneWithPreview() {
  const [files, setFiles] = useState<File[]>([]);

  const previews = files.map((file, index) => {
    const imageUrl = URL.createObjectURL(file);
    return (
      <Image
        key={index}
        src={imageUrl}
        alt={`Preview ${index}`}
        style={{ width: rem(100), height: rem(100), objectFit: 'cover' }}
        onLoad={() => URL.revokeObjectURL(imageUrl)}
      />
    );
  });

  return (
    <Stack gap="md">
      <Dropzone
        onDrop={setFiles}
        accept={IMAGE_MIME_TYPE}
        maxSize={5 * 1024 ** 2}
      >
        <Group justify="center" gap="xl" mih={120} style={{ pointerEvents: 'none' }}>
          <Dropzone.Accept>
            <IconUpload
              style={{ width: rem(32), height: rem(32), color: 'var(--mantine-color-blue-6)' }}
              stroke={1.5}
            />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX
              style={{ width: rem(32), height: rem(32), color: 'var(--mantine-color-red-6)' }}
              stroke={1.5}
            />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconPhoto style={{ width: rem(32), height: rem(32), color: 'var(--mantine-color-dimmed)' }} stroke={1.5} />
          </Dropzone.Idle>

          <div>
            <Text size="lg" inline>
              Drag images here or click to select files
            </Text>
            <Text size="sm" c="dimmed" inline mt={7}>
              Attach as many files as you like, each file should not exceed 5mb
            </Text>
          </div>
        </Group>
      </Dropzone>

      {previews.length > 0 && (
        <Box>
          <Text size="sm" fw={500} mb="xs">Preview:</Text>
          <Group gap="xs">
            {previews}
          </Group>
        </Box>
      )}
    </Stack>
  );
}

// Dropzone with file list
export function DropzoneWithFileList() {
  const [files, setFiles] = useState<File[]>([]);

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Stack gap="md">
      <Dropzone
        onDrop={handleDrop}
        accept={IMAGE_MIME_TYPE}
        maxSize={5 * 1024 ** 2}
      >
        <Group justify="center" gap="xl" mih={120} style={{ pointerEvents: 'none' }}>
          <Dropzone.Accept>
            <IconUpload
              style={{ width: rem(32), height: rem(32), color: 'var(--mantine-color-blue-6)' }}
              stroke={1.5}
            />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX
              style={{ width: rem(32), height: rem(32), color: 'var(--mantine-color-red-6)' }}
              stroke={1.5}
            />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconPhoto style={{ width: rem(32), height: rem(32), color: 'var(--mantine-color-dimmed)' }} stroke={1.5} />
          </Dropzone.Idle>

          <div>
            <Text size="lg" inline>
              Drag images here or click to select files
            </Text>
            <Text size="sm" c="dimmed" inline mt={7}>
              Attach as many files as you like, each file should not exceed 5mb
            </Text>
          </div>
        </Group>
      </Dropzone>

      {files.length > 0 && (
        <Box>
          <Text size="sm" fw={500} mb="xs">Uploaded Files ({files.length}):</Text>
          <List spacing="xs">
            {files.map((file, index) => (
              <List.Item
                key={index}
                icon={
                  <ThemeIcon color="blue" size={24} radius="xl">
                    <IconFile size={16} />
                  </ThemeIcon>
                }
              >
                <Group justify="space-between" wrap="nowrap">
                  <Box style={{ flex: 1 }}>
                    <Text size="sm" fw={500} truncate>
                      {file.name}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {formatFileSize(file.size)}
                    </Text>
                  </Box>
                  <Button
                    variant="subtle"
                    color="red"
                    size="xs"
                    onClick={() => removeFile(index)}
                  >
                    <IconX size={14} />
                  </Button>
                </Group>
              </List.Item>
            ))}
          </List>
        </Box>
      )}
    </Stack>
  );
}

// Dropzone with multiple file types
export function DropzoneMultipleTypes() {
  const [files, setFiles] = useState<File[]>([]);

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <IconPhoto size={16} />;
    if (file.type.includes('pdf')) return <IconFile size={16} />;
    if (file.type.includes('document') || file.type.includes('word')) return <IconFile size={16} />;
    return <IconFile size={16} />;
  };

  const getFileColor = (file: File) => {
    if (file.type.startsWith('image/')) return 'blue';
    if (file.type.includes('pdf')) return 'red';
    if (file.type.includes('document') || file.type.includes('word')) return 'green';
    return 'gray';
  };

  return (
    <Stack gap="md">
      <Dropzone
        onDrop={handleDrop}
        accept={IMAGE_MIME_TYPE}
        maxSize={10 * 1024 ** 2}
      >
        <Group justify="center" gap="xl" mih={120} style={{ pointerEvents: 'none' }}>
          <Dropzone.Accept>
            <IconUpload
              style={{ width: rem(32), height: rem(32), color: 'var(--mantine-color-blue-6)' }}
              stroke={1.5}
            />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX
              style={{ width: rem(32), height: rem(32), color: 'var(--mantine-color-red-6)' }}
              stroke={1.5}
            />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconUpload style={{ width: rem(32), height: rem(32), color: 'var(--mantine-color-dimmed)' }} stroke={1.5} />
          </Dropzone.Idle>

          <div>
            <Text size="lg" inline>
              Drag files here or click to select
            </Text>
            <Text size="sm" c="dimmed" inline mt={7}>
              Accepts images (max 10mb each)
            </Text>
          </div>
        </Group>
      </Dropzone>

      {files.length > 0 && (
        <Box>
          <Text size="sm" fw={500} mb="xs">Uploaded Files:</Text>
          <Group gap="xs">
            {files.map((file, index) => (
              <Badge
                key={index}
                variant="light"
                color={getFileColor(file)}
                size="lg"
                leftSection={getFileIcon(file)}
              >
                {file.name}
              </Badge>
            ))}
          </Group>
        </Box>
      )}
    </Stack>
  );
}

// Dropzone with custom styling
export function CustomStyledDropzone() {
  const theme = useMantineTheme();

  return (
    <Dropzone
      onDrop={(files) => console.log('accepted files', files)}
      onReject={(files) => console.log('rejected files', files)}
      maxSize={5 * 1024 ** 2}
      accept={IMAGE_MIME_TYPE}
      style={{
        border: `2px dashed ${theme.colors.blue[6]}`,
        borderRadius: theme.radius.md,
        backgroundColor: theme.colors.blue[0],
        transition: 'all 0.2s ease',
      }}
    >
      <Group justify="center" gap="xl" mih={180} style={{ pointerEvents: 'none' }}>
        <Dropzone.Accept>
          <IconCheck
            style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-green-6)' }}
            stroke={1.5}
          />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <IconX
            style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }}
            stroke={1.5}
          />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <IconUpload style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }} stroke={1.5} />
        </Dropzone.Idle>

        <div>
          <Text size="xl" inline fw={600}>
            Drop your files here
          </Text>
          <Text size="sm" c="dimmed" inline mt={7}>
            Drag and drop images here, or click to browse
          </Text>
        </div>
      </Group>
    </Dropzone>
  );
}

// All dropzones component
export function AllDropzones() {
  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="xl">Mantine Dropzone Examples</Title>
      
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
        <Paper shadow="xs" p="md" withBorder>
          <Title order={3} mb="md">Basic Dropzone</Title>
          <BasicDropzone />
        </Paper>

        <Paper shadow="xs" p="md" withBorder>
          <Title order={3} mb="md">Dropzone with Preview</Title>
          <DropzoneWithPreview />
        </Paper>

        <Paper shadow="xs" p="md" withBorder>
          <Title order={3} mb="md">Dropzone with File List</Title>
          <DropzoneWithFileList />
        </Paper>

        <Paper shadow="xs" p="md" withBorder>
          <Title order={3} mb="md">Multiple File Types</Title>
          <DropzoneMultipleTypes />
        </Paper>

        <Paper shadow="xs" p="md" withBorder style={{ gridColumn: 'span 2' }}>
          <Title order={3} mb="md">Custom Styled Dropzone</Title>
          <CustomStyledDropzone />
        </Paper>
      </SimpleGrid>
    </Container>
  );
} 
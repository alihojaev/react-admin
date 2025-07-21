import React from 'react';
import { TextInput, TextInputProps, PasswordInput as MantinePasswordInput, PasswordInputProps } from '@mantine/core';

interface CustomInputProps extends Omit<TextInputProps, 'type'> {
  label: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  type?: 'text' | 'email' | 'password' | 'tel';
  size?: 'sm' | 'md' | 'lg';
}

interface CustomPasswordInputProps extends PasswordInputProps {
  label: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Input: React.FC<CustomInputProps> = ({
  label,
  placeholder,
  error,
  required = false,
  type = 'text',
  size = 'md',
  className,
  ...props
}) => {
  const getSizeProps = () => {
    switch (size) {
      case 'sm':
        return { size: 'xs' as const, className: `text-sm ${className || ''}` };
      case 'md':
        return { size: 'sm' as const, className: `text-base ${className || ''}` };
      case 'lg':
        return { size: 'md' as const, className: `text-lg ${className || ''}` };
      default:
        return { size: 'sm' as const, className: `text-base ${className || ''}` };
    }
  };

  const sizeProps = getSizeProps();

  return (
    <TextInput
      {...props}
      {...sizeProps}
      label={label}
      placeholder={placeholder}
      error={error}
      required={required}
      type={type}
      radius="md"
      className={`transition-all duration-200 ${sizeProps.className}`}
    />
  );
};

export const PasswordInput: React.FC<CustomPasswordInputProps> = ({
  label,
  placeholder,
  error,
  required = false,
  size = 'md',
  className,
  ...props
}) => {
  const getSizeProps = () => {
    switch (size) {
      case 'sm':
        return { size: 'xs' as const, className: `text-sm ${className || ''}` };
      case 'md':
        return { size: 'sm' as const, className: `text-base ${className || ''}` };
      case 'lg':
        return { size: 'md' as const, className: `text-lg ${className || ''}` };
      default:
        return { size: 'sm' as const, className: `text-base ${className || ''}` };
    }
  };

  const sizeProps = getSizeProps();

  return (
    <MantinePasswordInput
      {...props}
      {...sizeProps}
      label={label}
      placeholder={placeholder}
      error={error}
      required={required}
      radius="md"
      className={`transition-all duration-200 ${sizeProps.className}`}
    />
  );
}; 
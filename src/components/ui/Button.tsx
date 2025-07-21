import React from 'react';
import { Button as MantineButton, ButtonProps } from '@mantine/core';

interface CustomButtonProps extends ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<CustomButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className,
  ...props
}) => {
  const getVariantProps = () => {
    switch (variant) {
      case 'primary':
        return {
          variant: 'filled',
          color: 'blue',
          className: `bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium ${className || ''}`,
        };
      case 'secondary':
        return {
          variant: 'filled',
          color: 'gray',
          className: `bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-medium ${className || ''}`,
        };
      case 'outline':
        return {
          variant: 'outline',
          color: 'blue',
          className: `border-blue-500 text-blue-500 hover:bg-blue-50 font-medium ${className || ''}`,
        };
      case 'ghost':
        return {
          variant: 'subtle',
          color: 'gray',
          className: `text-gray-600 hover:bg-gray-100 font-medium ${className || ''}`,
        };
      default:
        return {
          variant: 'filled',
          color: 'blue',
          className: `bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium ${className || ''}`,
        };
    }
  };

  const getSizeProps = () => {
    switch (size) {
      case 'sm':
        return { size: 'xs' as const, className: `px-3 py-1.5 text-sm ${getVariantProps().className}` };
      case 'md':
        return { size: 'sm' as const, className: `px-4 py-2 text-base ${getVariantProps().className}` };
      case 'lg':
        return { size: 'md' as const, className: `px-6 py-3 text-lg ${getVariantProps().className}` };
      default:
        return { size: 'sm' as const, className: `px-4 py-2 text-base ${getVariantProps().className}` };
    }
  };

  const sizeProps = getSizeProps();

  return (
    <MantineButton
      {...props}
      {...getVariantProps()}
      {...sizeProps}
      loading={loading}
      disabled={disabled || loading}
      radius="md"
      className={`transition-all duration-200 transform hover:scale-105 active:scale-95 ${sizeProps.className}`}
    >
      {children}
    </MantineButton>
  );
}; 
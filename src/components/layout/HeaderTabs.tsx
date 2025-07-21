"use client";
import { useState } from 'react';
import {
  IconHeart,
  IconLogout,
  IconMessage,
  IconPlayerPause,
  IconSettings,
  IconStar,
  IconSwitchHorizontal,
  IconTrash,
} from '@tabler/icons-react';
import cx from 'clsx';
import {
  Avatar,
  Group,
  Menu,
  Text,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import classes from './HeaderTabs.module.css';
import { useAuthStore } from '../../store/authStore';

export function HeaderTabs() {
  const theme = useMantineTheme();
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const { user, logout } = useAuthStore();

  // Используем данные реального пользователя или значения по умолчанию
  const userData = {
    name: user?.username || 'User',
    email: user?.email || '',
    image: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png',
  };

  return (
    <div className={classes.header}>
      <div className={classes.mainSection} style={{ paddingRight: '24px' }}>
        <Group justify="flex-end" style={{ width: '100%' }}>
          <Menu
            width={260}
            position="bottom-end"
            transitionProps={{ transition: 'pop-top-right' }}
            onClose={() => setUserMenuOpened(false)}
            onOpen={() => setUserMenuOpened(true)}
            withinPortal
          >
            <Menu.Target>
              <UnstyledButton
                className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
              >
                <Group gap={7}>
                  <Avatar src={userData.image} alt={userData.name} radius="xl" size={20} />
                  <Text fw={500} size="sm" lh={1}>
                    {userData.name}
                  </Text>
                </Group>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconHeart size={16} color={theme.colors.red[6]} stroke={1.5} />}
              >
                Liked posts
              </Menu.Item>
              <Menu.Item
                leftSection={<IconStar size={16} color={theme.colors.yellow[6]} stroke={1.5} />}
              >
                Saved posts
              </Menu.Item>
              <Menu.Item
                leftSection={<IconMessage size={16} color={theme.colors.blue[6]} stroke={1.5} />}
              >
                Your comments
              </Menu.Item>

              <Menu.Label>Settings</Menu.Label>
              <Menu.Item leftSection={<IconSettings size={16} stroke={1.5} />}>
                Account settings
              </Menu.Item>
              <Menu.Item leftSection={<IconSwitchHorizontal size={16} stroke={1.5} />}>
                Change account
              </Menu.Item>
              <Menu.Item 
                leftSection={<IconLogout size={16} stroke={1.5} />}
                onClick={() => logout()}
              >
                Logout
              </Menu.Item>

              <Menu.Divider />

              <Menu.Label>Danger zone</Menu.Label>
              <Menu.Item leftSection={<IconPlayerPause size={16} stroke={1.5} />}>
                Pause subscription
              </Menu.Item>
              <Menu.Item color="red" leftSection={<IconTrash size={16} stroke={1.5} />}>
                Delete account
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </div>
    </div>
  );
} 
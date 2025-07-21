import { AppShellHeader, Group } from "@mantine/core";
import Image from "next/image";

export function Header() {
  return (
    <AppShellHeader>
      <Group className="h-full px-md">
        <Image
          className="dark:invert"
          src="https://nextjs.org/icons/next.svg"
          alt="logo"
          width={100}
          height={100}
        />
      </Group>
    </AppShellHeader>
  );
} 
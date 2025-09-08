import type { Metadata } from "next";
import {
  MantineProvider,
} from "@mantine/core";
import theme from "./theme";
import "./globals.css";
import "./theme.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Next App Mantine Tailwind Template",
  description: "Next App Mantine Tailwind Template",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <MantineProvider theme={theme}>
          <Providers>
            {children}
          </Providers>
        </MantineProvider>
      </body>
    </html>
  );
}

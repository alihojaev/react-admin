import { NavbarNested } from "@/components/layout/NavbarNested";
import { HeaderTabs } from "@/components/layout/HeaderTabs";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <NavbarNested />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <HeaderTabs />
        <main style={{ flex: 1 }}>{children}</main>
      </div>
    </div>
  );
} 
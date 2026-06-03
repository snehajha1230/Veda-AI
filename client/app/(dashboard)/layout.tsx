import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StoreProvider } from "@/components/providers/StoreProvider";

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </StoreProvider>
  );
}

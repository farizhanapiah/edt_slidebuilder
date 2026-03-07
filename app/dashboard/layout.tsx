import { DashboardSidebar } from "@/components/layout/DashboardSidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#0A0A0A" }}>
      <DashboardSidebar />
      <main style={{ flex: 1, overflow: "auto" }}>{children}</main>
    </div>
  );
}

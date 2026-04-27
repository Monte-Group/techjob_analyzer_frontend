import type { Metadata } from "next";
import { AiChatFab } from "@/widgets/dashboard/ai-chat-fab";
import { DashboardHeader } from "@/widgets/dashboard/dashboard-header";
import { DashboardSidebar } from "@/widgets/dashboard/dashboard-sidebar";

export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen text-[color:var(--text)] grain">
      <DashboardSidebar />
      <div className="lg:pl-64">
        <DashboardHeader />
        {children}
      </div>
      <AiChatFab />
    </div>
  );
}

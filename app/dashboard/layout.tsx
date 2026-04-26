import { Suspense } from "react";

import { AiChatFab } from "@/widgets/dashboard/ai-chat-fab";
import { DashboardSidebar } from "@/widgets/dashboard/dashboard-sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen text-[color:var(--text)] grain">
      <Suspense fallback={null}>
        <DashboardSidebar />
      </Suspense>
      <div className="lg:pl-64">{children}</div>
      <AiChatFab />
    </div>
  );
}

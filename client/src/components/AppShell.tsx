import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";

export function AppShell() {
  return (
    <div className="flex min-h-screen bg-void">
      <Sidebar />
      <main className="flex-1 ml-0 md:ml-[220px] p-8">
        <Outlet />
      </main>
    </div>
  );
}

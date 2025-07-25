import type { ReactNode } from "react";
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarInset, SidebarTrigger, SidebarFooter } from "@/components/ui/sidebar";
import { SidebarNav } from "./sidebar-nav";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { logout } from "@/app/login/actions";

interface Session {
    username: string;
}

interface SidebarLayoutProps {
  children: ReactNode;
  session: Session | null;
}

export function SidebarLayout({ children, session }: SidebarLayoutProps) {
  if (!session) {
      return (
        <div className="flex flex-col h-screen">
          <main className="flex-1">{children}</main>
        </div>
      );
  }
  
  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon" className="border-r">
        <SidebarHeader className="p-4">
          <Link href="/projects" className="flex items-center gap-2 text-xl font-semibold text-sidebar-foreground hover:text-sidebar-accent-foreground transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              <path d="M12 22V12"></path>
              <path d="m20 12-4.26-2.13a4.52 4.52 0 0 0-4.48 0L7 12"></path>
              <path d="M20 17v-2.5"></path>
              <path d="M12 22V17"></path>
              <path d="M4 17v-2.5"></path>
              <path d="M20 7.53V5l-4.48 2.24a4.52 4.52 0 0 0-4.26 0L7 5v2.53"></path>
            </svg>
            <span className="group-data-[collapsible=icon]:hidden">Costos 3D Pro</span>
          </Link>
        </SidebarHeader>
        <SidebarContent className="flex-1 p-2">
          <SidebarNav session={session} />
        </SidebarContent>
        <SidebarFooter className="p-2">
            <form action={logout}>
                <Button variant="ghost" className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                    <LogOut className="h-5 w-5" />
                    <span className="group-data-[collapsible=icon]:hidden">Cerrar Sesión</span>
                </Button>
            </form>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 sm:py-4">
          <SidebarTrigger className="md:hidden" />
          {/* Add breadcrumbs or page title here if needed */}
        </header>
        <main className="flex-1 overflow-auto p-4 sm:px-6 sm:py-0">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

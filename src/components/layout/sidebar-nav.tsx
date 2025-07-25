
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Layers, 
  Wrench, 
  Printer,
  Calculator,
  BookOpen,
  Settings,
  Zap,
  PercentCircle,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const mainNavItems = [
  { href: "/projects", label: "Catálogo", icon: BookOpen },
  { href: "/projects/calculate", label: "Nueva Calculación", icon: Calculator, auth: true },
];

const settingsNavItems = [
  { href: "/materials", label: "Materiales", icon: Layers },
  { href: "/accessories", label: "Accesorios", icon: Wrench },
  { href: "/printer-profiles", label: "Perfiles Impresora", icon: Printer },
  { href: "/electricity-profiles", label: "Electricidad", icon: Zap },
  { href: "/sales-profiles", label: "Perfiles de Venta", icon: PercentCircle },
];

interface Session {
    username: string;
}

interface SidebarNavProps {
  session: Session | null;
}

export function SidebarNav({ session }: SidebarNavProps) {
  const pathname = usePathname();
  const isSettingsActive = settingsNavItems.some(item => pathname.startsWith(item.href));

  return (
    <SidebarMenu>
      {mainNavItems.map((item) => {
        if (item.auth && !session) return null;
        return (
          <SidebarMenuItem key={item.href}>
            <Link href={item.href}>
              <SidebarMenuButton
                isActive={pathname === item.href}
                tooltip={item.label}
                aria-label={item.label}
                className="justify-start"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        )
      })}
      
      {session && (
        <SidebarMenuItem>
          <Accordion type="single" collapsible defaultValue={isSettingsActive ? "settings" : undefined} className="w-full">
              <AccordionItem value="settings" className="border-none">
                  <AccordionTrigger 
                      className={cn(
                          "flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-colors hover:bg-sidebar-accent hover:no-underline hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground",
                          "group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2",
                          isSettingsActive && "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                      )}
                  >
                      <div className="flex items-center gap-2">
                          <Settings className="h-5 w-5" />
                          <span>Configuración</span>
                      </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-0 pl-5">
                      <SidebarMenu className="pt-2">
                      {settingsNavItems.map((item) => (
                          <SidebarMenuItem key={item.href}>
                          <Link href={item.href}>
                              <SidebarMenuButton
                              isActive={pathname.startsWith(item.href)}
                              tooltip={item.label}
                              aria-label={item.label}
                              className="justify-start h-8"
                              >
                              <item.icon className="h-4 w-4" />
                              <span>{item.label}</span>
                              </SidebarMenuButton>
                          </Link>
                          </SidebarMenuItem>
                      ))}
                      </SidebarMenu>
                  </AccordionContent>
              </AccordionItem>
          </Accordion>
        </SidebarMenuItem>
      )}
    </SidebarMenu>
  );
}

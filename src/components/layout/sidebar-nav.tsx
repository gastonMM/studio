
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Layers, // For Materials
  Wrench, // For Accessories
  Printer, // For Printer Profiles
  Calculator, // For New Calculation
  BookOpen, // For Catalog
  Settings, // For Settings/Configuration (general, if needed later)
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/materials", label: "Materiales", icon: Layers },
  { href: "/accessories", label: "Accesorios", icon: Wrench },
  { href: "/printer-profiles", label: "Perfiles Impresora", icon: Printer },
  { href: "/projects/calculate", label: "Nueva Calculación", icon: Calculator },
  { href: "/projects", label: "Catálogo", icon: BookOpen },
  // { href: "/settings", label: "Configuración", icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href} passHref legacyBehavior>
            <SidebarMenuButton
              isActive={pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))}
              tooltip={item.label}
              aria-label={item.label}
              className="justify-start"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

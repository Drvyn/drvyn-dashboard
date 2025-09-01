"use client"

import * as React from "react"
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { LayoutDashboard, CalendarDays, ShieldCheck, MessageSquare, Car, LogOut, Users } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const router = useRouter();

  React.useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.replace('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('authToken');
    router.replace('/login');
  };

  const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/customers", label: "Customers", icon: Users },
    { href: "/dashboard/bookings", label: "Bookings", icon: CalendarDays },
    { href: "/dashboard/insurance-requests", label: "Insurance", icon: ShieldCheck },
    { href: "/dashboard/requests", label: "Requests", icon: MessageSquare },
  ]

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarHeader>
            <div className="flex items-center gap-2 p-2">
              <Button variant="ghost" size="icon" className="shrink-0 bg-primary/10 text-primary hover:bg-primary/20">
                <Car className="h-5 w-5"/>
              </Button>
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold tracking-tight text-primary">Drvyn</h2>
              </div>
            </div>
          </SidebarHeader>
          <SidebarMenu>
            {menuItems.map((item) => (
               <SidebarMenuItem key={item.href}>
                 <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
                   <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                   </Link>
                 </SidebarMenuButton>
               </SidebarMenuItem>
            ))}
            <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
                    <LogOut />
                    <span>Logout</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 md:hidden">
          <SidebarTrigger />
          <h1 className="text-lg font-semibold text-primary">Drvyn</h1>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-secondary/40">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

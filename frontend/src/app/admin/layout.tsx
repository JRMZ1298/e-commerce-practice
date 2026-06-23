"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { redirect } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  Users,
  LogOut,
  Store,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Productos", icon: ShoppingBag },
  { href: "/admin/orders", label: "Pedidos", icon: ClipboardList },
  { href: "/admin/users", label: "Usuarios", icon: Users },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isLoading && !isAuthenticated) {
    redirect("/auth?mode=login");
  }

  if (
    !isLoading &&
    isAuthenticated &&
    user?.role !== "ADMIN" &&
    user?.role !== "SUPER_ADMIN"
  ) {
    redirect("/");
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-accent border-t-transparent" />
      </div>
    );
  }

  if (
    !isAuthenticated ||
    (user?.role !== "ADMIN" && user?.role !== "SUPER_ADMIN")
  )
    return null;

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <div className="flex min-h-screen bg-[#f5f5f0]">
      {/* Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex fixed inset-y-0 left-0 z-40 flex-col border-r border-border bg-cards transition-all duration-300 lg:static",
          sidebarOpen
            ? "w-72 translate-x-0"
            : "w-0 -translate-x-full lg:w-24 lg:translate-x-0",
        )}
      >
        {/* Toggle header */}
        <div className="flex h-16 items-center justify-center border-b border-border">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg transition-colors",
                sidebarOpen
                  ? "px-3 py-2.5 text-[1.4rem] font-medium"
                  : "justify-center p-3",
                isActive(item.href)
                  ? "bg-brand-accent/10 text-brand-accent"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
              title={!sidebarOpen ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && item.label}
            </Link>
          ))}

          {/* Tienda link */}
          <Link
            href="/"
            className={cn(
              "flex items-center gap-3 rounded-lg transition-colors",
              sidebarOpen
                ? "px-3 py-2.5 text-[1.4rem] font-medium"
                : "justify-center p-3",
              "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
            title={!sidebarOpen ? "Tienda" : undefined}
          >
            <Store className="h-5 w-5 flex-shrink-0" />
            {sidebarOpen && "Tienda"}
          </Link>
        </nav>

        <div
          className={cn("border-t border-border", sidebarOpen ? "p-4" : "p-3")}
        >
          {sidebarOpen && (
            <div className="mb-3 truncate text-[1.2rem] text-muted-foreground">
              {user?.firstName} {user?.lastName}
            </div>
          )}
          <button
            type="button"
            onClick={() => {
              logout();
              router.push("/");
            }}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg transition-colors hover:bg-destructive/5",
              sidebarOpen
                ? "px-3 py-2.5 text-[1.4rem] font-medium text-destructive"
                : "flex justify-center p-3 text-destructive",
            )}
            title={!sidebarOpen ? "Cerrar sesión" : undefined}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {sidebarOpen && "Cerrar sesión"}
          </button>
        </div>
      </aside>

      {/* Mobile bottom bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-border bg-cards px-1 py-1 lg:hidden">
        {[...navItems, { href: "/", label: "Tienda", icon: Store }].map(
          (item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-lg px-1.5 py-1 transition-colors min-w-0",
                isActive(item.href)
                  ? "text-brand-accent"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[0.85rem] font-medium truncate max-w-full">
                {item.label}
              </span>
            </Link>
          ),
        )}
      </nav>

      {/* Main content */}
      <main
        className={cn(
          "flex-1 overflow-auto pb-16 lg:pb-0 bg-background",
          sidebarOpen ? "" : "lg:ml-0",
        )}
      >
        {children}
      </main>
    </div>
  );
}

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Dumbbell, Home, Calendar, BarChart3, Settings, LogOut } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

export function DashboardSidebar() {
  const pathname = usePathname()
  const isMobile = useMobile()

  if (isMobile) {
    return null
  }

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/workouts", label: "Workouts", icon: Dumbbell },
    { href: "/dashboard/calendar", label: "Calendar", icon: Calendar },
    { href: "/dashboard/progress", label: "Progress", icon: BarChart3 },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ]

  return (
    <aside className="hidden w-64 border-r border-border bg-card md:block">
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-auto py-4">
          <nav className="grid gap-1 px-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="border-t border-border p-4">
          <Link
            href="/login"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            <span>Log out</span>
          </Link>
        </div>
      </div>
    </aside>
  )
}


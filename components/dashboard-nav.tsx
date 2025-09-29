"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Mail, History, BarChart3, Users, LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function DashboardNav() {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  const navItems = [
    {
      title: "Compose",
      href: "/dashboard",
      icon: Mail,
    },
    {
      title: "Contacts",
      href: "/dashboard/contacts",
      icon: Users,
    },
    {
      title: "History",
      href: "/dashboard/history",
      icon: History,
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart3,
    },
  ]

  return (
    <nav className="flex items-center justify-between border-b bg-white px-6 py-4">
      <div className="flex items-center gap-8">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600">
            <Mail className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold">Dosa Heaven Newsletter</span>
        </Link>
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn("gap-2", pathname === item.href && "bg-orange-50 text-orange-600")}
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                </Button>
              </Link>
            )
          })}
        </div>
      </div>
      <Button variant="ghost" onClick={handleSignOut} className="gap-2">
        <LogOut className="h-4 w-4" />
        Sign out
      </Button>
    </nav>
  )
}

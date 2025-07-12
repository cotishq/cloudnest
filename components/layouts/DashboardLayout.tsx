
"use client"

import { usePathname, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useState } from "react"
import { Menu, LogOut } from "lucide-react"
import { cn } from "@/lib/file-utils"
import { Button } from "@/components/ui/button"
import { SignOutButton } from "@clerk/nextjs"

const navItems = [
  { label: "All Files", value: "all", icon: <i className="ri-folder-line" /> },
  { label: "Starred", value: "starred", icon: <i className="ri-star-line" /> },
  { label: "Trash", value: "trash", icon: <i className="ri-delete-bin-line" /> },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const activeTab = searchParams.get("view") || "all"
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      
      {sidebarOpen && (
        <aside className="w-[220px] border-r px-4 py-6 bg-background relative hidden md:block">
          <div className="text-lg font-bold mb-6">CloudNest</div>

          <div className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.value}
                href={`?view=${item.value}`}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium w-full transition hover:bg-muted ",
                  activeTab === item.value
                    ? "bg-muted "
                    : "text-muted-foreground"
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>

          
          <div className="absolute bottom-6 left-4 right-4">
            <SignOutButton>
              <Button variant="ghost" className="w-full justify-start">
                <LogOut className="h-4 w-4 mr-2" />
                Log Out
              </Button>
            </SignOutButton>
          </div>
        </aside>
      )}

      
      <main className="flex-1 p-6">
        
        <div className="mb-4">
          <Button variant="ghost" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {children}
      </main>
    </div>
  )
}

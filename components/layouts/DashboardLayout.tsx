"use client"

import { usePathname, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, LogOut, X, ChevronLeft, ChevronRight } from "lucide-react"
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
  const searchParams = useSearchParams()
  const activeTab = searchParams.get("view") || "all"
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) {
        setSidebarOpen(false)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && sidebarOpen) {
        const sidebar = document.getElementById('sidebar')
        if (sidebar && !sidebar.contains(event.target as Node)) {
          setSidebarOpen(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMobile, sidebarOpen])

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen)
    } else {
      setIsCollapsed(!isCollapsed)
    }
  }

  const sidebarWidth = isCollapsed ? 'w-[70px]' : 'w-[220px]'

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      
      {(sidebarOpen || !isMobile) && (
        <aside 
          id="sidebar"
          className={cn(
            "border-r bg-background relative transition-all duration-300 ease-in-out",
            sidebarWidth,
            
            isMobile ? "fixed left-0 top-0 h-full z-50 shadow-lg" : "hidden md:block",
            
            "transform",
            isMobile && !sidebarOpen ? "-translate-x-full" : "translate-x-0"
          )}
        >
          <div className="px-4 py-6 h-full flex flex-col">
            
            <div className="flex items-center justify-between mb-6">
              <div className={cn(
                "text-lg font-bold transition-all duration-300",
                isCollapsed ? "opacity-0 w-0" : "opacity-100"
              )}>
                CloudNest
              </div>
              
              
              {isMobile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            
            <nav className="space-y-1 flex-1">
              {navItems.map((item) => (
                <Link
                  key={item.value}
                  href={`?view=${item.value}`}
                  onClick={() => isMobile && setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                    "hover:bg-muted hover:scale-[1.02] active:scale-[0.98]",
                    activeTab === item.value
                      ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className={cn(
                    "flex items-center justify-center w-5 h-5 transition-transform duration-200",
                    activeTab === item.value ? "scale-110" : "group-hover:scale-105"
                  )}>
                    {item.icon}
                  </div>
                  
                  <span className={cn(
                    "transition-all duration-300",
                    isCollapsed ? "opacity-0 w-0" : "opacity-100"
                  )}>
                    {item.label}
                  </span>
                  
                  
                  {activeTab === item.value && (
                    <div className="absolute right-2 w-2 h-2 bg-primary rounded-full animate-pulse" />
                  )}
                  
                  
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-popover border rounded-md shadow-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </Link>
              ))}
            </nav>

            
            <div className="border-t pt-4">
              <SignOutButton>
                <Button 
                  variant="ghost" 
                  className={cn(
                    "w-full transition-all duration-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20",
                    isCollapsed ? "px-2" : "justify-start"
                  )}
                >
                  <LogOut className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className={cn(
                    "transition-all duration-300",
                    isCollapsed ? "opacity-0 w-0" : "opacity-100"
                  )}>
                    Log Out
                  </span>
                </Button>
              </SignOutButton>
            </div>
          </div>

          
          {!isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="absolute -right-3 top-6 h-6 w-6 p-0 rounded-full border bg-background shadow-sm hover:shadow-md transition-all duration-200"
            >
              {isCollapsed ? (
                <ChevronRight className="h-3 w-3" />
              ) : (
                <ChevronLeft className="h-3 w-3" />
              )}
            </Button>
          )}
        </aside>
      )}

      
      <main className="flex-1 p-6">
        
        <div className="mb-4">
          <Button 
            variant="ghost" 
            onClick={toggleSidebar}
            className="hover:bg-muted transition-colors duration-200"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {children}
      </main>
    </div>
  )
}
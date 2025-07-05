


"use client";

import { Home, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "All Files", icon: <Home className="h-4 w-4" />, value: "all" },
  { label: "Starred", icon: <Star className="h-4 w-4" />, value: "starred" },
  { label: "Trash", icon: <Trash2 className="h-4 w-4" />, value: "trash" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTab = searchParams.get("view") || "all";

  return (
    <div className="flex min-h-screen">
      
      <aside className="w-[220px] border-r px-4 py-6 bg-muted/50">
        <div className="text-lg font-semibold mb-4">CloudNest</div>
        <div className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.value}
              href={`${pathname}?view=${item.value}`}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md w-full hover:bg-muted text-sm font-medium transition",
                activeTab === item.value
                  ? "bg-muted font-semibold"
                  : "text-muted-foreground"
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>
      </aside>

      
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

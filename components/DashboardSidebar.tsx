'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Package, Calculator, ArrowRightLeft, LayoutDashboard, LogOut, Layout as LayoutIcon, Dock } from "lucide-react" // Pastikan install lucide-react
import { cn } from "@/lib/utils" // Utility bawaan installan shadcn

const menuItems = [
  {
    title: "Inventory Gudang",
    href: "/dashboard/inventory",
    icon: Package
  },
  {
    title: "Analisa EOQ",
    href: "/dashboard/eoq",
    icon: Calculator
  },
  {
    title: "Transaksi Stok",
    href: "/dashboard/transactions",
    icon: ArrowRightLeft
  },
  {
    title: "Tambah Data Produk",
    href: "/dashboard/inventory/add",
    icon: LayoutIcon
  },
  {
    title: "Permintaan Pembelian (SPP)",
    href: "/dashboard/requests",
    icon: Dock
  }
  
  
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden border-r bg-white h-screen w-64 lg:flex flex-col fixed left-0 top-0 bottom-0 z-50">
      {/* HEADER LOGO */}
      <div className="flex h-16 items-center border-b px-6">
        <Link className="flex items-center gap-2 font-bold text-xl text-blue-600" href="/dashboard/inventory">
          <LayoutDashboard className="h-6 w-6" />
          <span>Oojhi Admin</span>
        </Link>
      </div>

      {/* MENU ITEMS */}
      <div className="flex-1 overflow-auto py-6">
        <nav className="grid items-start px-4 text-sm font-medium gap-2">
          {menuItems.map((item, index) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all",
                  isActive 
                    ? "bg-blue-50 text-blue-600 font-bold shadow-sm" // Style Aktif
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900" // Style Tidak Aktif
                )}
              >
                <item.icon className={cn("h-4 w-4", isActive ? "text-blue-600" : "text-slate-400")} />
                {item.title}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* FOOTER USER */}
      <div className="border-t p-4 bg-slate-50">
        <div className="flex items-center gap-3 px-2">
          <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
            AD
          </div>
          <div className="text-xs">
            <p className="font-semibold text-slate-700">Admin Gudang</p>
            <p className="text-slate-400">Staff Logistik</p>
          </div>
        </div>
      </div>
    </div>
  )
}
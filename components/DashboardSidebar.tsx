'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Package, 
  Calculator, 
  ArrowRightLeft, 
  LayoutDashboard, 
  LogOut, 
  Layout as LayoutIcon, 
  Dock,
  Users,
  FileSignature
} from "lucide-react" 
import { cn } from "@/lib/utils" 
import { logoutAction } from "@/app/actions/authActions" 

// [PENTING] Kembalikan props userRole agar sidebar bisa filter menu
export default function DashboardSidebar({ userRole }: { userRole: string }) {
  const pathname = usePathname()

  // DEFINISI MENU & HAK AKSES (Digabung dengan Icon Baru)
  const menuItems = [
    {
      title: "Dashboard",
      href: "/dashboard/inventory",
      icon: Package,
      allowedRoles: ["GUDANG", "PURCHASING", "MANAJER"]
    },
    {
      title: "Analisa EOQ",
      href: "/dashboard/eoq",
      icon: Calculator,
      allowedRoles: ["MANAJER"]
    },
    {
      title: "Transaksi Stok",
      href: "/dashboard/transactions",
      icon: ArrowRightLeft,
      allowedRoles: ["GUDANG"]
    },
    {
      title: "Tambah Data Produk",
      href: "/dashboard/inventory/add",
      icon: LayoutIcon,
      allowedRoles: ["PURCHASING"]
    },
    {
      title: "Permintaan Pembelian",
      href: "/dashboard/requests",
      icon: Dock,
      allowedRoles: ["PURCHASING", "GUDANG"]
    },
    {
      title: "Data Supplier",
      href: "/dashboard/suppliers",
      icon: Users,
      allowedRoles: ["PURCHASING"]
    },
    {
    title: "Approval PO",
    href: "/dashboard/approval",
    icon: FileSignature,
    allowedRoles: ["MANAJER"] // Hanya Manajer
  },
  {
      title: "Order Pembelian",
      href: "/dashboard/order",
      icon: Package,
      allowedRoles: ["PURCHASING"]
  }
  ]

  return (
    <div className="hidden border-r bg-white h-screen w-64 lg:flex flex-col fixed left-0 top-0 bottom-0 z-50 shadow-sm">
      {/* HEADER LOGO */}
      <div className="flex h-16 items-center border-b px-6 bg-blue-50/50">
        <Link className="flex items-center gap-2 font-bold text-xl text-blue-700" href="/dashboard/inventory">
          <LayoutDashboard className="h-6 w-6" />
          <span>Oojhi Admin</span>
        </Link>
      </div>

      {/* MENU ITEMS (DYNAMIC) */}
      <div className="flex-1 overflow-auto py-6">
        <nav className="grid items-start px-4 text-sm font-medium gap-1">
          
          {menuItems.map((item, index) => {
            // [LOGIC] Sembunyikan menu jika role user tidak ada di allowedRoles
            // Jika userRole tidak terdefinisi (misal error session), anggap array kosong
            if (!item.allowedRoles.includes(userRole || "")) return null

            const isActive = pathname === item.href
            
            return (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200",
                  isActive 
                    ? "bg-blue-600 text-white shadow-md hover:bg-blue-700" // Style Aktif
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900" // Style Tidak Aktif
                )}
              >
                <item.icon className={cn("h-4 w-4", isActive ? "text-white" : "text-slate-400")} />
                {item.title}
              </Link>
            )
          })}

        </nav>
      </div>

      {/* FOOTER USER & LOGOUT */}
      <div className="border-t p-4 bg-slate-50">
        <div className="flex items-center gap-3 px-2 mb-4">
          <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md uppercase">
            {(userRole || "US").substring(0, 2)}
          </div>
          <div className="text-xs">
            <p className="font-semibold text-slate-700">Halo, User</p>
            <p className="text-slate-500 font-mono bg-slate-200 px-1 rounded w-fit mt-0.5">
              {userRole || "GUEST"}
            </p>
          </div>
        </div>

        <form action={logoutAction}>
          <button className="flex w-full items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors border border-red-100">
            <LogOut className="w-4 h-4" />
            Keluar Aplikasi
          </button>
        </form>
      </div>
    </div>
  )
}
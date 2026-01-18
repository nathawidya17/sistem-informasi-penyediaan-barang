// app/dashboard/layout.tsx
import { DashboardSidebar } from "@/components/DashboardSidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-red-100"> {/* Background Merah buat ngetes */}
      
      {/* Coba tulis teks manual dulu tanpa komponen */}
      <div className="w-64 bg-black text-white p-5">
        INI AREA SIDEBAR
        <br />
        <DashboardSidebar /> 
      </div>

      <div className="flex-1 p-10 bg-white">
        {children}
      </div>
    </div>
  )
}
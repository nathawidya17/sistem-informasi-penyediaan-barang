import DashboardSidebar from "@/components/DashboardSidebar" // [FIX 1] Hapus kurung kurawal {}
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 1. Ambil session dari cookies (Wajib pakai await di Next.js terbaru)
  const cookieStore = await cookies()
  const session = cookieStore.get("user_session")?.value

  // 2. Jika tidak ada session, lempar ke login
  if (!session) {
    redirect("/login")
  }

  // 3. Parse data user untuk ambil role
  let user
  try {
    user = JSON.parse(session)
  } catch (e) {
    // Jaga-jaga jika JSON rusak
    redirect("/login")
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* [FIX 2] Kirim props userRole ke sidebar */}
      <DashboardSidebar userRole={user.role} />
      
      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-full min-h-screen">
        {children}
      </main>
    </div>
  )
}
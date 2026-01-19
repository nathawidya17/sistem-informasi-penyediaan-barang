import { PrismaClient } from "@prisma/client"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import ApprovalTableRow from "@/components/ApprovalTableRow"

const prisma = new PrismaClient()

export default async function ApprovalPage() {
  // 1. Cek Login & Role (Wajib Manajer)
  const cookieStore = await cookies()
  const session = cookieStore.get("user_session")?.value
  const user = session ? JSON.parse(session) : null

  if (!user || user.role !== 'MANAJER') {
    redirect('/dashboard/inventory')
  }

  // 2. Ambil Data PO
  const purchaseOrders = await prisma.purchaseOrder.findMany({
    orderBy: { date: 'desc' }, // [PERBAIKAN] Ganti createdAt jadi date
    include: {
      supplier: true,
      items: {
        include: { material: true }
      }
    }
  })

  const pendingPOs = purchaseOrders.filter(po => po.status === 'PENDING')
  const historyPOs = purchaseOrders.filter(po => po.status !== 'PENDING')

  return (
    <div className="space-y-6 p-8 max-w-7xl mx-auto">
      
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Approval PO</h2>
          <p className="text-muted-foreground">
            Halaman khusus Manajer untuk menyetujui atau menolak Purchase Order.
          </p>
        </div>
      </div>

      {/* TABEL 1: PENDING */}
      <Card className="border-l-4 border-l-yellow-500 shadow-md">
        <CardHeader>
          <CardTitle className="text-yellow-700">Menunggu Persetujuan</CardTitle>
          <CardDescription>Daftar PO baru yang perlu ditinjau.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kode PO</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Total Belanja</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingPOs.map((po) => (
                <ApprovalTableRow key={po.id} po={po} />
              ))}
              {pendingPOs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24 text-slate-500 italic">
                    Tidak ada PO yang perlu disetujui saat ini.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* TABEL 2: HISTORY */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Approval</CardTitle>
          <CardDescription>Daftar PO yang sudah diproses sebelumnya.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Kode PO</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Total Belanja</TableHead>
                <TableHead>Status Akhir</TableHead>
                <TableHead className="text-center">Detail</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historyPOs.map((po) => (
                <ApprovalTableRow key={po.id} po={po} />
              ))}
              {historyPOs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24 text-slate-400">
                    Belum ada riwayat.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  )
}
import { PrismaClient } from "@prisma/client"
import { cookies } from "next/headers"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import CreateSppModal from "@/components/CreateSppModal"
import SppTableRow from "@/components/SppTableRow" 

const prisma = new PrismaClient()

export default async function RequestsPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get("user_session")?.value
  const user = session ? JSON.parse(session) : { role: "GUEST" }
  const userRole = user.role

  // 1. Ambil Data SPP + Detail Item + Data PO (PENTING: Include purchaseOrders)
  const requests = await prisma.purchaseRequest.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: { material: true }
      },
      // KITA BUTUH DATA PO UNTUK CEK STATUS MANAJER
      purchaseOrders: {
        include: {
          supplier: true,
          items: {
            include: { material: true }
          }
        }
      }
    }
  })

  // 2. Ambil list material untuk modal create (Gudang)
  const materials = await prisma.material.findMany({
    select: { id: true, name: true, satuan: true },
    orderBy: { name: 'asc' }
  })

  return (
    <div className="space-y-6 p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Permintaan Pembelian (SPP)</h2>
          <p className="text-muted-foreground">
            {userRole === 'GUDANG' ? "Buat permintaan stok baru." : "Daftar permintaan masuk."}
          </p>
        </div>
        {userRole === 'GUDANG' && <CreateSppModal materials={materials} />}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>History Permintaan</CardTitle>
          <CardDescription>Daftar semua pengajuan SPP.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Kode SPP</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Catatan</TableHead>
                <TableHead className="text-center">Jml Barang</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((req) => (
                <SppTableRow key={req.id} request={req} userRole={userRole} />
              ))}
              {requests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24 text-slate-400">Belum ada data.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
import { PrismaClient } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Calendar, FileInput } from "lucide-react"
import ProcessSppModal from "@/components/ProcessSppModal"

const prisma = new PrismaClient()

export default async function RequestsPage() {
  const requests = await prisma.purchaseRequest.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: { material: true }
      }
    }
  })

  const suppliers = await prisma.supplier.findMany({ orderBy: { name: 'asc' } })

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric'
    })
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Judul Halaman Diubah Jadi Konteks PO */}
      <div className="flex flex-col gap-2">
         <h2 className="text-3xl font-bold tracking-tight text-slate-900">Proses Purchase Order (PO)</h2>
         <p className="text-slate-500">
            Terima request dari gudang, tentukan supplier, dan terbitkan PO.
         </p>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="bg-slate-50 pb-4 border-b">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileInput className="w-5 h-5 text-blue-600" />
            Daftar Request Gudang (Incoming)
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-white">
              <TableRow>
                <TableHead className="w-[180px]">No. Request</TableHead>
                <TableHead>Tgl Masuk</TableHead>
                <TableHead>Catatan Gudang</TableHead>
                <TableHead className="text-center">Jml Item</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-40 text-slate-500 italic">
                    Tidak ada request baru dari gudang.
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((req) => (
                  <TableRow key={req.id} className="hover:bg-slate-50">
                    
                    <TableCell className="font-mono font-bold text-slate-700">
                      {req.code}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2 text-slate-600 text-sm">
                        <Calendar className="w-3 h-3" />
                        {formatDate(req.createdAt)}
                      </div>
                    </TableCell>

                    <TableCell className="max-w-[250px] truncate text-slate-600 italic">
                      "{req.note || "Tanpa catatan"}"
                    </TableCell>

                    <TableCell className="text-center font-bold text-slate-700">
                      {req.items.length} <span className="text-xs font-normal text-slate-400">Barang</span>
                    </TableCell>

                    <TableCell className="text-center">
                      {req.status === 'PENDING' ? (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                          Perlu PO
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                          Selesai
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell className="text-center">
                      {req.status === 'PENDING' ? (
                        // INI YANG MEMUNCULKAN TOMBOL MATA
                        <ProcessSppModal spp={req} suppliers={suppliers} />
                      ) : (
                        <span className="text-xs text-slate-400">Sudah Dibuat</span>
                      )}
                    </TableCell>

                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
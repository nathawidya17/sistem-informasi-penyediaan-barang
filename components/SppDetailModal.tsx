'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar, FileText, ShoppingCart } from "lucide-react"

export default function SppDetailModal({ request, open, onClose }: { request: any, open: boolean, onClose: () => void }) {
  if (!request) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="w-5 h-5 text-blue-600" />
            Detail Permintaan: {request.code}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Info Header */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-semibold uppercase">Tanggal</span>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <Calendar className="w-4 h-4" />
                {new Date(request.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-semibold uppercase">Status</span>
              <div>
                <Badge variant={request.status === 'PENDING' ? 'outline' : 'default'}>{request.status}</Badge>
              </div>
            </div>
            <div className="col-span-2 space-y-1 border-t border-slate-200 pt-2 mt-1">
              <span className="text-xs text-slate-500 font-semibold uppercase">Catatan</span>
              <p className="text-sm text-slate-600 italic">"{request.note || '-'}"</p>
            </div>
          </div>

          {/* Tabel Barang */}
          <div>
            <h4 className="flex items-center gap-2 font-semibold text-slate-800 mb-3">
              <ShoppingCart className="w-4 h-4" /> Daftar Barang
            </h4>
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-100">
                  <TableRow>
                    <TableHead>Nama Barang</TableHead>
                    <TableHead className="text-center">Jumlah</TableHead>
                    <TableHead className="text-center">Satuan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {request.items.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.material.name}</TableCell>
                      <TableCell className="text-center font-bold">{item.quantity}</TableCell>
                      <TableCell className="text-center text-sm font-mono">{item.satuan}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
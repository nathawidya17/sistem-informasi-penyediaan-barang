'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar, FileSignature, Building2, User } from "lucide-react"

export default function PoDetailModal({ po, open, onClose }: { po: any, open: boolean, onClose: () => void }) {
  if (!po) return null

  // Hitung Grand Total
  const grandTotal = po.items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl text-blue-800">
            <FileSignature className="w-5 h-5"/>
            Detail Purchase Order (PO)
          </DialogTitle>
          <p className="text-sm text-slate-500 font-mono">Kode PO: {po.code}</p>
        </DialogHeader>

        <div className="space-y-6 py-2">
          
          {/* Info Header */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-semibold uppercase">Supplier Tujuan</span>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <Building2 className="w-4 h-4 text-blue-600" />
                {po.supplier.name}
              </div>
              <p className="text-xs text-slate-500 pl-6">{po.supplier.address}</p>
            </div>
            
            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-semibold uppercase">Tanggal Dibuat</span>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <Calendar className="w-4 h-4" />
                {new Date(po.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>

            <div className="col-span-2 pt-2 border-t border-slate-200">
                <span className="text-xs text-slate-500 font-semibold uppercase">Status Saat Ini: </span>
                <Badge className="ml-2" variant={po.status === 'PENDING' ? 'outline' : (po.status === 'APPROVED' ? 'default' : 'destructive')}>
                    {po.status}
                </Badge>
            </div>
          </div>

          {/* Tabel Barang */}
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-100">
                <TableRow>
                  <TableHead>Nama Barang</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead className="text-right">Harga Satuan</TableHead>
                  <TableHead className="text-right">Total Harga</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {po.items.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.material.name}</TableCell>
                    <TableCell className="text-center font-bold">
                        {item.quantity.toLocaleString('id-ID')}
                    </TableCell>
                    <TableCell className="text-right text-slate-600">
                        Rp {item.price.toLocaleString('id-ID')}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-slate-800">
                        Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                    </TableCell>
                  </TableRow>
                ))}
                
                {/* Grand Total Row */}
                <TableRow className="bg-slate-50">
                    <TableCell colSpan={3} className="text-right font-bold text-slate-600 uppercase text-xs tracking-wider">
                        Grand Total Belanja
                    </TableCell>
                    <TableCell className="text-right font-bold text-lg text-blue-700">
                        Rp {grandTotal.toLocaleString('id-ID')}
                    </TableCell>
                </TableRow>

              </TableBody>
            </Table>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  )
}
'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Building2, CheckCircle, FileText } from "lucide-react"

export default function SppPoDetailModal({ request, open, onClose }: { request: any, open: boolean, onClose: () => void }) {
  if (!request) return null

  // Ambil data PO dari request
  const pos = request.purchaseOrders || []

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl text-green-700">
            <CheckCircle className="w-6 h-6"/>
            Detail PO Disetujui Manajer
          </DialogTitle>
          <p className="text-sm text-slate-500">Asal SPP: {request.code}</p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          
          {pos.length === 0 ? (
            <p className="text-center text-slate-500">Belum ada data PO.</p>
          ) : (
            pos.map((po: any) => (
              <div key={po.id} className="border rounded-lg overflow-hidden mb-4 shadow-sm">
                
                {/* Header Supplier */}
                <div className="bg-slate-50 p-3 flex justify-between items-center border-b">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-500" />
                    <span className="font-bold text-slate-700">{po.supplier.name}</span>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs">{po.code}</Badge>
                </div>

                {/* Tabel Barang */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama Barang</TableHead>
                      <TableHead className="text-center">Qty</TableHead>
                      <TableHead className="text-right">Harga Beli</TableHead>
                      <TableHead className="text-right">Total</TableHead>
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
                  </TableBody>
                </Table>
              </div>
            ))
          )}

        </div>
      </DialogContent>
    </Dialog>
  )
}
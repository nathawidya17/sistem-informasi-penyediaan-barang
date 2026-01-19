'use client'

import { useState } from "react"
import { TableRow, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Clock, Eye, Check, X, Loader2 } from "lucide-react"
import PoDetailModal from "@/components/PoDetailModal"
import { approvePoAction } from "@/app/actions/approvalActions"

export default function ApprovalTableRow({ po }: { po: any }) {
  const [showDetail, setShowDetail] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleAction = async (action: 'APPROVE' | 'REJECT') => {
    const msg = action === 'APPROVE' 
        ? "Setujui PO ini? Status akan berubah menjadi APPROVED." 
        : "Tolak PO ini? Status akan berubah menjadi REJECTED."
    
    if (!confirm(msg)) return

    setIsLoading(true)
    const res = await approvePoAction(po.id, action)
    setIsLoading(false)

    if (!res.success) alert(res.message)
  }

  // Helper Warna Status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1"/> Menunggu Approval</Badge>
      case 'APPROVED': return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1"/> Disetujui</Badge>
      case 'REJECTED': return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="w-3 h-3 mr-1"/> Ditolak</Badge>
      default: return <Badge variant="outline">{status}</Badge>
    }
  }

  // Hitung Total Singkat
  const totalAmount = po.items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0)

  return (
    <>
      <TableRow className="hover:bg-slate-50 transition-colors">
        <TableCell className="font-bold text-slate-700 font-mono">{po.code}</TableCell>
        <TableCell>
            <div className="font-medium text-slate-700">{po.supplier.name}</div>
        </TableCell>
        <TableCell>
            {new Date(po.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
        </TableCell>
        <TableCell>
            Rp {totalAmount.toLocaleString('id-ID')}
        </TableCell>
        <TableCell>
            {getStatusBadge(po.status)}
        </TableCell>
        
        {/* KOLOM AKSI */}
        <TableCell className="text-center">
          <div className="flex items-center justify-center gap-1">
            
            {/* 1. Detail (Semua Status Bisa Lihat) */}
            <Button variant="ghost" size="sm" onClick={() => setShowDetail(true)} title="Lihat Detail">
              <Eye className="w-4 h-4 text-slate-500" />
            </Button>

            {/* 2. Approve/Reject (HANYA MUNCUL JIKA PENDING) */}
            {po.status === 'PENDING' && (
              <>
                <div className="w-px h-4 bg-slate-300 mx-2"></div>
                
                <Button 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700 text-white h-8 w-8 p-0" 
                    onClick={() => handleAction('APPROVE')} 
                    disabled={isLoading}
                    title="Setujui (Approve)"
                >
                    {isLoading ? <Loader2 className="w-3 h-3 animate-spin"/> : <Check className="w-4 h-4" />}
                </Button>

                <Button 
                    size="sm" 
                    variant="ghost"
                    className="text-red-500 hover:bg-red-50 h-8 w-8 p-0" 
                    onClick={() => handleAction('REJECT')} 
                    disabled={isLoading}
                    title="Tolak (Reject)"
                >
                    <X className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </TableCell>
      </TableRow>

      <PoDetailModal open={showDetail} onClose={() => setShowDetail(false)} po={po} />
    </>
  )
}
'use client'

import { useState } from "react"
import { TableRow, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, CheckCircle, XCircle, Clock, Eye, FileCheck } from "lucide-react"
import SppDetailModal from "@/components/SppDetailModal"
import ProcessSppModal from "@/components/ProcessSppModal"

export default function SppTableRow({ request, userRole }: { request: any, userRole: string }) {
  const [showDetail, setShowDetail] = useState(false)
  const [showProcess, setShowProcess] = useState(false)

  // Helper status warna
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1"/> Pending</Badge>
      case 'PROCESSED': return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1"/> Diproses PO</Badge>
      case 'REJECTED': return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="w-3 h-3 mr-1"/> Ditolak</Badge>
      default: return <Badge variant="outline">{status}</Badge>
    }
  }

  // Logic Visibility Tombol
  const isGudang = userRole === 'GUDANG'
  const isPurchasing = userRole === 'PURCHASING'
  const canProcess = isPurchasing && request.status === 'PENDING'

  return (
    <>
      <TableRow className="hover:bg-slate-50 transition-colors">
        <TableCell className="font-bold text-slate-700 font-mono">{request.code}</TableCell>
        <TableCell>
          <div className="flex items-center gap-2 text-slate-600 text-sm">
            <Calendar className="w-3 h-3" />
            {new Date(request.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </TableCell>
        <TableCell className="max-w-[200px] truncate text-slate-500 text-sm">{request.note || "-"}</TableCell>
        <TableCell className="text-center"><Badge variant="secondary">{request.items?.length || 0} Item</Badge></TableCell>
        <TableCell>{getStatusBadge(request.status)}</TableCell>
        
        {/* KOLOM AKSI */}
        <TableCell className="text-center">
          <div className="flex items-center justify-center gap-2">
            
            {/* 1. TOMBOL MATA (Hanya Gudang) */}
            {isGudang && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowDetail(true)} 
                title="Lihat Detail Barang"
                className="hover:bg-blue-50 hover:text-blue-600"
              >
                <Eye className="w-4 h-4" />
              </Button>
            )}

            {/* 2. TOMBOL BUAT PO (Hanya Purchasing & Status Pending) */}
            {canProcess && (
              <Button 
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700 text-white h-8 px-3 text-xs shadow-sm" 
                onClick={() => setShowProcess(true)}
              >
                <FileCheck className="w-3 h-3 mr-1.5" /> Buat PO
              </Button>
            )}

            {/* Jika Purchasing tapi sudah selesai, tampilkan text saja atau kosong */}
            {isPurchasing && !canProcess && (
               <span className="text-xs text-slate-400 italic">-</span>
            )}

          </div>
        </TableCell>
      </TableRow>

      {/* Modal View Detail (Untuk Gudang) */}
      <SppDetailModal 
        open={showDetail} 
        onClose={() => setShowDetail(false)} 
        request={request} 
      />

      {/* Modal Proses PO (Untuk Purchasing) */}
      {showProcess && (
        <ProcessSppModal
          open={showProcess}
          onClose={() => setShowProcess(false)}
          request={request}
        />
      )}
    </>
  )
}
'use client'

import { useState } from "react"
import { TableRow, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, CheckCircle, Clock, Eye, FileCheck, UserCog } from "lucide-react"
import SppDetailModal from "@/components/SppDetailModal"
import ProcessSppModal from "@/components/ProcessSppModal"
import SppPoDetailModal from "@/components/SppPoDetialModal" // Modal Baru

export default function SppTableRow({ request, userRole }: { request: any, userRole: string }) {
  const [showDetail, setShowDetail] = useState(false)
  const [showProcess, setShowProcess] = useState(false)
  const [showPoResult, setShowPoResult] = useState(false) // State buat modal hasil PO

  // --- LOGIKA STATUS CANGGIH ---
  // Kita cek status dari PO yang terhubung
  const pos = request.purchaseOrders || []
  let displayStatus = request.status // Default PENDING/REJECTED
  
  // Jika SPP sudah diproses purchasing (PROCESSED), kita cek nasib PO-nya di tangan Manajer
  if (request.status === 'PROCESSED') {
    const isAllApproved = pos.length > 0 && pos.every((p: any) => p.status === 'APPROVED')
    const isAnyRejected = pos.some((p: any) => p.status === 'REJECTED')
    
    if (isAllApproved) {
      displayStatus = 'APPROVED_MANAGER' // Status Custom buat UI
    } else if (isAnyRejected) {
      displayStatus = 'REJECTED_MANAGER'
    } else {
      displayStatus = 'WAITING_MANAGER' // Masih Pending di Manajer
    }
  }

  // Render Badge Warna Warni
  const renderStatusBadge = () => {
    switch (displayStatus) {
      case 'PENDING': 
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1"/> Pending</Badge>
      
      case 'WAITING_MANAGER': 
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200"><UserCog className="w-3 h-3 mr-1"/> Menunggu Manajer</Badge>
      
      case 'APPROVED_MANAGER': 
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1"/> Disetujui Manajer</Badge>
      
      case 'REJECTED_MANAGER': 
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Ditolak Manajer</Badge>
      
      default: 
        return <Badge variant="outline">{displayStatus}</Badge>
    }
  }

  // --- LOGIKA TOMBOL AKSI ---
  const isGudang = userRole === 'GUDANG'
  const isPurchasing = userRole === 'PURCHASING'

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
        
        {/* STATUS BARU */}
        <TableCell>{renderStatusBadge()}</TableCell>
        
        {/* KOLOM AKSI */}
        <TableCell className="text-center">
          <div className="flex items-center justify-center gap-2">
            
            {/* 1. GUDANG: Selalu Tombol Mata (Liat SPP Awal) */}
            {isGudang && (
              <Button variant="ghost" size="sm" onClick={() => setShowDetail(true)} title="Lihat Detail Permintaan">
                <Eye className="w-4 h-4" />
              </Button>
            )}

            {/* 2. PURCHASING: Logic berubah */}
            {isPurchasing && (
              <>
                {/* Kalau MASIH PENDING -> Tombol Buat PO */}
                {displayStatus === 'PENDING' && (
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white h-8 px-3 text-xs shadow-sm" onClick={() => setShowProcess(true)}>
                    <FileCheck className="w-3 h-3 mr-1.5" /> Buat PO
                  </Button>
                )}

                {/* Kalau SUDAH DISETUJUI MANAJER -> Tombol Mata (Liat Detail PO) */}
                {displayStatus === 'APPROVED_MANAGER' && (
                  <Button size="sm" variant="outline" className="text-green-700 border-green-200 hover:bg-green-50 h-8 px-3 text-xs" onClick={() => setShowPoResult(true)}>
                    <Eye className="w-3 h-3 mr-1.5" /> Lihat PO
                  </Button>
                )}

                {/* Kalau Sedang Menunggu Manajer -> Info text aja */}
                {displayStatus === 'WAITING_MANAGER' && (
                   <span className="text-xs text-slate-400 italic">Menunggu Approval...</span>
                )}
              </>
            )}

          </div>
        </TableCell>
      </TableRow>

      {/* Modal 1: Detail SPP (Buat Gudang / Draft Awal) */}
      <SppDetailModal open={showDetail} onClose={() => setShowDetail(false)} request={request} />

      {/* Modal 2: Form Proses PO (Buat Purchasing) */}
      {showProcess && <ProcessSppModal open={showProcess} onClose={() => setShowProcess(false)} request={request} />}

      {/* Modal 3: Detail Hasil PO (Setelah Approved Manajer) */}
      {showPoResult && <SppPoDetailModal open={showPoResult} onClose={() => setShowPoResult(false)} request={request} />}
    </>
  )
}
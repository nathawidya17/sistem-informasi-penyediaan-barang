'use client'

import { useState } from 'react'
import { Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TableRow, TableCell } from "@/components/ui/table"
import EditStockModal from '@/components/EditStockModal'

// Tipe data Supplier
type SupplierData = {
  id: string
  name: string
}

// Tipe data Material
type MaterialData = {
  id: string
  name: string
  satuan: string
  pricePerUnit: number
  stock: number
  eoqBiayaPesan: number
  eoqBiayaSimpan: number
  supplier?: {
    id: string
    name: string
  } | null
}

type InventoryTableRowProps = {
  item: MaterialData
  suppliers: SupplierData[] 
}

export function InventoryTableRow({ item, suppliers }: InventoryTableRowProps) {
  const [showEditModal, setShowEditModal] = useState(false)
  const [key, setKey] = useState(0) 

  const handleSuccess = () => {
    setKey(prev => prev + 1)
    setShowEditModal(false) 
  }

  return (
    <>
      <TableRow className="hover:bg-slate-50 transition-colors">
        
        {/* 1. Nama Bahan */}
        <TableCell className="font-medium align-top py-4">
          <div className="flex flex-col gap-1">
            <span className="font-bold text-slate-800 text-base">{item.name}</span>
            <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wide">
              ID: {item.id.substring(0, 6)}
            </span>
          </div>
        </TableCell>

        {/* 2. Supplier */}
        <TableCell className="align-top py-4">
          {item.supplier ? (
            <Badge variant="outline" className="text-blue-700 bg-blue-50/50 border-blue-200 font-normal px-2.5 py-0.5">
              {item.supplier.name}
            </Badge>
          ) : (
            <span className="text-slate-400 italic text-xs">- Belum set -</span>
          )}
        </TableCell>

        {/* 3. Harga */}
        <TableCell className="align-top py-4">
          <div className="font-medium text-slate-700">
            Rp {(item.pricePerUnit || 0).toLocaleString('id-ID')}
          </div>
          <span className="text-xs text-slate-400">per {item.satuan}</span> 
        </TableCell>

        {/* 4. Biaya Pesan */}
        <TableCell className="text-slate-600 align-top py-4 text-sm">
          {item.eoqBiayaPesan > 0
            ? `Rp ${(item.eoqBiayaPesan || 0).toLocaleString('id-ID', { maximumFractionDigits: 0 })}`
            : <span className="text-slate-300">-</span>}
        </TableCell>

        {/* 5. Biaya Simpan */}
        <TableCell className="align-top py-4">
          {item.eoqBiayaSimpan > 0
            ? <span className="text-emerald-700 font-medium bg-emerald-50 px-2 py-1 rounded text-xs border border-emerald-100">
              Rp {(item.eoqBiayaSimpan || 0).toLocaleString('id-ID', { maximumFractionDigits: 2 })}
            </span>
            : <span className="text-slate-300">-</span>}
        </TableCell>

        {/* 6. Stok Fisik (SEJAJAR / SATU BARIS) */}
        <TableCell className="text-right align-top py-4">
            <div className="flex items-baseline justify-end gap-1.5">
                <span className="text-lg font-bold text-slate-900">
                  {(item.stock || 0).toLocaleString('id-ID')}
                </span>
                <span className="text-xs font-medium text-slate-500 uppercase">
                  {item.satuan}
                </span>
            </div>
        </TableCell>

        {/* 7. AKSI (Tombol Edit Dengan Border & BG) */}
        <TableCell className="text-center align-top py-4">
          <Button
            size="icon"
            variant="outline" // Pakai outline biar ada border bawaan
            onClick={() => setShowEditModal(true)}
            className="h-8 w-8 bg-white border-slate-300 shadow-sm hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all"
            title="Edit Data"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
        </TableCell>

      </TableRow>

      {/* Modal Edit */}
      {showEditModal && (
        <EditStockModal
          key={key}
          material={item}
          suppliers={suppliers}
          onClose={() => setShowEditModal(false)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  )
}
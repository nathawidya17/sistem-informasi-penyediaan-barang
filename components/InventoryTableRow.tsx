'use client'

import { useState } from 'react'
import { Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TableRow, TableCell } from "@/components/ui/table"
import EditStockModal from '@/components/EditStockModal'

// Tipe data
type SupplierData = {
  id: string
  name: string
}

type StorageData = {
  id: string
  name: string
  type: string
}

type MaterialData = {
  id: string
  name: string
  unit: string
  pricePerUnit: number
  stock: number
  category: string // [FIX] Wajib ada biar ga error di modal
  storagePercentage: number 
  storageId?: string | null
  supplier?: { id: string; name: string } | null
  storage?: { id: string; name: string } | null 
}

type InventoryTableRowProps = {
  item: MaterialData
  suppliers: SupplierData[]
  storages: StorageData[] // Wajib ada untuk dropdown modal
  userRole: string 
}

export function InventoryTableRow({ item, suppliers, storages, userRole }: InventoryTableRowProps) {
  const [showEditModal, setShowEditModal] = useState(false)
  const [key, setKey] = useState(0) 

  const canEdit = userRole === "PURCHASING"

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
          <span className="text-xs text-slate-400">per {item.unit}</span> 
        </TableCell>

        {/* 4. Stok Fisik */}
        <TableCell className="text-right align-top py-4">
            <div className="flex items-baseline justify-end gap-1.5">
                <span className="text-lg font-bold text-slate-900">
                  {(item.stock || 0).toLocaleString('id-ID')}
                </span>
                <span className="text-xs font-medium text-slate-500 uppercase">
                  {item.unit}
                </span>
            </div>
        </TableCell>

        {/* 5. AKSI (Muncul untuk Purchasing Saja) */}
        {canEdit && (
          <TableCell className="text-center align-top py-4">
            <Button
              size="icon"
              variant="outline"
              onClick={() => setShowEditModal(true)}
              className="h-8 w-8 bg-white border-slate-300 shadow-sm hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all"
              title="Edit Data Lengkap"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </Button>
          </TableCell>
        )}

      </TableRow>

      {/* Modal Edit */}
      {showEditModal && (
        <EditStockModal
          key={key}
          material={item}
          suppliers={suppliers}
          storages={storages} 
          onClose={() => setShowEditModal(false)}
          onSuccess={handleSuccess}
          userRole={userRole} 
        />
      )}
    </>
  )
}
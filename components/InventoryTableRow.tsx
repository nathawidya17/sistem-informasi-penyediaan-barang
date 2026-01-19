'use client'

import { useState } from 'react'
import { Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import EditStockModal from '@/components/EditStockModal'

// Tipe data Supplier
type SupplierData = {
  id: string
  name: string
}

// Tipe data Material (UPDATE: unit -> satuan)
type MaterialData = {
  id: string
  name: string
  satuan: string // <--- GANTI INI DARI 'unit' JADI 'satuan'
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
  }

  return (
    <>
      <tr className="border-b hover:bg-slate-50 transition-colors">
        {/* Nama Bahan */}
        <td className="font-medium px-4 py-3">
          <div className="flex flex-col">
            <span className="font-bold text-slate-800">{item.name}</span>
            <span className="text-[10px] text-slate-400 uppercase">ID: {item.id.substring(0, 6)}</span>
          </div>
        </td>

        {/* Supplier */}
        <td className="px-4 py-3 text-sm text-slate-600">
          {item.supplier ? (
            <span className="font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded text-xs">
              {item.supplier.name}
            </span>
          ) : (
            <span className="text-slate-400 italic text-xs">- Belum set -</span>
          )}
        </td>

        {/* Harga */}
        <td className="px-4 py-3">
          <div className="font-medium">
            Rp {(item.pricePerUnit || 0).toLocaleString('id-ID')}
          </div>
          {/* UPDATE: item.satuan */}
          <span className="text-xs text-slate-400">per {item.satuan}</span> 
        </td>

        {/* Biaya Pesan */}
        <td className="px-4 py-3 text-slate-600">
          {item.eoqBiayaPesan > 0
            ? `Rp ${(item.eoqBiayaPesan || 0).toLocaleString('id-ID', { maximumFractionDigits: 0 })}`
            : <span className="text-slate-300">-</span>}
        </td>

        {/* Biaya Simpan */}
        <td className="px-4 py-3">
          {item.eoqBiayaSimpan > 0
            ? <span className="text-emerald-700 font-medium bg-emerald-50 px-2 py-1 rounded-md text-xs">
              Rp {(item.eoqBiayaSimpan || 0).toLocaleString('id-ID', { maximumFractionDigits: 2 })}
            </span>
            : <span className="text-slate-300">-</span>}
        </td>

        {/* Stok Fisik */}
        <td className="text-right px-4 py-3">
          <div className="flex items-center justify-end gap-3">
            <div className="text-right">
              <span className="block text-lg font-bold text-slate-800">
                {(item.stock || 0).toLocaleString('id-ID')}
              </span>
              {/* UPDATE: item.satuan */}
              <span className="text-xs text-slate-500">{item.satuan}</span>
            </div>
            
            <Button
              size="icon"
              variant="outline"
              onClick={() => setShowEditModal(true)}
              className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600 border-slate-200"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
        </td>
      </tr>

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
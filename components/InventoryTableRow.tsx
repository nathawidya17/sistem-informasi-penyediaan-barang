'use client'

import { useState } from 'react'
import { Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import EditStockModal  from '@/components/EditStockModal'

type MaterialData = {
  id: string
  name: string
  unit: string
  pricePerUnit: number
  stock: number
  eoqBiayaPesan: number
  eoqBiayaSimpan: number
}

type InventoryTableRowProps = {
  item: MaterialData
}

export function InventoryTableRow({ item }: InventoryTableRowProps) {
  const [showEditModal, setShowEditModal] = useState(false)
  const [key, setKey] = useState(0)

  const handleSuccess = () => {
    setKey(prev => prev + 1)
  }

  return (
    <>
      <tr>
        <td className="font-medium px-4 py-2">
          <div className="flex flex-col">
            <span className="font-bold text-slate-800">{item.name}</span>
            <span className="text-[10px] text-slate-400 uppercase">ID: {item.id.substring(0, 6)}</span>
          </div>
        </td>

        <td className="px-4 py-2">
          Rp {(item.pricePerUnit || 0).toLocaleString('id-ID')}
          <span className="text-xs text-slate-400"> / {item.unit}</span>
        </td>

        <td className="px-4 py-2">
          {item.eoqBiayaPesan > 0
            ? `Rp ${(item.eoqBiayaPesan || 0).toLocaleString('id-ID', { maximumFractionDigits: 0 })}`
            : <span className="text-slate-300">-</span>}
        </td>

        <td className="px-4 py-2">
          {item.eoqBiayaSimpan > 0
            ? <span className="text-blue-700 font-medium bg-blue-50 px-2 py-1 rounded-md text-xs">
              Rp {(item.eoqBiayaSimpan || 0).toLocaleString('id-ID', { maximumFractionDigits: 2 })}
            </span>
            : <span className="text-slate-300">-</span>}
        </td>

        <td className="text-right px-4 py-2">
          <div className="flex items-center justify-end gap-2">
            <div>
              <span className="text-lg font-bold text-slate-800">
                {(item.stock || 0).toLocaleString('id-ID')}
              </span>
              <span className="text-sm text-slate-500 ml-1">{item.unit}</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowEditModal(true)}
              className="h-8 w-8 p-0"
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
          onClose={() => setShowEditModal(false)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  )
}

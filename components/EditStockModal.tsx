'use client'

import { useState } from 'react'
import { X, Save, Loader2 } from 'lucide-react'
import { updateStockAction } from '@/app/actions/updateStockAction' 
import { Button } from '@/components/ui/button'

type MaterialData = {
  id: string
  name: string
  unit: string
  pricePerUnit: number
  stock: number
  eoqBiayaPesan: number
  eoqBiayaSimpan: number
}

type EditStockModalProps = {
  material: MaterialData
  onClose: () => void
  onSuccess?: () => void
}

export default function EditStockModal({ material, onClose, onSuccess }: EditStockModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    
    formData.append('materialId', material.id)
    formData.append('unit', material.unit) 

    const result = await updateStockAction(formData)

    setIsLoading(false)

    if (result.success) {
      if (onSuccess) onSuccess()
      onClose()
    } else {
      alert('Gagal update: ' + (result.error || 'Terjadi kesalahan'))
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="font-bold text-lg text-slate-800">Edit Data Material</h3>
            <p className="text-xs text-slate-500 uppercase tracking-wider">ID: {material.id.substring(0, 8)}...</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Nama Bahan */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-600">Nama Bahan</label>
            <input
              name="name"
              defaultValue={material.name}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 text-sm"
              placeholder="Contoh: Gula Rafinasi"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Harga / Unit */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-600">Harga / {material.unit}</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-400 text-sm">Rp</span>
                <input
                  type="number"
                  name="pricePerUnit"
                  defaultValue={material.pricePerUnit}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 text-sm"
                />
              </div>
            </div>

            {/* Stok Fisik */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-600">Stok Fisik</label>
              <div className="relative">
                <input
                  type="number"
                  name="stock"
                  defaultValue={material.stock}
                  className="w-full pl-3 pr-12 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 text-sm font-bold"
                />
                <span className="absolute right-3 top-2 text-slate-400 text-sm">{material.unit}</span>
              </div>
            </div>
          </div>

          <hr className="border-slate-100 my-2" />

          {/* Parameter EOQ */}
          <div className="grid grid-cols-2 gap-4">
            {/* Biaya Pesan (S) */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-600">Biaya Pesan (S)</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-400 text-sm">Rp</span>
                <input
                  type="number"
                  name="eoqBiayaPesan"
                  defaultValue={material.eoqBiayaPesan}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 text-sm"
                />
              </div>
              <p className="text-[10px] text-slate-400">Biaya per satu kali pemesanan.</p>
            </div>

            {/* Biaya Simpan (H) */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-600">Biaya Simpan (H)</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-400 text-sm">Rp</span>
                <input
                  type="number"
                  step="0.01" // Mengizinkan koma
                  name="eoqBiayaSimpan"
                  defaultValue={material.eoqBiayaSimpan}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 text-sm"
                />
              </div>
              <p className="text-[10px] text-slate-400">Biaya simpan per unit/tahun.</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white min-w-[100px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> 
                  Simpan
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
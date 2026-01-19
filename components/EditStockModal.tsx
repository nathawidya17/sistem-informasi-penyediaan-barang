'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Save, Loader2 } from 'lucide-react'
import { updateMaterialAction } from '@/app/actions/updateMaterial' 
import { Button } from '@/components/ui/button'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"

// --- Update Tipe Data (unit -> satuan) ---
type MaterialData = {
  id: string
  name: string
  satuan: string // <--- GANTI JADI SATUAN
  pricePerUnit: number
  stock: number
  eoqBiayaPesan: number
  eoqBiayaSimpan: number
  supplier?: { id: string; name: string } | null
}

type SupplierData = {
  id: string
  name: string
}

type EditStockModalProps = {
  material: MaterialData
  suppliers: SupplierData[] 
  onClose: () => void
  onSuccess?: () => void
}

const SATUAN_OPTIONS = ["KG", "ROLL", "PCS"]

export default function EditStockModal({ material, suppliers, onClose, onSuccess }: EditStockModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  // State dropdown
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>(material.supplier?.id || "")
  const [selectedSatuan, setSelectedSatuan] = useState<string>(material.satuan || "KG") // State untuk Satuan

  useEffect(() => {
    setMounted(true)
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = 'unset' }
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    formData.append('id', material.id)
    formData.append('supplierId', selectedSupplierId)
    
    // Pastikan satuan terkirim dari state dropdown
    formData.append('satuan', selectedSatuan) 

    const result = await updateMaterialAction(formData)

    setIsLoading(false)

    if (result.success) {
      if (onSuccess) onSuccess()
      onClose()
    } else {
      alert('Gagal update: ' + result.message)
    }
  }

  if (!mounted) return null

  return createPortal(
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
          
          <div className="grid grid-cols-2 gap-4">
            {/* Nama Bahan */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-600">Nama Bahan</label>
              <input
                name="name"
                defaultValue={material.name}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
              />
            </div>

            {/* Satuan (DROPDOWN BARU) */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-600">Satuan</label>
              <Select value={selectedSatuan} onValueChange={setSelectedSatuan}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Satuan" />
                </SelectTrigger>
                <SelectContent>
                  {SATUAN_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Supplier */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-600">Supplier Utama</label>
            <Select 
              value={selectedSupplierId} 
              onValueChange={setSelectedSupplierId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Supplier..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="null_value">-- Tidak Ada Supplier --</SelectItem>
                {suppliers.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Harga */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-600">Harga / {selectedSatuan}</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-400 text-sm">Rp</span>
                <input
                  type="number"
                  name="pricePerUnit"
                  defaultValue={material.pricePerUnit}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md text-sm"
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
                  className="w-full pl-3 pr-12 py-2 border border-slate-300 rounded-md text-sm font-bold"
                />
                <span className="absolute right-3 top-2 text-slate-400 text-sm">{selectedSatuan}</span>
              </div>
            </div>
          </div>

          <hr className="border-slate-100 my-2" />

          {/* Parameter EOQ */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-600">Biaya Pesan (S)</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-400 text-sm">Rp</span>
                <input
                  type="number"
                  name="eoqBiayaPesan"
                  defaultValue={material.eoqBiayaPesan}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md text-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-600">Biaya Simpan (H)</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-400 text-sm">Rp</span>
                <input
                  type="number"
                  step="0.01"
                  name="eoqBiayaSimpan"
                  defaultValue={material.eoqBiayaSimpan}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md text-sm"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white min-w-[100px]">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Simpan
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}
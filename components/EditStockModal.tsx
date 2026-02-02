'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Save, Loader2, Warehouse, Percent, Tag } from 'lucide-react'
import { updateMaterialAction } from '@/app/actions/updateMaterial'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"

// Tipe Data
type MaterialData = {
  id: string
  name: string
  unit: string 
  pricePerUnit: number
  stock: number
  category: string // [BARU] Tambahkan field category
  storagePercentage: number
  storageId?: string | null
  supplier?: { id: string; name: string } | null
}

type SupplierData = {
  id: string
  name: string
}

type StorageData = {
  id: string
  name: string
  type: string
}

type EditStockModalProps = {
  material: MaterialData
  suppliers: SupplierData[] 
  storages: StorageData[] 
  onClose: () => void
  onSuccess?: () => void
  userRole: string 
}

const SATUAN_OPTIONS = ["Kg", "Pcs", "Liter", "Roll", "Zak", "Box", "Kaleng"]

export default function EditStockModal({ material, suppliers, storages = [], onClose, onSuccess, userRole }: EditStockModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  // State dropdown
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>(material.supplier?.id || "null_value")
  const [selectedStorageId, setSelectedStorageId] = useState<string>(material.storageId || "null_value")
  const [selectedSatuan, setSelectedSatuan] = useState<string>(material.unit || "Kg")
  const [selectedCategory, setSelectedCategory] = useState<string>(material.category || "BAHAN_BAKU") // [BARU]

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
    formData.append('role', userRole) 
    
    // Append manual dropdowns
    if(selectedSupplierId !== "null_value") formData.append('supplierId', selectedSupplierId)
    if(selectedStorageId !== "null_value") formData.append('storageId', selectedStorageId)
    
    formData.append('unit', selectedSatuan)
    formData.append('category', selectedCategory) // [BARU] Kirim kategori

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
            <p className="text-xs text-slate-500">Update identitas & parameter gudang</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* SECTION 1: IDENTITAS (Nama, Kategori, Satuan) */}
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>Nama Bahan</Label>
              <Input name="name" defaultValue={material.name} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* [BARU] Input Kategori */}
              <div className="space-y-1">
                <Label>Kategori</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BAHAN_BAKU">Bahan Baku</SelectItem>
                    <SelectItem value="BAHAN_PENOLONG">Bahan Penolong</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label>Satuan</Label>
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
          </div>

          <hr className="border-slate-100" />

          {/* SECTION 2: SUPPLIER & HARGA */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Supplier Utama</Label>
              <Select value={selectedSupplierId} onValueChange={setSelectedSupplierId}>
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

            <div className="space-y-1">
              <Label>Harga Satuan (Rp)</Label>
              <div className="relative">
                 <span className="absolute left-3 top-2.5 text-slate-400 text-sm">Rp</span>
                 <Input 
                   name="pricePerUnit" 
                   type="number" 
                   defaultValue={material.pricePerUnit} 
                   className="pl-9"
                 />
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />
          
          {/* SECTION 3: GUDANG (Menampilkan 6 Jenis Penyimpanan) */}
          <div className="bg-blue-50 p-3 rounded-md text-blue-800 text-sm font-medium flex items-center gap-2">
             <Warehouse className="w-4 h-4"/> Parameter Gudang 
          </div>

          <div className="grid grid-cols-1 gap-4">
             <div className="space-y-1">
                <Label>Lokasi Gudang (Storage)</Label>
                <Select value={selectedStorageId} onValueChange={setSelectedStorageId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Gudang..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="null_value">-- Pilih Gudang --</SelectItem>
                    {/* Data ini diambil dari database (6 jenis penyimpanan) */}
                    {storages && storages.map((stg) => (
                      <SelectItem key={stg.id} value={stg.id}>
                        {stg.name} ({stg.type.replace('_', ' ')})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[10px] text-slate-500">Menentukan Biaya Operasional Total untuk perhitungan.</p>
             </div>
             
             <div className="space-y-1">
                <Label>Persentase Beban (%)</Label>
                <div className="relative">
                   <Input 
                      name="storagePercentage" 
                      type="number" 
                      step="0.01"
                      min="0.01"
                      max="100"
                      // Konversi dari decimal (0.1) ke persen (10)
                      defaultValue={(material.storagePercentage || 0) * 100} 
                      className="pr-9"
                   />
                   <span className="absolute right-3 top-2.5 text-slate-400 text-sm"><Percent className="w-4 h-4"/></span>
                </div>
                <p className="text-[10px] text-slate-500">Persentase alokasi biaya gudang untuk barang ini.</p>
             </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Simpan Data
            </Button>
          </div>

        </form>
      </div>
    </div>,
    document.body
  )
}
'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Save, Loader2 } from 'lucide-react'
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

type MaterialData = {
  id: string
  name: string
  unit: string 
  pricePerUnit: number
  stock: number
  eoqBiayaPesan: number
  eoqBiayaSimpan: number
  existingFreq?: number 
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
  userRole: string 
}

const SATUAN_OPTIONS = ["KG", "ROLL", "PCS"]

export default function EditStockModal({ material, suppliers, onClose, onSuccess, userRole }: EditStockModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  // State dropdown
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>(material.supplier?.id || "null_value")
  const [selectedSatuan, setSelectedSatuan] = useState<string>(material.unit || "KG")

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
    formData.append('supplierId', selectedSupplierId)
    formData.append('unit', selectedSatuan)

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
            <p className="text-xs text-slate-500">Update parameter barang & EOQ</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body (FULL FORM UNTUK PURCHASING) */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Nama Bahan</Label>
              <Input name="name" defaultValue={material.name} required />
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

          <hr className="border-slate-100" />
          
          <div className="bg-blue-50 p-3 rounded-md text-blue-800 text-sm font-medium">
             Parameter Analisa EOQ
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1">
                <Label>Biaya Pesan (S)</Label>
                <div className="relative">
                   <span className="absolute left-3 top-2.5 text-slate-400 text-sm">Rp</span>
                   <Input 
                      name="eoqBiayaPesan" 
                      type="number" 
                      defaultValue={material.eoqBiayaPesan} 
                      className="pl-9"
                   />
                </div>
             </div>
             
             <div className="space-y-1">
                <Label>Biaya Simpan (H)</Label>
                <div className="relative">
                   <span className="absolute left-3 top-2.5 text-slate-400 text-sm">Rp</span>
                   <Input 
                      name="eoqBiayaSimpan" 
                      type="number" 
                      step="0.01"
                      defaultValue={material.eoqBiayaSimpan} 
                      className="pl-9"
                   />
                </div>
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
'use client'

import { useState, useRef } from "react"
import { addMaterial } from "@/app/actions/addMaterials"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Tag, Truck, Layers, Box, CheckCircle, AlertCircle } from "lucide-react"

// Definisi Tipe Props
type Props = {
  suppliers: { id: string; name: string }[]
  storages: { id: string; name: string; type: string }[]
}

export default function AddProductForm({ suppliers, storages }: Props) {
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null)
  const [loading, setLoading] = useState(false)
  
  // Ref untuk mereset form
  const formRef = useRef<HTMLFormElement>(null)
  // Key untuk memaksa re-render komponen Select agar kembali ke default
  const [resetKey, setResetKey] = useState(0)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setStatus(null)

    const result = await addMaterial(formData)

    if (result.success) {
      // 1. Tampilkan Pesan Sukses
      setStatus({ success: true, message: result.message })
      
      // 2. Reset Form HTML (Input text/number)
      formRef.current?.reset()
      
      // 3. Reset Komponen Select (Shadcn) dengan mengganti Key
      setResetKey(prev => prev + 1)
    } else {
      setStatus({ success: false, message: result.message })
    }

    setLoading(false)
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-8">
      
      {/* --- PESAN STATUS (Alert Biasa) --- */}
      {status && (
        <div className={`p-4 rounded-lg flex items-center gap-3 ${
          status.success ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {status.success ? <CheckCircle className="w-5 h-5"/> : <AlertCircle className="w-5 h-5"/>}
          <p className="font-medium">{status.message}</p>
        </div>
      )}

      {/* SECTION 1: IDENTITAS PRODUK */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b pb-2 mb-4">
          <Tag className="w-4 h-4 text-blue-500" /> Identitas Produk
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Nama Barang <span className="text-red-500">*</span></Label>
            <Input name="name" placeholder="Contoh: Terigu Segitiga Biru" required />
          </div>

          <div className="space-y-2">
            <Label>Kategori Bahan <span className="text-red-500">*</span></Label>
            {/* Key digunakan agar dropdown kereset saat sukses */}
            <Select key={`cat-${resetKey}`} name="category" required>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BAHAN_BAKU">Bahan Baku Utama</SelectItem>
                <SelectItem value="BAHAN_PENOLONG">Bahan Penolong</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* SECTION 2: LOGISTIK */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b pb-2 mb-4">
          <Truck className="w-4 h-4 text-blue-500" /> Logistik & Penyimpanan
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Supplier <span className="text-red-500">*</span></Label>
            <Select key={`sup-${resetKey}`} name="supplierId" required>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Supplier..." />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Lokasi Penyimpanan <span className="text-red-500">*</span></Label>
            <Select key={`stg-${resetKey}`} name="storageId" required>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Gudang..." />
              </SelectTrigger>
              <SelectContent>
                {storages.map((stg) => (
                  <SelectItem key={stg.id} value={stg.id}>
                    {stg.name} ({stg.type.replace('_', ' ')})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* SECTION 3: HARGA & STOK */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b pb-2 mb-4">
          <Layers className="w-4 h-4 text-blue-500" /> Inventaris & Harga
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label>Satuan Unit <span className="text-red-500">*</span></Label>
            <Select key={`unit-${resetKey}`} name="unit" required>
              <SelectTrigger>
                <SelectValue placeholder="Satuan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Kg">Kg (Kilogram)</SelectItem>
                <SelectItem value="Roll">Roll</SelectItem>
                <SelectItem value="Pcs">Pcs (Pieces)</SelectItem>
                <SelectItem value="Liter">Liter</SelectItem>
                <SelectItem value="Zak">Zak</SelectItem>
                <SelectItem value="Box">Box</SelectItem>
                <SelectItem value="Kaleng">Kaleng</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Harga Beli per Unit <span className="text-red-500">*</span></Label>
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 px-3 bg-slate-100 border-r border-slate-200 flex items-center justify-center rounded-l-md text-slate-500 text-sm font-medium">Rp</div>
              <Input type="number" name="pricePerUnit" placeholder="0" className="pl-12" required min="0" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Stok Awal <span className="text-red-500">*</span></Label>
            <div className="relative">
              <Input type="number" name="stock" placeholder="0" className="pr-10" required min="0" step="0.01" />
              <div className="absolute right-3 top-2.5 text-slate-400">
                <Box className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TOMBOL AKSI */}
      <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
        <Button 
          type="submit" 
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 px-8 py-2 shadow-lg shadow-blue-200 transition-all active:scale-95"
        >
          {loading ? "Menyimpan..." : <><Save className="w-4 h-4 mr-2" /> Simpan Produk</>}
        </Button>
      </div>
    </form>
  )
}
'use client'

import { useState, useRef } from "react"
import { addMaterial } from "@/app/actions/addMaterials"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, CheckCircle, AlertCircle, Percent, Package2 } from "lucide-react"

type Props = {
  suppliers: { id: string; name: string }[]
  storages: { id: string; name: string; type: string }[]
}

export default function AddProductForm({ suppliers, storages }: Props) {
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null)
  const [loading, setLoading] = useState(false)
  
  const formRef = useRef<HTMLFormElement>(null)
  const [resetKey, setResetKey] = useState(0)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setStatus(null)
    const result = await addMaterial(formData)

    if (result.success) {
      setStatus({ success: true, message: result.message })
      formRef.current?.reset()
      setResetKey(prev => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      setStatus({ success: false, message: result.message })
    }
    setLoading(false)
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-6">
      
      {/* Notifikasi */}
      {status && (
        <div className={`px-4 py-3 rounded-md flex items-center gap-3 text-sm font-medium ${
          status.success ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {status.success ? <CheckCircle className="w-4 h-4"/> : <AlertCircle className="w-4 h-4"/>}
          {status.message}
        </div>
      )}

      {/* Main Container */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* KOLOM 1: IDENTITAS */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2 border-b pb-2">
              <span className="w-1.5 h-4 bg-blue-500 rounded-full"></span>
              Identitas Produk
            </h3>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs text-slate-500 font-semibold uppercase">Nama Barang <span className="text-red-500">*</span></Label>
                <Input name="name" placeholder="Nama Bahan..." required className="bg-slate-50/50" />
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-slate-500 font-semibold uppercase">Kategori <span className="text-red-500">*</span></Label>
                <Select key={`cat-${resetKey}`} name="category" required>
                  <SelectTrigger className="bg-slate-50/50">
                    <SelectValue placeholder="Pilih..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BAHAN_BAKU">Bahan Baku</SelectItem>
                    <SelectItem value="BAHAN_PENOLONG">Bahan Penolong</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-slate-500 font-semibold uppercase">Satuan <span className="text-red-500">*</span></Label>
                <Select key={`unit-${resetKey}`} name="unit" required>
                  <SelectTrigger className="bg-slate-50/50">
                    <SelectValue placeholder="Pilih Satuan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Kg">Kg</SelectItem>
                    <SelectItem value="Liter">Liter</SelectItem>
                    <SelectItem value="Pcs">Pcs</SelectItem>
                    <SelectItem value="Roll">Roll</SelectItem>
                    <SelectItem value="Zak">Zak</SelectItem>
                    <SelectItem value="Box">Box</SelectItem>
                    <SelectItem value="Kaleng">Kaleng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* KOLOM 2: LOGISTIK */}
          <div className="space-y-4 border-t pt-4 lg:border-t-0 lg:pt-0 lg:border-l lg:pl-8 border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2 border-b pb-2">
              <span className="w-1.5 h-4 bg-orange-500 rounded-full"></span>
              Logistik & Gudang
            </h3>

            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs text-slate-500 font-semibold uppercase">Supplier <span className="text-red-500">*</span></Label>
                <Select key={`sup-${resetKey}`} name="supplierId" required>
                  <SelectTrigger className="bg-slate-50/50">
                    <SelectValue placeholder="Pilih Supplier..." />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-slate-500 font-semibold uppercase">Lokasi Gudang <span className="text-red-500">*</span></Label>
                <Select key={`stg-${resetKey}`} name="storageId" required>
                  <SelectTrigger className="bg-slate-50/50">
                    <SelectValue placeholder="Pilih Gudang..." />
                  </SelectTrigger>
                  <SelectContent>
                    {storages.map((stg) => (
                      <SelectItem key={stg.id} value={stg.id}>{stg.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-slate-500 font-semibold uppercase">Beban Gudang (%) <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Input type="number" name="storagePercentage" placeholder="10" className="pr-8 bg-slate-50/50" required min="0.01" max="100" step="0.01" />
                  <Percent className="w-3.5 h-3.5 absolute right-3 top-2.5 text-slate-400" />
                </div>
              </div>
            </div>
          </div>

          {/* KOLOM 3: NILAI */}
          <div className="space-y-4 border-t pt-4 lg:border-t-0 lg:pt-0 lg:border-l lg:pl-8 border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2 border-b pb-2">
              <span className="w-1.5 h-4 bg-emerald-500 rounded-full"></span>
              Nilai & Stok
            </h3>

            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs text-slate-500 font-semibold uppercase">Harga Beli / Unit <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">Rp</span>
                  <Input type="number" name="pricePerUnit" placeholder="0" className="pl-8 bg-slate-50/50" required min="0" />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-slate-500 font-semibold uppercase">Stok Awal <span className="text-red-500">*</span></Label>
                <Input type="number" name="stock" placeholder="0" className="bg-slate-50/50" required min="0" step="0.01" />
              </div>

              {/* Spacer agar tombol rata bawah */}
              <div className="hidden lg:block h-6"></div>
              
              <Button type="submit" disabled={loading} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium">
                {loading ? "Menyimpan..." : <div className="flex items-center gap-2"><Save className="w-4 h-4"/> Simpan Data</div>}
              </Button>
            </div>
          </div>

        </div>
        
        {/* Tombol Mobile Only */}
        <div className="mt-6 pt-4 border-t lg:hidden">
            <Button type="submit" disabled={loading} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium h-12 text-lg">
                {loading ? "Menyimpan..." : "Simpan Produk Baru"}
            </Button>
        </div>

      </div>
    </form>
  )
}
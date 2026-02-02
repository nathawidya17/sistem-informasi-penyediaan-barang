'use client'

import { useState, useRef } from "react"
import { addOrdering } from "@/app/actions/addOrder"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, CheckCircle, AlertCircle, Banknote, Repeat } from "lucide-react"

type Props = {
  materials: { id: string; name: string }[]
  suppliers: { id: string; name: string }[]
}

export default function AddOrderingForm({ materials, suppliers }: Props) {
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const [resetKey, setResetKey] = useState(0)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setStatus(null)

    const result = await addOrdering(formData)

    if (result.success) {
      setStatus({ success: true, message: result.message })
      formRef.current?.reset()
      setResetKey(prev => prev + 1)
    } else {
      setStatus({ success: false, message: result.message })
    }
    setLoading(false)
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-6">
      
      {status && (
        <div className={`p-4 rounded-lg flex items-center gap-3 ${
          status.success ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {status.success ? <CheckCircle className="w-5 h-5"/> : <AlertCircle className="w-5 h-5"/>}
          <p className="font-medium">{status.message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* MATERIAL */}
        <div className="space-y-2">
          <Label>Nama Bahan <span className="text-red-500">*</span></Label>
          <Select key={`mat-${resetKey}`} name="materialId" required>
            <SelectTrigger>
              <SelectValue placeholder="Pilih Bahan..." />
            </SelectTrigger>
            <SelectContent>
              {materials.map((m) => (
                <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* SUPPLIER */}
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
      </div>

      {/* PERIODE */}
      <div className="space-y-2">
        <Label>Periode Data <span className="text-red-500">*</span></Label>
        <Input name="period" placeholder="Contoh: Januari - Juni 2025" required />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* TOTAL QTY */}
        <div className="space-y-2">
          <Label>Total Jumlah (Qty)</Label>
          <Input type="number" name="amount" placeholder="0" min="0" step="0.01" required />
          <p className="text-[10px] text-slate-500">Total fisik barang (Kg/Pcs)</p>
        </div>

        {/* TOTAL NOMINAL (PENTING UNTUK S) */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            Total Nominal (Rp) <Banknote className="w-3 h-3 text-green-600"/>
          </Label>
          <Input type="number" name="price" placeholder="0" min="0" required className="border-green-200 focus:ring-green-500" />
          <p className="text-[10px] text-slate-500">Total uang yg dikeluarkan</p>
        </div>

        {/* FREKUENSI (PENTING UNTUK S) */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            Frekuensi Order <Repeat className="w-3 h-3 text-blue-600"/>
          </Label>
          <Input type="number" name="frequency" placeholder="0" min="1" required className="border-blue-200 focus:ring-blue-500" />
          <p className="text-[10px] text-slate-500">Berapa kali beli</p>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto">
          {loading ? "Menyimpan..." : "Simpan Data Ordering"}
        </Button>
      </div>
    </form>
  )
}
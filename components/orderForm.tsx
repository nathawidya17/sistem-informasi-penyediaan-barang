    'use client'

import { useState, useRef } from "react"
import { addOrder } from "@/app/actions/addOrder"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingCart, CheckCircle, AlertCircle, Calendar, Coins, Scale } from "lucide-react"

type Props = {
  materials: { id: string; name: string; unit: string; supplier: { name: string } | null }[]
}

export default function OrderForm({ materials }: Props) {
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const [resetKey, setResetKey] = useState(0)

  // State untuk kalkulasi estimasi harga (opsional, visual saja)
  const [selectedMat, setSelectedMat] = useState<string>("")

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setStatus(null)

    const result = await addOrder(formData)

    if (result.success) {
      setStatus({ success: true, message: result.message })
      formRef.current?.reset()
      setResetKey(prev => prev + 1) // Reset dropdown
      setSelectedMat("")
    } else {
      setStatus({ success: false, message: result.message })
    }
    setLoading(false)
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-6">
      
      {/* Notifikasi */}
      {status && (
        <div className={`p-4 rounded-lg flex items-center gap-3 ${
          status.success ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {status.success ? <CheckCircle className="w-5 h-5"/> : <AlertCircle className="w-5 h-5"/>}
          <p className="font-medium">{status.message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 1. Belanja Apa (Material) */}
        <div className="space-y-2 md:col-span-2">
          <Label className="font-semibold flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-blue-600" /> Belanja Apa?
          </Label>
          <Select 
            key={resetKey} 
            name="materialId" 
            required 
            onValueChange={(val) => setSelectedMat(val)}
          >
            <SelectTrigger className="h-12 bg-white">
              <SelectValue placeholder="Pilih Barang..." />
            </SelectTrigger>
            <SelectContent>
              {materials.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.name} {m.supplier ? `— (${m.supplier.name})` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 2. Tanggal Transaksi */}
        <div className="space-y-2">
          <Label className="font-semibold flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" /> Tanggal Pembelian
          </Label>
          <Input 
            type="date" 
            name="date" 
            required 
            defaultValue={new Date().toISOString().split('T')[0]} 
            className="bg-white"
          />
        </div>

        {/* 3. Total nya Berapa (Quantity) */}
        <div className="space-y-2">
          <Label className="font-semibold flex items-center gap-2">
            <Scale className="w-4 h-4 text-blue-600" /> Jumlah (Total)
          </Label>
          <div className="relative">
            <Input 
              type="number" 
              name="amount" 
              placeholder="0" 
              className="pr-12 bg-white" 
              step="0.01" 
              required 
            />
            <div className="absolute right-3 top-2.5 text-slate-400 text-sm font-medium">
              {materials.find(m => m.id === selectedMat)?.unit || "Unit"}
            </div>
          </div>
        </div>

        {/* 4. Harganya Berapa (Total Rupiah) */}
        <div className="space-y-2 md:col-span-2">
          <Label className="font-semibold flex items-center gap-2">
            <Coins className="w-4 h-4 text-blue-600" /> Total Harga Pembelian
          </Label>
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 px-4 bg-slate-100 border-r border-slate-200 flex items-center justify-center rounded-l-md text-slate-600 font-bold">
              Rp
            </div>
            <Input 
              type="number" 
              name="price" 
              placeholder="Contoh: 1500000" 
              className="pl-16 h-12 text-lg font-medium bg-white" 
              required 
            />
          </div>
          <p className="text-xs text-slate-500">Masukkan total uang yang dikeluarkan untuk belanja ini.</p>
        </div>

      </div>

      <div className="pt-4">
        <Button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg shadow-lg"
        >
          {loading ? "Menyimpan..." : "Simpan Pesanan"}
        </Button>
      </div>
    </form>
  )
}
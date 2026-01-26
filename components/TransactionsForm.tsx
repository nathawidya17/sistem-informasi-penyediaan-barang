'use client'

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateStockAction } from "@/app/actions/updateStockAction"
import { Loader2 } from "lucide-react"

type Material = {
  id: string
  name: string
  unit: string
  stock: number
}

export default function TransactionForm({ materials }: { materials: Material[] }) {
  // Kita pakai REF untuk menyimpan ID. 
  // Ref tidak memicu render ulang, jadi UI tidak akan "berkedip" atau macet.
  const selectedIdRef = useRef<string>("")
  
  // State hanya untuk visual (Satuan & Loading)
  const [displaySatuan, setDisplaySatuan] = useState("-") 
  const [type, setType] = useState("IN") 
  const [isLoading, setIsLoading] = useState(false)

  // Saat dropdown native dipilih
  const handleMaterialChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value
    
    // 1. Simpan ke Ref (Data Asli)
    selectedIdRef.current = newId
    
    // 2. Update Visual Satuan (Label)
    const selected = materials.find((m) => m.id === newId)
    if (selected) {
      setDisplaySatuan(selected.unit || "-") 
    }
  }

  const handleSubmit = async (formData: FormData) => {
      // Validasi: Cek apakah Ref sudah terisi?
      if (!selectedIdRef.current) {
        alert("⚠️ Harap pilih Nama Barang terlebih dahulu!")
        return
      }

      setIsLoading(true)
      try {
        // PENTING: Kita injek paksa ID dari Ref ke dalam FormData
        // Ini menjamin data terkirim meskipun HTML-nya error/kosong
        formData.set("materialId", selectedIdRef.current)
        
        console.log("Mengirim ID:", selectedIdRef.current) // Cek console untuk debug
        
        await updateStockAction(formData)
        
        alert("✅ Transaksi Berhasil Disimpan!")
        window.location.reload()
      } catch (error) {
        console.error(error)
        alert("❌ Gagal menyimpan transaksi. Cek console.")
        setIsLoading(false)
      }
  }

  return (
    <Card className="border-l-4 border-blue-600 shadow-sm mb-8">
      <CardHeader>
        <CardTitle>Form Input Transaksi</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
          
          {/* === 1. DROPDOWN (NATIVE + UNCONTROLLED) === */}
          <div className="space-y-2 lg:col-span-1">
            <Label>Nama Barang</Label>
            
            <select
              // Hapus attribute 'value' agar React tidak ikut campur (Anti-Macet)
              // Hapus attribute 'name' agar kita handle manual via Ref
              defaultValue="" 
              onChange={handleMaterialChange}
              className="flex h-10 w-full items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
            >
              <option value="" disabled>-- Klik Disini Untuk Pilih --</option>
              
              {materials.length === 0 ? (
                <option disabled>Data Kosong</option>
              ) : (
                materials.map((m) => (
                   <option key={m.id} value={m.id}>
                     {m.name}
                   </option>
                ))
              )}
            </select>
          </div>

          {/* === 2. JENIS TRANSAKSI === */}
          <div className="space-y-2">
            <Label>Jenis Transaksi</Label>
            <select
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="flex h-10 w-full items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
            >
              <option value="IN">Barang Masuk (IN)</option>
              <option value="OUT">Barang Keluar (OUT)</option>
            </select>
          </div>

          {/* 3. TANGGAL */}
          <div className="space-y-2">
            <Label>{type === 'IN' ? 'Tanggal Masuk' : 'Tanggal Keluar'}</Label>
            <Input type="date" name="date" required className="block cursor-pointer" />
          </div>

          {/* 4. JUMLAH */}
          <div className="space-y-2">
            <Label>Jumlah</Label>
            <div className="relative">
              <Input 
                type="number" 
                name="quantity" 
                placeholder="0" 
                min="0.01" 
                step="0.01" 
                required 
                className="pr-16 font-bold" 
              />
              <div className="absolute right-3 top-0 h-full flex items-center">
                 <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded text-slate-600 border">
                    {displaySatuan}
                 </span>
              </div>
            </div>
          </div>

          {/* TOMBOL */}
          <div className="lg:col-span-4 flex justify-end">
             <Button type="submit" disabled={isLoading} className="bg-blue-600 w-full md:w-auto hover:bg-blue-700">
               {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
               Simpan Transaksi
             </Button>
          </div>
          
        </form>
      </CardContent>
    </Card>
  )
}
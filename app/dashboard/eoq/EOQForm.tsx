'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Calculator, CalendarDays, RefreshCcw, ShoppingCart, HelpCircle } from "lucide-react"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

export default function EOQForm({ materials }: { materials: any[] }) {
  const [selectedId, setSelectedId] = useState<string>("")
  const [kebutuhan, setKebutuhan] = useState<string>("") 

  if (!materials || materials.length === 0) {
    return <div className="text-red-500">Data bahan baku kosong.</div>
  }

  const selectedMaterial = materials.find((m: any) => m.id === selectedId)

  // Variabel Rumus
  const R = parseFloat(kebutuhan) || 0 
  const S = selectedMaterial?.orderingCost || 0 
  const P = selectedMaterial?.pricePerUnit || 0 
  const I = selectedMaterial?.holdingCost || 0 

  // 1. Hitung EOQ
  const penyebut = P * I
  const eoqValue = penyebut > 0 ? Math.sqrt((2 * R * S) / penyebut) : 0

  // 2. Hitung Frekuensi
  const frekuensi = eoqValue > 0 ? R / eoqValue : 0

  // 3. Hitung Interval (Hari)
  const intervalHari = frekuensi > 0 ? (365 / frekuensi).toFixed(0) : 0

  // 4. LOGIKA BARU: Hitung Pemakaian Harian untuk Penjelasan
  const pemakaianHarian = R > 0 ? R / 365 : 0

  return (
    <div className="space-y-8">
      
      {/* BAGIAN 1: INPUT */}
      <Card className="border-t-4 border-blue-600 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-600"/> 
            Input Parameter
          </CardTitle>
          <CardDescription>Masukkan target kebutuhan periode ini.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Pilih Bahan Baku</Label>
            <Select onValueChange={setSelectedId}>
              <SelectTrigger>
                <SelectValue placeholder="-- Klik untuk memilih --" />
              </SelectTrigger>
              <SelectContent>
                {materials.map((m: any) => (
                  <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Total Kebutuhan (R)</Label>
            <Input 
              type="number" 
              placeholder="Contoh: 165750" 
              value={kebutuhan}
              onChange={(e) => setKebutuhan(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* BAGIAN 2: HASIL */}
      {eoqValue > 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          <div className="grid gap-4 md:grid-cols-3">
            {/* KOTAK 1: EOQ */}
            <Card className="bg-blue-50 border-blue-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-blue-800 flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4"/> Rekomendasi Order (EOQ)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-700">
                  {eoqValue.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                  <span className="text-sm font-normal text-blue-600 ml-1">{selectedMaterial?.unit}</span>
                </div>
                <p className="text-xs text-blue-600 mt-1">Jumlah paling hemat untuk dibeli.</p>
              </CardContent>
            </Card>

            {/* KOTAK 2: FREKUENSI */}
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                  <RefreshCcw className="w-4 h-4"/> Frekuensi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-800">
                  {frekuensi.toLocaleString('id-ID', { maximumFractionDigits: 1 })}x
                </div>
                <p className="text-xs text-slate-500 mt-1">Pemesanan dalam satu tahun.</p>
              </CardContent>
            </Card>

            {/* KOTAK 3: JADWAL (HARI) */}
            <Card className="bg-amber-50 border-amber-200 shadow-sm relative overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-amber-800 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4"/> Interval Jadwal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-700">
                  {intervalHari}
                  <span className="text-sm font-normal text-amber-600 ml-1">Hari</span>
                </div>
                <p className="text-xs text-amber-600 mt-1">Jarak antar pembelian.</p>
              </CardContent>
            </Card>
          </div>

          {/* BAGIAN 3: PENJELASAN LOGIS (INI YANG BARU) */}
          <Card className="bg-slate-50 border-dashed border-2 border-slate-300">
            <CardContent className="pt-6">
              <h4 className="font-semibold flex items-center gap-2 text-slate-800 mb-3">
                <HelpCircle className="w-5 h-5 text-blue-500" />
                Analisa Detail: Mengapa setiap {intervalHari} Hari?
              </h4>
              
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="bg-white p-3 rounded border">
                  <span className="text-slate-500 block mb-1">Rata-rata Pemakaian Harian:</span>
                  <div className="font-mono text-slate-800">
                     {kebutuhan} / 365 hari = <span className="font-bold text-blue-600">{pemakaianHarian.toLocaleString('id-ID', {maximumFractionDigits: 1})} {selectedMaterial?.unit}/hari</span>
                  </div>
                </div>

                <div className="bg-white p-3 rounded border">
                   <span className="text-slate-500 block mb-1">Ketahanan Stok:</span>
                   <div className="font-mono text-slate-800">
                      EOQ {eoqValue.toLocaleString('id-ID', {maximumFractionDigits: 0})} / {pemakaianHarian.toLocaleString('id-ID', {maximumFractionDigits: 1})} = <span className="font-bold text-amber-600">{intervalHari} Hari</span>
                   </div>
                </div>
              </div>

              <p className="text-slate-600 text-sm mt-4 leading-relaxed">
                💡 <b>Artinya:</b> Jika Anda membeli <b>{eoqValue.toLocaleString('id-ID', {maximumFractionDigits: 0})} {selectedMaterial?.unit}</b> (sesuai saran EOQ), stok tersebut secara matematis akan <b>HABIS TOTAL</b> dalam waktu <b>{intervalHari} hari</b> berdasarkan rata-rata pemakaian harian produksi Anda. Maka, pembelian ulang wajib dilakukan tepat pada siklus tersebut.
              </p>
            </CardContent>
          </Card>

        </div>
      )}
    </div>
  )
}
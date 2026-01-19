'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calculator, RefreshCw, ArrowRightCircle } from "lucide-react"
import { getMaterials } from "@/app/actions/getMaterials" 

export default function EOQCalculator() {
  const [materials, setMaterials] = useState<any[]>([])
  const [loadingData, setLoadingData] = useState(true)

  // State Input
  const [selectedMaterialId, setSelectedMaterialId] = useState("") 
  const [namaBarang, setNamaBarang] = useState("")
  const [demand, setDemand] = useState<any>("")      
  const [biayaPesan, setBiayaPesan] = useState<any>("") // S
  const [biayaSimpan, setBiayaSimpan] = useState<any>("") // H
  
  // State Khusus Excel
  const [freqAktual, setFreqAktual] = useState<any>("") 
  const [totalSimpanAktual, setTotalSimpanAktual] = useState<any>("") 

  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    async function loadMaterials() {
      try {
        const data = await getMaterials()
        setMaterials(data)
      } catch (e) { console.error(e) } finally { setLoadingData(false) }
    }
    loadMaterials()
  }, [])

  // Auto-Fill Data
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value
    setSelectedMaterialId(id)
    const item = materials.find(m => m.id === id)

    if (item) {
      setNamaBarang(item.name)
      // Isi Parameter Rumus
      setBiayaPesan(item.eoqBiayaPesan || 0)
      setBiayaSimpan(item.eoqBiayaSimpan || 0)
      // Isi Data Aktual 
      setFreqAktual(item.exFreq || 0) 
      setTotalSimpanAktual(item.exHoldCost || 0) 
      setDemand("") 
    } else {
      setNamaBarang(""); setBiayaPesan(""); setBiayaSimpan("");
      setFreqAktual(""); setTotalSimpanAktual(""); setDemand("");
    }
  }

  const hitungEOQ = () => {
    const D = parseFloat(demand)
    const S = parseFloat(biayaPesan)
    const H = parseFloat(biayaSimpan)
    const F_act = parseFloat(freqAktual)
    const HoldCost_Actual_Input = parseFloat(totalSimpanAktual)

    if (isNaN(D) || isNaN(S) || isNaN(H) || isNaN(F_act)) {
      alert("Mohon lengkapi semua data input!")
      return
    }

    // ====================================================
    // 1. HITUNG AKTUAL 
    // ====================================================
    
    const Q_act = D 

    const OrderCost_act = F_act * S 
    
    const HoldCost_act = !isNaN(HoldCost_Actual_Input) && HoldCost_Actual_Input > 0 
      ? HoldCost_Actual_Input 
      : (D / F_act / 2) * H // Fallback rumus kalau input kosong

    const Total_act = OrderCost_act + HoldCost_act

    // ====================================================
    // 2. HITUNG EOQ 
    // ====================================================
    let Q_eoq = 0
    if (H > 0) Q_eoq = Math.sqrt((2 * D * S) / H)
    
    const F_eoq = Q_eoq > 0 ? D / Q_eoq : 0
    const OrderCost_eoq = F_eoq * S
    const HoldCost_eoq = (Q_eoq / 2) * H
    const Total_eoq = OrderCost_eoq + HoldCost_eoq

    setResult({
      nama: namaBarang || "Custom Product",
      actual: { Q: Q_act, freq: F_act, orderCost: OrderCost_act, holdCost: HoldCost_act, total: Total_act },
      eoq: { Q: Q_eoq, freq: F_eoq, orderCost: OrderCost_eoq, holdCost: HoldCost_eoq, total: Total_eoq },
      savings: Total_act - Total_eoq
    })
  }

  const resetForm = () => {
    setSelectedMaterialId(""); setNamaBarang(""); setDemand("");
    setBiayaPesan(""); setBiayaSimpan(""); setFreqAktual(""); 
    setTotalSimpanAktual(""); setResult(null);
  }

  return (
    <div className="space-y-8">
      <Card className="border-t-4 border-blue-600 shadow-lg bg-slate-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Calculator className="w-5 h-5"/> Input Data Simulasi
          </CardTitle>
          <CardDescription>
            Pilih bahan baku untuk mengisi data otomatis sesuai Database Excel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* KIRI */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="font-bold text-blue-700">1. Pilih Bahan Baku</Label>
                <select className="w-full h-10 rounded-md border px-3 bg-white" value={selectedMaterialId} onChange={handleSelectChange}>
                  <option value="">-- Pilih Barang --</option>
                  {materials.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Total Permintaan (Kg)</Label>
                <Input type="number" value={demand} onChange={(e)=>setDemand(e.target.value)} className="bg-white" placeholder="Contoh: 982225"/>
              </div>
              <div className="space-y-2 p-3 bg-red-50 border border-red-200 rounded">
                <Label className="text-red-800 font-bold text-xs">Biaya Simpan Aktual (Fixed Cost)</Label>
                <Input type="number" value={totalSimpanAktual} onChange={(e)=>setTotalSimpanAktual(e.target.value)} className="bg-white border-red-200 text-red-900"/>
              </div>
            </div>

            {/* KANAN */}
            <div className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-xs">Biaya Pesan (S)</Label><Input type="number" value={biayaPesan} onChange={(e)=>setBiayaPesan(e.target.value)} className="bg-slate-100"/></div>
                <div><Label className="text-xs">Biaya Simpan/Unit (H)</Label><Input type="number" value={biayaSimpan} onChange={(e)=>setBiayaSimpan(e.target.value)} className="bg-slate-100"/></div>
              </div>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                <Label className="text-yellow-800 font-bold flex gap-2"><ArrowRightCircle className="w-4 h-4"/> Frekuensi Aktual</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Input type="number" value={freqAktual} onChange={(e)=>setFreqAktual(e.target.value)} className="bg-white text-center font-bold"/>
                  <span className="text-xs">Kali</span>
                </div>
              </div>
            </div>
          </div>
          <Button onClick={hitungEOQ} className="w-full mt-6 bg-blue-700 hover:bg-blue-800 h-12 text-lg">HITUNG HASIL</Button>
        </CardContent>
      </Card>

      {/* HASIL */}
      {result && (
        <Card className="border-0 shadow-2xl">
          <CardHeader className="bg-slate-900 text-white py-4"><CardTitle className="text-center text-lg">Hasil Analisis: {result.nama}</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-100">
                  <TableHead className="w-[30%] pl-6">Keterangan</TableHead>
                  <TableHead className="text-center text-red-700 font-bold">Perusahaan (Aktual)</TableHead>
                  <TableHead className="text-center text-emerald-700 font-bold">Metode EOQ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                
                {/* 1. JUMLAH PEMESANAN (Sekarang Qty Aktual = Demand) */}
                <TableRow>
                  <TableCell className="pl-6 font-medium">Jumlah Pemesanan (Kg)</TableCell>
                  <TableCell className="text-center font-mono">{result.actual.Q.toLocaleString('id-ID', {maximumFractionDigits:0})}</TableCell>
                  <TableCell className="text-center font-mono font-bold text-emerald-700">{result.eoq.Q.toLocaleString('id-ID', {maximumFractionDigits:0})}</TableCell>
                </TableRow>

                {/* 2. BIAYA PEMESANAN */}
                <TableRow>
                  <TableCell className="pl-6 font-medium">Biaya Pemesanan (Rp)</TableCell>
                  <TableCell className="text-center font-mono">Rp {result.actual.orderCost.toLocaleString('id-ID', {maximumFractionDigits:0})}</TableCell>
                  <TableCell className="text-center font-mono text-emerald-700">Rp {result.eoq.orderCost.toLocaleString('id-ID', {maximumFractionDigits:0})}</TableCell>
                </TableRow>

                {/* 3. BIAYA PENYIMPANAN */}
                <TableRow>
                  <TableCell className="pl-6 font-medium">Biaya Penyimpanan (Rp)</TableCell>
                  <TableCell className="text-center font-mono font-bold text-red-600 bg-red-50">Rp {result.actual.holdCost.toLocaleString('id-ID', {maximumFractionDigits:0})}</TableCell>
                  <TableCell className="text-center font-mono text-emerald-700">Rp {result.eoq.holdCost.toLocaleString('id-ID', {maximumFractionDigits:0})}</TableCell>
                </TableRow>

                {/* 4. FREKUENSI */}
                <TableRow>
                  <TableCell className="pl-6 font-medium">Frekuensi Pembelian</TableCell>
                  <TableCell className="text-center font-bold">{result.actual.freq}</TableCell>
                  <TableCell className="text-center font-bold text-emerald-700">{result.eoq.freq.toFixed(2)}</TableCell>
                </TableRow>

                {/* 5. TOTAL */}
                <TableRow className="bg-slate-50 border-t-2">
                  <TableCell className="pl-6 font-bold">Total Biaya Persediaan</TableCell>
                  <TableCell className="text-center font-bold text-lg">Rp {result.actual.total.toLocaleString('id-ID', {maximumFractionDigits:0})}</TableCell>
                  <TableCell className="text-center font-bold text-lg text-emerald-700">Rp {result.eoq.total.toLocaleString('id-ID', {maximumFractionDigits:0})}</TableCell>
                </TableRow>
                
                {/* 6. PENGHEMATAN */}
                <TableRow className="bg-blue-600 text-white">
                   <TableCell className="pl-6 font-bold py-4">PENGHEMATAN</TableCell>
                   <TableCell colSpan={2} className="text-center font-bold text-2xl py-4 text-yellow-300 font-mono">Rp {result.savings.toLocaleString('id-ID', {maximumFractionDigits:0})}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
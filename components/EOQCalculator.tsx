'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calculator, RefreshCw, Loader2, ArrowRightCircle } from "lucide-react"
import { getMaterials } from "@/app/actions/getMaterials" 

export default function EOQCalculator() {
  // --- STATE DATA DATABASE ---
  const [materials, setMaterials] = useState<any[]>([])
  const [loadingData, setLoadingData] = useState(true)

  // --- STATE INPUT ---
  const [selectedMaterialId, setSelectedMaterialId] = useState("") 
  const [namaBarang, setNamaBarang] = useState("")
  const [demand, setDemand] = useState<any>("")      
  const [biayaPesan, setBiayaPesan] = useState<any>("") 
  const [biayaSimpan, setBiayaSimpan] = useState<any>("") 
  const [freqAktual, setFreqAktual] = useState<any>("") 
  
  // State Hasil
  const [result, setResult] = useState<any>(null)

  // 1. AMBIL DATA BARANG SAAT LOAD
  useEffect(() => {
    async function loadMaterials() {
      try {
        const data = await getMaterials()
        setMaterials(data)
      } catch (e) {
        console.error("Gagal ambil data", e)
      } finally {
        setLoadingData(false)
      }
    }
    loadMaterials()
  }, [])

  // 2. FUNGSI SAAT DROPDOWN DIPILIH (AUTO-FILL)
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value
    setSelectedMaterialId(id)

    const selectedItem = materials.find(m => m.id === id)

    if (selectedItem) {
      setNamaBarang(selectedItem.name)
      // FIX ERROR DISINI: Gunakan || 0 agar tidak error jika data null
      setBiayaPesan(selectedItem.eoqBiayaPesan || 0)
      setBiayaSimpan(selectedItem.eoqBiayaSimpan || 0)
      
      setDemand("") 
      setFreqAktual("")
    } else {
      setNamaBarang("")
      setBiayaPesan("")
      setBiayaSimpan("")
    }
  }

  // 3. FUNGSI HITUNG (LOGIC UTAMA)
  const hitungEOQ = () => {
    const D = parseFloat(demand)
    const S = parseFloat(biayaPesan)
    const H = parseFloat(biayaSimpan)
    const F_act = parseFloat(freqAktual)

    if (isNaN(D) || isNaN(S) || isNaN(H) || isNaN(F_act)) {
      alert("Mohon isi semua angka (D, S, H, Freq) dengan benar!")
      return
    }

    // A. HITUNG KONDISI AKTUAL
    const Q_act = D / F_act 
    const OrderCost_act = F_act * S
    const HoldCost_act = (Q_act / 2) * H
    const Total_act = OrderCost_act + HoldCost_act

    // B. HITUNG KONDISI EOQ (OPTIMAL)
    // Rumus: Akar(2DS/H)
    let Q_eoq = 0
    if (H > 0) {
      Q_eoq = Math.sqrt((2 * D * S) / H)
    }
    
    const F_eoq = Q_eoq > 0 ? D / Q_eoq : 0
    const OrderCost_eoq = F_eoq * S
    const HoldCost_eoq = (Q_eoq / 2) * H
    const Total_eoq = OrderCost_eoq + HoldCost_eoq

    // C. PENGHEMATAN
    const Savings = Total_act - Total_eoq

    setResult({
      nama: namaBarang || "Custom Product",
      actual: { Q: Q_act, freq: F_act, orderCost: OrderCost_act, holdCost: HoldCost_act, total: Total_act },
      eoq: { Q: Q_eoq, freq: F_eoq, orderCost: OrderCost_eoq, holdCost: HoldCost_eoq, total: Total_eoq },
      savings: Savings
    })
  }

  const resetForm = () => {
    setSelectedMaterialId("")
    setNamaBarang("")
    setDemand("")
    setBiayaPesan("")
    setBiayaSimpan("")
    setFreqAktual("")
    setResult(null)
  }

  return (
    <div className="space-y-8">
      
      {/* --- FORM INPUT --- */}
      <Card className="border-t-4 border-blue-600 shadow-lg bg-slate-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-700"/> Input Data Simulasi
          </CardTitle>
          <CardDescription>
            Pilih bahan baku untuk mengisi otomatis parameter biaya (S & H), lalu masukkan jumlah permintaan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* KOLOM KIRI */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-blue-800 font-bold">Pilih Bahan Baku (Database)</Label>
                <select 
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={selectedMaterialId}
                  onChange={handleSelectChange}
                  disabled={loadingData}
                >
                  <option value="">-- Pilih Barang --</option>
                  {materials.map((m) => (
                    <option key={m.id} value={m.id}>
                      {/* FIX ERROR DISINI: Tambahkan || 0 sebelum .toLocaleString() */}
                      {m.name} (S: {(m.eoqBiayaPesan || 0).toLocaleString()} | H: {(m.eoqBiayaSimpan || 0).toLocaleString()})
                    </option>
                  ))}
                </select>
                {loadingData && <p className="text-xs text-slate-500">Memuat data...</p>}
              </div>

              <div className="space-y-2">
                <Label>Total Permintaan (Kg) / Periode</Label>
                <Input 
                  type="number" 
                  placeholder="Contoh: 982225" 
                  value={demand}
                  onChange={(e) => setDemand(e.target.value)}
                  className="bg-white border-blue-200 focus:border-blue-500"
                />
              </div>
            </div>

            {/* KOLOM KANAN */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Biaya Pesan (S)</Label>
                  <Input 
                    type="number" 
                    placeholder="Auto..." 
                    value={biayaPesan}
                    onChange={(e) => setBiayaPesan(e.target.value)}
                    className="bg-slate-100" 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Biaya Simpan (H)</Label>
                  <Input 
                    type="number" 
                    placeholder="Auto..." 
                    value={biayaSimpan}
                    onChange={(e) => setBiayaSimpan(e.target.value)}
                    className="bg-slate-100"
                  />
                </div>
              </div>
              
              <div className="space-y-2 p-4 bg-yellow-50 rounded-lg border border-yellow-200 shadow-sm">
                <Label className="text-yellow-800 font-bold flex items-center gap-2">
                  <ArrowRightCircle className="w-4 h-4"/> Frekuensi Aktual
                </Label>
                <div className="flex items-center gap-3 mt-2">
                   <Input 
                    type="number" 
                    placeholder="0" 
                    className="bg-white border-yellow-400 w-full text-lg font-bold text-center"
                    value={freqAktual}
                    onChange={(e) => setFreqAktual(e.target.value)}
                  />
                   <span className="text-sm text-yellow-900 font-medium whitespace-nowrap">Kali Pembelian</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-8 pt-4 border-t border-slate-200">
            <Button onClick={hitungEOQ} className="flex-1 bg-blue-700 hover:bg-blue-800 h-12 text-lg shadow-lg">
              <Calculator className="mr-2 h-5 w-5"/> HITUNG HASIL
            </Button>
            <Button onClick={resetForm} variant="outline" className="w-auto h-12 px-6">
              <RefreshCw className="mr-2 h-4 w-4"/> Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* --- HASIL TABEL OUTPUT --- */}
      {result && (
        <Card className="border-t-4 border-emerald-600 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader className="bg-emerald-50/50 pb-4">
             <CardTitle className="text-xl text-center text-emerald-900">
                Hasil Analisis: <span className="font-bold underline decoration-emerald-500/50">{result.nama}</span>
             </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-900 hover:bg-slate-900">
                  <TableHead className="text-white w-[30%] py-4 pl-6">Keterangan</TableHead>
                  <TableHead className="text-white text-center w-[35%] py-4 bg-white/10">Metode Perusahaan</TableHead>
                  <TableHead className="text-white text-center w-[35%] py-4 bg-emerald-600">Metode EOQ (Usulan)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                
                {/* 1. JUMLAH PEMESANAN */}
                <TableRow className="hover:bg-slate-50">
                  <TableCell className="font-medium pl-6">Jumlah Pemesanan (Kg)</TableCell>
                  <TableCell className="text-center font-mono text-lg text-slate-700">
                    {result.actual.Q.toLocaleString('id-ID', {maximumFractionDigits: 0})}
                  </TableCell>
                  <TableCell className="text-center font-mono text-lg text-emerald-700 font-bold bg-emerald-50">
                    {result.eoq.Q.toLocaleString('id-ID', {maximumFractionDigits: 0})}
                  </TableCell>
                </TableRow>

                {/* 2. BIAYA PEMESANAN */}
                <TableRow className="hover:bg-slate-50">
                  <TableCell className="font-medium pl-6">Biaya Pemesanan (Rp)</TableCell>
                  <TableCell className="text-center font-mono text-slate-700">
                    {result.actual.orderCost.toLocaleString('id-ID', {maximumFractionDigits: 0})}
                  </TableCell>
                  <TableCell className="text-center font-mono text-emerald-700 bg-emerald-50">
                    {result.eoq.orderCost.toLocaleString('id-ID', {maximumFractionDigits: 0})}
                  </TableCell>
                </TableRow>

                {/* 3. BIAYA PENYIMPANAN */}
                <TableRow className="hover:bg-slate-50">
                  <TableCell className="font-medium pl-6">Biaya Penyimpanan (Rp)</TableCell>
                  <TableCell className="text-center font-mono text-slate-700">
                    {result.actual.holdCost.toLocaleString('id-ID', {maximumFractionDigits: 0})}
                  </TableCell>
                  <TableCell className="text-center font-mono text-emerald-700 bg-emerald-50">
                    {result.eoq.holdCost.toLocaleString('id-ID', {maximumFractionDigits: 0})}
                  </TableCell>
                </TableRow>

                {/* 4. FREKUENSI */}
                <TableRow className="hover:bg-slate-50">
                  <TableCell className="font-medium pl-6">Frekuensi Pembelian (Kali)</TableCell>
                  <TableCell className="text-center font-bold text-slate-800">
                    {result.actual.freq}
                  </TableCell>
                  <TableCell className="text-center font-bold text-emerald-700 bg-emerald-50">
                    {result.eoq.freq.toFixed(2)}
                  </TableCell>
                </TableRow>

                {/* 5. TOTAL BIAYA */}
                <TableRow className="border-t-4 border-slate-100 bg-slate-50">
                  <TableCell className="font-bold text-lg pl-6 py-4">Total Biaya Persediaan</TableCell>
                  <TableCell className="text-center font-bold text-lg text-red-600 py-4">
                    Rp {result.actual.total.toLocaleString('id-ID', {maximumFractionDigits: 0})}
                  </TableCell>
                  <TableCell className="text-center font-bold text-lg text-emerald-700 bg-emerald-100 py-4 border-l-4 border-emerald-500">
                    Rp {result.eoq.total.toLocaleString('id-ID', {maximumFractionDigits: 0})}
                  </TableCell>
                </TableRow>

                {/* 6. PENGHEMATAN */}
                <TableRow className="bg-blue-600 hover:bg-blue-700">
                   <TableCell colSpan={2} className="text-right font-bold text-white py-6 pr-8 text-lg">
                      TOTAL PENGHEMATAN:
                   </TableCell>
                   <TableCell className="text-center font-bold text-2xl text-yellow-300 py-6 font-mono bg-blue-800">
                      Rp {result.savings.toLocaleString('id-ID', {maximumFractionDigits: 0})}
                   </TableCell>
                </TableRow>

              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

    </div>
  )
}
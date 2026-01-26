'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, Filter, RefreshCw, FileBarChart, Info } from "lucide-react"
import { getEOQAnalysis } from "@/app/actions/getEOQAnalys"

export default function EOQPage() {
  // --- STATE FILTER ---
  const [periodInput, setPeriodInput] = useState("") 
  const [category, setCategory] = useState("ALL")
  const [storageType, setStorageType] = useState("ALL")

  // --- STATE DATA ---
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false) // Penanda apakah sudah pernah klik cari

  // Helper: Ubah "2025-04" jadi "April"
  const getPeriodName = (ym: string) => {
    if (!ym) return undefined
    const date = new Date(`${ym}-01`)
    return date.toLocaleDateString('id-ID', { month: 'long' })
  }

  const getFullPeriodName = (ym: string) => {
    if (!ym) return undefined
    const date = new Date(`${ym}-01`)
    return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
  }

  // --- FUNGSI CARI DATA (Hanya jalan saat tombol diklik) ---
  const handleSearch = async () => {
    setLoading(true)
    setHasSearched(true) // Menandakan user sudah melakukan filter
    try {
      const result = await getEOQAnalysis({
        period: getPeriodName(periodInput), 
        category: category,
        storageType: storageType
      })
      setData(result)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  // --- RESET FILTER ---
  const handleReset = () => {
    setPeriodInput("")
    setCategory("ALL")
    setStorageType("ALL")
    setData([])
    setHasSearched(false) // Kembali ke status awal (kosong)
  }

  return (
    <div className="space-y-6 p-6">
      
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Analisis Optimalisasi EOQ</h2>
        <p className="text-muted-foreground">
          Sistem perhitungan otomatis D, S, dan H berdasarkan riwayat pesanan.
        </p>
      </div>

      {/* --- FORM INPUT FILTER --- */}
      <Card className="border-t-4 border-blue-600 bg-white shadow-sm">
        <CardHeader className="pb-3 bg-slate-50/50">
          <CardTitle className="text-base flex items-center gap-2 text-slate-800">
            <Filter className="w-4 h-4 text-blue-600"/> Form Filter Data
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid md:grid-cols-4 gap-4 items-end">
            
            {/* 1. INPUT PERIODE (BULAN & TAHUN) */}
            <div className="space-y-2">
              <Label className="font-semibold text-slate-700">1. Pilih Periode</Label>
              <Input 
                type="month" 
                className="bg-white border-slate-300 cursor-pointer focus:ring-blue-500"
                value={periodInput}
                onChange={(e) => setPeriodInput(e.target.value)}
              />
            </div>

            {/* 2. PILIH KATEGORI BAHAN */}
            <div className="space-y-2">
              <Label className="font-semibold text-slate-700">2. Kategori Bahan</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-white border-slate-300">
                  <SelectValue placeholder="Semua Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Semua Kategori</SelectItem>
                  <SelectItem value="BAHAN_BAKU">Bahan Baku</SelectItem>
                  <SelectItem value="BAHAN_PENOLONG">Bahan Penolong</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 3. PILIH JENIS PENYIMPANAN */}
            <div className="space-y-2">
              <Label className="font-semibold text-slate-700">3. Jenis Penyimpanan</Label>
              <Select value={storageType} onValueChange={setStorageType}>
                <SelectTrigger className="bg-white border-slate-300">
                  <SelectValue placeholder="Semua Gudang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Semua Gudang</SelectItem>
                  <SelectItem value="DRY_STORAGE">Dry Storage</SelectItem>
                  <SelectItem value="COLD_STORAGE">Cold Storage</SelectItem>
                  <SelectItem value="LIQUID_STORAGE">Liquid Storage</SelectItem>
                  <SelectItem value="CHEMICAL_STORAGE">Chemical Storage</SelectItem>
                  <SelectItem value="FROZEN_STORAGE">Frozen Storage</SelectItem>
                  <SelectItem value="GENERAL_STORAGE">General Storage</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* TOMBOL AKSI */}
            <div className="flex gap-2">
              <Button onClick={handleReset} variant="outline" size="icon" title="Reset Filter" className="border-slate-300">
                <RefreshCw className="w-4 h-4 text-slate-600"/>
              </Button>
              <Button 
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all active:scale-95" 
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2"/> : <Search className="w-4 h-4 mr-2"/>}
                Tampilkan Analisis
              </Button>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* --- TABEL HASIL --- */}
      <Card className="shadow-lg border-0 overflow-hidden">
        <CardHeader className="bg-slate-900 text-white py-4">
          <CardTitle className="text-base flex justify-between items-center">
            <span className="flex items-center gap-2"><FileBarChart className="h-4 w-4"/> Hasil Perhitungan</span>
            {hasSearched && periodInput && (
              <span className="text-xs bg-white/10 px-3 py-1 rounded-full text-yellow-300 font-medium">
                Periode: {getFullPeriodName(periodInput)}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-100 hover:bg-slate-100 border-b border-slate-200">
                <TableHead className="w-[50px] text-center font-bold text-slate-800">No</TableHead>
                <TableHead className="min-w-[200px] font-bold text-slate-800">Bahan Baku</TableHead>
                
                <TableHead className="text-right font-bold text-slate-600 border-l border-slate-200">Demand (D)</TableHead>
                <TableHead className="text-right font-bold text-slate-600">Biaya Pesan (S)</TableHead>
                <TableHead className="text-right font-bold text-slate-600 border-r border-slate-200">Biaya Simpan (H)</TableHead>

                <TableHead className="text-center font-bold text-emerald-700 bg-emerald-50">EOQ (Q*)</TableHead>
                <TableHead className="text-center font-bold text-emerald-700 bg-emerald-50">Freq</TableHead>
                <TableHead className="text-right font-bold text-emerald-700 bg-emerald-50">Total Biaya</TableHead>
                
                <TableHead className="text-center font-bold text-blue-700">Hemat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* KONDISI 1: Belum pernah search */}
              {!hasSearched && (
                <TableRow>
                  <TableCell colSpan={9} className="h-48 text-center text-slate-500 bg-slate-50/50">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Info className="w-8 h-8 text-blue-400 mb-2"/>
                      <p className="text-lg font-medium text-slate-700">Data belum ditampilkan</p>
                      <p className="text-sm">Silakan pilih Periode, Kategori, dan Penyimpanan di atas, lalu klik tombol <span className="font-bold text-blue-600">"Tampilkan Analisis"</span>.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {/* KONDISI 2: Loading */}
              {hasSearched && loading && (
                <TableRow>
                  <TableCell colSpan={9} className="h-48 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-600"/>
                      <p>Sedang menghitung EOQ...</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {/* KONDISI 3: Sudah search tapi kosong */}
              {hasSearched && !loading && data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="h-48 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Search className="w-8 h-8 text-slate-300"/>
                      <p>Tidak ada data transaksi yang sesuai filter ini.</p>
                      <Button variant="link" onClick={handleReset}>Reset Filter</Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {/* KONDISI 4: Ada Data */}
              {hasSearched && !loading && data.length > 0 && (
                data.map((item, index) => (
                  <TableRow key={item.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell className="text-center font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div className="font-bold text-slate-800">{item.name}</div>
                      <div className="text-[10px] text-slate-400 uppercase flex gap-2 mt-1">
                        <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">{item.category.replace('_', ' ')}</span>
                        <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">{item.storageName}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-right font-mono text-slate-600 border-l border-slate-100 bg-slate-50/30">
                      {item.D.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono text-slate-600 bg-slate-50/30">
                      {item.S.toLocaleString('id-ID', {maximumFractionDigits:0})}
                    </TableCell>
                    <TableCell className="text-right font-mono text-slate-600 border-r border-slate-100 bg-slate-50/30">
                      {item.H.toLocaleString('id-ID', {maximumFractionDigits:0})}
                    </TableCell>

                    <TableCell className="text-right font-mono font-bold text-emerald-700 bg-emerald-50/50 border-l border-emerald-100">
                      {item.qEoq.toLocaleString('id-ID', {maximumFractionDigits:0})}
                    </TableCell>
                    <TableCell className="text-center font-bold text-emerald-700 bg-emerald-50/50">
                      {item.freqEoq.toFixed(1)}x
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold text-emerald-700 bg-emerald-50/50 border-r border-emerald-100">
                      Rp {item.totalEoq.toLocaleString('id-ID', {maximumFractionDigits:0})}
                    </TableCell>

                    <TableCell className="text-center">
                      {item.savings > 0 ? (
                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200">
                          Hemat {((item.savings / item.totalAct) * 100).toFixed(0)}%
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-slate-400">Optimal</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
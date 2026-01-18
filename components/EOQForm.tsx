'use client'

import { useEffect, useState, Fragment } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingDown, FileBarChart, CheckCircle2, History, Loader2 } from "lucide-react"
import { getMaterials } from "@/app/actions/getMaterials" 

// Tipe Data Sesuai Action
type MaterialData = {
  id: string
  name: string
  unit: string
  
  existingQty: number
  existingFreq: number
  existingOrderCost: number
  existingHoldCost: number
  
  eoqQty: number
  eoqFreq: number
  eoqOrderCost: number
  eoqHoldCost: number
  
  totalExisting: number
  totalEoq: number
}

export default function EOQForm() {
  const [data, setData] = useState<MaterialData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const materials = await getMaterials() as unknown as MaterialData[]
        setData(materials)
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Hitung Summary Global
  const grandTotal = data.reduce((acc, item) => {
    const savings = item.totalExisting - item.totalEoq
    return {
      company: acc.company + item.totalExisting,
      eoq: acc.eoq + item.totalEoq,
      savings: acc.savings + savings
    }
  }, { company: 0, eoq: 0, savings: 0 })

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-600"/></div>

  return (
    <div className="space-y-8">
      
      {/* HEADER */}
      <Card className="border-t-4 border-blue-900 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-bold text-slate-900">
            <FileBarChart className="w-8 h-8 text-blue-800"/> 
            Laporan Analisis Persediaan (Perusahaan vs EOQ)
          </CardTitle>
          <CardDescription>
             Perbandingan langsung antara Data Historis Perusahaan dengan Rekomendasi EOQ.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* SUMMARY BOXES */}
      <div className="grid md:grid-cols-3 gap-6">
         <Card className="bg-red-50 border-red-200 shadow-sm">
            <CardContent className="pt-6">
               <div className="flex items-center gap-2 mb-2 text-red-800 font-bold text-xs uppercase tracking-wider">
                  <History className="w-4 h-4"/> Total Biaya Persediaan (Lama)
               </div>
               <div className="text-2xl font-bold text-red-700 font-mono">
                  Rp {grandTotal.company.toLocaleString('id-ID', {maximumFractionDigits:0})}
               </div>
            </CardContent>
         </Card>
         <Card className="bg-emerald-50 border-emerald-200 shadow-sm">
            <CardContent className="pt-6">
               <div className="flex items-center gap-2 mb-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4"/> Total Biaya Persediaan (EOQ)
               </div>
               <div className="text-2xl font-bold text-emerald-700 font-mono">
                  Rp {grandTotal.eoq.toLocaleString('id-ID', {maximumFractionDigits:0})}
               </div>
            </CardContent>
         </Card>
         <Card className="bg-blue-50 border-blue-200 shadow-sm border-l-4 border-l-blue-600">
            <CardContent className="pt-6">
               <div className="flex items-center gap-2 mb-2 text-blue-800 font-bold text-xs uppercase tracking-wider">
                  <TrendingDown className="w-4 h-4"/> Total Penghematan
               </div>
               <div className="text-3xl font-bold text-blue-700 font-mono">
                  Rp {grandTotal.savings.toLocaleString('id-ID', {maximumFractionDigits:0})}
               </div>
            </CardContent>
         </Card>
      </div>

      {/* TABLE */}
      <Card className="overflow-hidden border-0 shadow-xl">
        <Table className="text-sm md:text-base">
          <TableHeader>
            <TableRow className="bg-slate-900 hover:bg-slate-900 border-none">
              <TableHead className="text-white font-bold py-5 pl-4 w-[20%]">Nama Produk</TableHead>
              <TableHead className="text-center text-white font-bold py-5 bg-white/10 w-[10%]">Metode</TableHead>
              {/* KOLOM SESUAI PERMINTAAN */}
              <TableHead className="text-right text-white font-bold py-5">Jumlah Pemesanan (Kg)</TableHead>
              <TableHead className="text-center text-white font-bold py-5">Freq (Kali)</TableHead>
              <TableHead className="text-right text-white font-bold py-5">Biaya Pemesanan (Rp)</TableHead>
              <TableHead className="text-right text-white font-bold py-5">Biaya Penyimpanan (Rp)</TableHead>
              <TableHead className="text-right text-white font-bold py-5 pr-6">TOTAL BIAYA</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => {
              const savings = item.totalExisting - item.totalEoq;
              
              return (
              <Fragment key={item.id}>
                {/* BARIS PERUSAHAAN (Data Historis - Merah) */}
                <TableRow className="bg-red-50 hover:bg-red-100 border-b border-red-200">
                  <TableCell rowSpan={2} className="font-bold text-slate-800 border-r border-slate-200 bg-white pl-4 align-middle">
                    {item.name}
                    <div className="mt-1 text-xs text-blue-600 font-bold">
                       Penghematan: Rp {savings.toLocaleString('id-ID', {maximumFractionDigits:0})}
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-bold text-red-800 bg-red-100">Perusahaan</TableCell>
                  <TableCell className="text-right font-mono text-red-900">
                    {item.existingQty.toLocaleString('id-ID', {maximumFractionDigits:0})}
                  </TableCell>
                  <TableCell className="text-center font-bold text-red-900">
                    {item.existingFreq}
                  </TableCell>
                  <TableCell className="text-right font-mono text-red-900">
                    {item.existingOrderCost.toLocaleString('id-ID', {maximumFractionDigits:0})}
                  </TableCell>
                  <TableCell className="text-right font-mono text-red-900">
                    {item.existingHoldCost.toLocaleString('id-ID', {maximumFractionDigits:0})}
                  </TableCell>
                  <TableCell className="text-right font-bold font-mono text-red-800 pr-6">
                    {item.totalExisting.toLocaleString('id-ID', {maximumFractionDigits:0})}
                  </TableCell>
                </TableRow>

                {/* BARIS EOQ (Target - Hijau) */}
                <TableRow className="bg-emerald-50 hover:bg-emerald-100 border-b-4 border-slate-300">
                  <TableCell className="text-center font-bold text-emerald-800 bg-emerald-100">EOQ</TableCell>
                  <TableCell className="text-right font-mono text-emerald-900 font-bold">
                    {item.eoqQty.toLocaleString('id-ID', {maximumFractionDigits:0})}
                  </TableCell>
                  <TableCell className="text-center font-bold text-emerald-900">
                    {item.eoqFreq}
                  </TableCell>
                  <TableCell className="text-right font-mono text-emerald-900">
                    {item.eoqOrderCost.toLocaleString('id-ID', {maximumFractionDigits:0})}
                  </TableCell>
                  <TableCell className="text-right font-mono text-emerald-900">
                    {item.eoqHoldCost.toLocaleString('id-ID', {maximumFractionDigits:0})}
                  </TableCell>
                  <TableCell className="text-right font-bold font-mono text-emerald-800 pr-6">
                    {item.totalEoq.toLocaleString('id-ID', {maximumFractionDigits:0})}
                  </TableCell>
                </TableRow>
              </Fragment>
            )})}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
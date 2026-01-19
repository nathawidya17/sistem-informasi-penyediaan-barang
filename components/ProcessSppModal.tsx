'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
// [PERUBAHAN] Import Icon Eye (Mata)
import { Eye, X, Loader2, ArrowRight, Save } from "lucide-react"
import { processSppAction } from "@/app/actions/processSppActions"

type Supplier = { id: string; name: string }

type SppItem = {
  id: string
  materialId: string
  quantity: number 
  satuan: string | null
  material: { 
    name: string 
    pricePerUnit: number 
    satuan: string
    supplierId?: string | null 
  }
}

type SppData = {
  id: string
  code: string
  items: SppItem[]
}

export default function ProcessSppModal({ spp, suppliers }: { spp: SppData; suppliers: Supplier[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // State Form Input
  const [formData, setFormData] = useState<Record<string, { qty: number, supplierId: string }>>({})

  // Buka Modal & Load Data Awal
  const handleOpen = () => {
    const initialData: any = {}
    spp.items.forEach(item => {
      initialData[item.materialId] = {
        qty: item.quantity, 
        supplierId: item.material.supplierId || "" 
      }
    })
    setFormData(initialData)
    setIsOpen(true)
  }

  const handleChange = (materialId: string, field: 'qty' | 'supplierId', value: any) => {
    setFormData(prev => ({
      ...prev,
      [materialId]: { ...prev[materialId], [field]: value }
    }))
  }

  const handleSubmit = async () => {
    const listItems = spp.items.map(item => {
      const data = formData[item.materialId]
      return {
        materialId: item.materialId,
        quantity: Number(data.qty),
        price: item.material.pricePerUnit,
        supplierId: data.supplierId
      }
    })

    if (listItems.some(i => !i.supplierId || i.supplierId === "")) {
      alert("⚠️ Mohon pilih Supplier untuk SEMUA barang!")
      return
    }

    const isSplit = new Set(listItems.map(i => i.supplierId)).size > 1
    const confirmMsg = isSplit 
      ? "Supplier berbeda-beda. Sistem akan otomatis memecah menjadi beberapa PO. Lanjutkan?"
      : "Yakin buat PO ini?"

    if(!confirm(confirmMsg)) return;

    setIsLoading(true)
    try {
      await processSppAction(spp.id, listItems)
      alert("✅ Sukses! PO telah diterbitkan.")
      setIsOpen(false)
    } catch (e: any) {
      alert("Gagal: " + e.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* --- [INI ICON MATA YANG ANDA MINTA] --- */}
      {/* Tombolnya sekarang icon Mata, judulnya 'Detail' */}
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleOpen} 
        className="border-blue-200 text-blue-700 hover:bg-blue-50"
        title="Lihat Detail & Buat PO"
      >
        <Eye className="w-4 h-4 mr-2" /> Detail
      </Button>

      {/* --- MODAL DETAIL & SUPPLIER --- */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl overflow-hidden border flex flex-col max-h-[90vh]">
            
            {/* Header Modal */}
            <div className="px-6 py-4 border-b bg-slate-50 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Buat Purchase Order (PO)</h3>
                <p className="text-sm text-slate-500">
                  Request Asal: <span className="font-mono font-bold text-blue-600">{spp.code}</span>
                </p>
              </div>
              <button onClick={() => setIsOpen(false)}><X className="w-5 h-5 text-slate-400 hover:text-red-500"/></button>
            </div>

            {/* Tabel Detail & Input Supplier */}
            <div className="p-0 overflow-y-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b">
                  <tr>
                    <th className="px-4 py-3 w-[25%]">Nama Barang (Dari Gudang)</th>
                    <th className="px-4 py-3 w-[10%] text-center">Req Qty</th>
                    <th className="px-4 py-3 w-[15%] text-center">Order Qty</th>
                    <th className="px-4 py-3 w-[30%]">Tentukan Supplier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {spp.items.map((item) => {
                    const currentData = formData[item.materialId] || { qty: 0, supplierId: "" }
                    
                    return (
                      <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                        
                        {/* 1. Barang */}
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-800">{item.material.name}</div>
                          <div className="text-[10px] text-slate-500 bg-slate-100 inline-block px-1 rounded mt-1">
                            Satuan: {item.satuan}
                          </div>
                        </td>

                        {/* 2. Req Qty (ReadOnly) */}
                        <td className="px-4 py-3 text-center text-slate-500 bg-slate-50/50">
                          {item.quantity}
                        </td>

                        {/* 3. Input Qty (Bisa Edit) */}
                        <td className="px-4 py-3 text-center">
                          <Input 
                            type="number" 
                            className="h-8 text-center font-bold border-blue-200 focus:border-blue-500"
                            value={currentData.qty}
                            onChange={(e) => handleChange(item.materialId, 'qty', e.target.value)}
                          />
                        </td>

                        {/* 4. PILIH SUPPLIER (DROPDOWN) */}
                        <td className="px-4 py-3">
                           <div className="relative">
                              <select
                                className="flex h-9 w-full rounded-md border border-slate-300 bg-white px-3 py-1 text-sm focus:ring-2 focus:ring-blue-600 cursor-pointer shadow-sm"
                                value={currentData.supplierId}
                                onChange={(e) => handleChange(item.materialId, 'supplierId', e.target.value)}
                              >
                                <option value="" disabled>-- Pilih Supplier --</option>
                                {suppliers.map(s => (
                                  <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                              </select>
                           </div>
                        </td>

                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-slate-50 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsOpen(false)}>Batal</Button>
              <Button 
                onClick={handleSubmit} 
                className="bg-blue-600 hover:bg-blue-700 min-w-[150px]"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : (
                  <>
                    <Save className="w-4 h-4 mr-2" /> Terbitkan PO
                  </>
                )}
              </Button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}
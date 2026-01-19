'use client'

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Loader2, Save, ShoppingCart, Building2 } from "lucide-react" 
import { processSppAction } from "@/app/actions/processSppActions"
import { getSuppliersForDropdown } from "@/app/actions/supplierActions"

export default function ProcessSppModal({ request, open, onClose }: { request: any, open: boolean, onClose: () => void }) {
  const [isLoading, setIsLoading] = useState(false)
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [formData, setFormData] = useState<Record<string, { supplierId: string, price: number, quantity: number, materialId: string }>>({})

  useEffect(() => {
    if (open) {
      getSuppliersForDropdown().then(setSuppliers)
      
      const initData: any = {}
      request.items.forEach((item: any) => {
        initData[item.id] = {
          materialId: item.materialId,
          quantity: item.quantity,
          supplierId: "", 
          price: item.material.pricePerUnit || 0
        }
      })
      setFormData(initData)
    }
  }, [open, request])

  const handleChange = (itemId: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId], [field]: value }
    }))
  }

  const handleSubmit = async () => {
    const incomplete = Object.values(formData).some(item => !item.supplierId)
    if (incomplete) {
      alert("Mohon pilih Supplier untuk semua barang sebelum menyimpan.")
      return
    }

    setIsLoading(true)
    const itemsPayload = Object.values(formData)
    const res = await processSppAction(request.id, itemsPayload)
    setIsLoading(false)

    if (res.success) {
      alert("✅ Draft PO Berhasil Dibuat!")
      onClose()
    } else {
      alert("Gagal: " + res.message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      {/* UPDATE: Gunakan 'sm:max-w-[900px]' atau lebih besar agar PASTI MELEBAR */}
      <DialogContent className="sm:max-w-[1000px] w-full p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl text-blue-800 font-bold">
            <ShoppingCart className="w-6 h-6"/>
            Proses SPP ke PO
          </DialogTitle>
          <p className="text-sm text-slate-500 font-mono mt-1">Kode Permintaan: {request.code}</p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex gap-3 items-start">
            <Building2 className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-1">Instruksi:</p>
              <p>Pilih Supplier untuk setiap barang. PO akan otomatis dipisah berdasarkan Supplier yang dipilih.</p>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden ring-1 ring-slate-200">
            <Table>
              <TableHeader className="bg-slate-100">
                <TableRow>
                  {/* Kita kunci lebar kolom agar proporsional */}
                  <TableHead className="w-[35%]">Nama Barang</TableHead>
                  <TableHead className="w-[15%] text-center">Qty</TableHead>
                  <TableHead className="w-[50%]">Pilih Supplier Tujuan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {request.items.map((item: any) => (
                  <TableRow key={item.id} className="hover:bg-slate-50">
                    
                    {/* Nama Barang */}
                    <TableCell className="align-middle py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-slate-800 font-semibold text-base">{item.material.name}</span>
                        <span className="text-xs text-slate-400 font-mono">ID: {item.materialId.substring(0,6)}</span>
                      </div>
                    </TableCell>
                    
                    {/* Qty */}
                    <TableCell className="text-center align-middle py-4">
                      <div className="bg-slate-100 py-1 px-3 rounded-full inline-block font-bold text-slate-700">
                        {item.quantity.toLocaleString('id-ID')} {item.satuan}
                      </div>
                    </TableCell>

                    {/* Pilih Supplier */}
                    <TableCell className="align-middle py-4">
                      <Select 
                        value={formData[item.id]?.supplierId || ""} 
                        onValueChange={(val) => handleChange(item.id, "supplierId", val)}
                      >
                        <SelectTrigger className="h-11 w-full border-slate-300 bg-white focus:ring-blue-500 shadow-sm">
                          <SelectValue placeholder="-- Pilih Supplier Penyedia --" />
                        </SelectTrigger>
                        <SelectContent>
                          {suppliers.map(s => (
                            <SelectItem key={s.id} value={s.id} className="cursor-pointer py-2.5">
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <DialogFooter className="gap-2 pt-2">
          <Button variant="outline" onClick={onClose} className="px-6 h-11">Batal</Button>
          <Button onClick={handleSubmit} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 px-6 h-11 text-base">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : <Save className="w-4 h-4 mr-2"/>}
            Simpan & Buat PO
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  )
}
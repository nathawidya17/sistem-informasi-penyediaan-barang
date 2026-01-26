'use client'

import { useState } from "react"
import { Plus, Trash2, Save, Loader2, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createSppAction } from "@/app/actions/sppActions"

type Material = {
  id: string
  name: string
  unit: string
}

export default function CreateSppModal({ materials }: { materials: Material[] }) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [note, setNote] = useState("")
  
  // State untuk list items dinamis
  const [items, setItems] = useState([{ materialId: "", quantity: 0, satuan: "" }])

  // Tambah baris item baru
  const addItem = () => {
    setItems([...items, { materialId: "", quantity: 0, satuan: "" }])
  }

  // Hapus baris item
  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index)
    setItems(newItems)
  }

  // Update value item tertentu
  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items]
    const item = { ...newItems[index] }

    if (field === "materialId") {
      item.materialId = value
      // Auto set satuan sesuai material yang dipilih
      const selectedMat = materials.find(m => m.id === value)
      if (selectedMat) item.satuan = selectedMat.unit
    } 
    else if (field === "quantity") {
      item.quantity = parseFloat(value) || 0
    }

    newItems[index] = item
    setItems(newItems)
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    
    // Validasi sederhana
    const validItems = items.filter(i => i.materialId && i.quantity > 0)
    if (validItems.length === 0) {
      alert("Harap isi minimal satu barang dengan benar.")
      setIsLoading(false)
      return
    }

    const res = await createSppAction(note, validItems)
    
    setIsLoading(false)
    if (res.success) {
      setOpen(false)
      setNote("")
      setItems([{ materialId: "", quantity: 0, satuan: "" }]) // Reset form
    } else {
      alert(res.message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" /> Buat SPP Baru
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-blue-600"/> 
            Form Permintaan Pembelian (SPP)
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          
          {/* Catatan SPP */}
          <div className="space-y-2">
            <Label>Catatan / Alasan Permintaan</Label>
            <Textarea 
              placeholder="Contoh: Stok menipis untuk produksi minggu depan..." 
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className="border-t pt-4">
            <Label className="mb-2 block">Daftar Barang</Label>
            
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {items.map((item, index) => (
                <div key={index} className="flex gap-2 items-end">
                  
                  {/* Pilih Material */}
                  <div className="flex-1 space-y-1">
                    <span className="text-xs text-slate-500">Nama Barang</span>
                    <Select 
                      value={item.materialId} 
                      onValueChange={(val) => updateItem(index, "materialId", val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih..." />
                      </SelectTrigger>
                      <SelectContent>
                        {materials.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            {m.name} ({m.unit})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Input Qty */}
                  <div className="w-24 space-y-1">
                    <span className="text-xs text-slate-500">Jumlah</span>
                    <Input 
                      type="number" 
                      placeholder="0"
                      value={item.quantity || ""}
                      onChange={(e) => updateItem(index, "quantity", e.target.value)}
                    />
                  </div>

                  {/* Satuan Readonly */}
                  <div className="w-20 space-y-1">
                     <span className="text-xs text-slate-500">Satuan</span>
                     <div className="h-10 px-3 py-2 border rounded-md bg-slate-100 text-sm text-slate-500">
                        {item.satuan || "-"}
                     </div>
                  </div>

                  {/* Tombol Hapus Baris */}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 mb-0.5"
                    onClick={() => removeItem(index)}
                    disabled={items.length === 1} // Jangan hapus jika sisa 1 baris
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Button variant="outline" size="sm" onClick={addItem} className="mt-2 w-full border-dashed border-blue-300 text-blue-600 hover:bg-blue-50">
              <Plus className="w-3 h-3 mr-2" /> Tambah Barang Lain
            </Button>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
            <Button onClick={handleSubmit} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Kirim Permintaan
            </Button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  )
}
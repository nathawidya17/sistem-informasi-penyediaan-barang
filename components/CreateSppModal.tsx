'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X, Loader2, ShoppingCart, Plus, Trash2, Send } from "lucide-react"
import { createBulkSpp } from "@/app/actions/createBulkSpp" // <-- Pakai Action Baru

type Material = {
  id: string
  name: string
  satuan: string
  stock: number
}

// Tipe data untuk keranjang sementara
type CartItem = {
  materialId: string
  name: string
  quantity: number
  satuan: string
}

export default function CreateSppModal({ materials }: { materials: Material[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // State Utama: Keranjang & Catatan
  const [cart, setCart] = useState<CartItem[]>([])
  const [note, setNote] = useState("")

  // State Input Sementara
  const [selectedId, setSelectedId] = useState("")
  const [qtyInput, setQtyInput] = useState("")
  const [displaySatuan, setDisplaySatuan] = useState("-")

  // Saat pilih barang di dropdown
  const handleMaterialChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value
    setSelectedId(id)
    const mat = materials.find(m => m.id === id)
    if (mat) setDisplaySatuan(mat.satuan)
  }

  // --- 1. FUNGSI TAMBAH KE DAFTAR ---
  const handleAddToCart = () => {
    if (!selectedId || !qtyInput) {
      alert("Pilih barang dan isi jumlah dulu!")
      return
    }

    // Cek duplikasi
    if (cart.find(item => item.materialId === selectedId)) {
      alert("Barang ini sudah ada di daftar!")
      return
    }

    const mat = materials.find(m => m.id === selectedId)
    if (!mat) return

    const newItem: CartItem = {
      materialId: mat.id,
      name: mat.name,
      quantity: parseFloat(qtyInput),
      satuan: mat.satuan
    }

    setCart([...cart, newItem])
    
    // Reset Input Kecil
    setSelectedId("")
    setQtyInput("")
    setDisplaySatuan("-")
  }

  // --- 2. FUNGSI HAPUS DARI DAFTAR ---
  const handleRemoveItem = (id: string) => {
    setCart(cart.filter(item => item.materialId !== id))
  }

  // --- 3. FUNGSI KIRIM SEMUA KE SERVER ---
  const handleSubmitFinal = async () => {
    if (cart.length === 0) return

    setIsLoading(true)
    try {
      await createBulkSpp(note, cart) // Kirim array ke server
      alert("✅ Berhasil! " + cart.length + " barang dikirim ke Purchasing.")
      
      // Reset & Tutup
      setCart([])
      setNote("")
      setIsOpen(false)
    } catch (error: any) {
      alert("❌ Gagal: " + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)} 
        className="bg-slate-800 hover:bg-slate-900 text-white shadow-sm"
      >
        <ShoppingCart className="mr-2 h-4 w-4" />
        Buat SPP
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border flex flex-col max-h-[90vh]">
            
            {/* HEADER */}
            <div className="flex justify-between items-center px-6 py-4 border-b bg-slate-50">
              <div>
                <h3 className="font-bold text-lg text-slate-800">Buat Permintaan (SPP)</h3>
                <p className="text-xs text-slate-500">Masukkan beberapa barang sekaligus.</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-red-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* CONTENT SCROLLABLE */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* SECTION INPUT BARANG */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
                <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2 space-y-1">
                        <Label className="text-xs text-slate-500">Nama Barang</Label>
                        <select
                          value={selectedId}
                          onChange={handleMaterialChange}
                          className="flex h-9 w-full rounded-md border border-slate-300 bg-white px-3 py-1 text-sm focus:ring-2 focus:ring-slate-800 cursor-pointer"
                        >
                          <option value="" disabled>-- Pilih --</option>
                          {materials.map((m) => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                          ))}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs text-slate-500">Jml ({displaySatuan})</Label>
                        <Input 
                            type="number" 
                            className="h-9" 
                            placeholder="0"
                            value={qtyInput}
                            onChange={(e) => setQtyInput(e.target.value)}
                        />
                    </div>
                </div>
                <Button 
                    onClick={handleAddToCart} 
                    size="sm" 
                    className="w-full bg-slate-700 hover:bg-slate-800 text-white"
                >
                    <Plus className="w-4 h-4 mr-2" /> Tambah ke Daftar
                </Button>
              </div>

              {/* SECTION DAFTAR BELANJA (TABLE) */}
              <div>
                <Label className="mb-2 block font-bold text-slate-700">Daftar Barang ({cart.length})</Label>
                <div className="border rounded-md overflow-hidden max-h-[200px] overflow-y-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-100 text-slate-600 font-medium">
                            <tr>
                                <th className="px-3 py-2">Barang</th>
                                <th className="px-3 py-2 text-center">Qty</th>
                                <th className="px-3 py-2"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {cart.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-3 py-4 text-center text-slate-400 italic">
                                        Belum ada barang di daftar.
                                    </td>
                                </tr>
                            ) : (
                                cart.map((item) => (
                                    <tr key={item.materialId} className="bg-white">
                                        <td className="px-3 py-2">{item.name}</td>
                                        <td className="px-3 py-2 text-center font-bold">
                                            {item.quantity} <span className="text-[10px] text-slate-400 font-normal">{item.satuan}</span>
                                        </td>
                                        <td className="px-3 py-2 text-right">
                                            <button 
                                                onClick={() => handleRemoveItem(item.materialId)}
                                                className="text-red-400 hover:text-red-600"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
              </div>

              {/* SECTION CATATAN */}
              <div className="space-y-2">
                <Label>Catatan untuk Purchasing (Opsional)</Label>
                <Textarea 
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Cth: Stok menipis, mohon segera diproses..." 
                  className="resize-none"
                />
              </div>

            </div>

            {/* FOOTER */}
            <div className="p-4 border-t bg-slate-50 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setIsOpen(false)}>
                Batal
              </Button>
              <Button 
                onClick={handleSubmitFinal} 
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading || cart.length === 0}
              >
                {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : (
                    <>
                        <Send className="w-4 h-4 mr-2" /> Kirim SPP
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
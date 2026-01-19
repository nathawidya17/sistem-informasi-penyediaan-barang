'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Loader2, Building2 } from "lucide-react"
import { addSupplier } from "@/app/actions/supplierActions" 

export default function AddSupplierModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    
    const result = await addSupplier(formData)

    setIsLoading(false)

    if (result.error) {
      alert("❌ Gagal: " + result.error)
    } else {
      alert("✅ Supplier Berhasil Ditambahkan!")
      setIsOpen(false)
    }
  }

  return (
    <>
      {/* TOMBOL PEMICU */}
      <Button onClick={() => setIsOpen(true)} className="bg-blue-600 hover:bg-blue-700 shadow-sm">
        <Plus className="w-4 h-4 mr-2" /> Tambah Supplier
      </Button>

      {/* MODAL POPUP */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border">
            
            {/* Header Modal */}
            <div className="flex justify-between items-center px-6 py-4 border-b bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                Input Supplier Baru
              </h3>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-slate-400 hover:text-red-500 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form action={handleSubmit} className="p-6 space-y-4">
              
              <div className="space-y-2">
                <Label>Nama Perusahaan / Supplier <span className="text-red-500">*</span></Label>
                <Input 
                  name="name" 
                  placeholder="PT. Contoh Sejahtera" 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label>No. Telepon / WhatsApp <span className="text-red-500">*</span></Label>
                <Input 
                  name="phone" 
                  placeholder="0812-xxxx-xxxx" 
                  type="text"
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label>Alamat Lengkap <span className="text-red-500">*</span></Label>
                <Textarea 
                  name="address" 
                  placeholder="Jl. Industri Raya No. 1..." 
                  required 
                  className="resize-none h-24"
                />
              </div>

              {/* PERBAIKAN DI SINI: Gunakan flex-1 agar tombol berbagi ruang */}
              <div className="pt-4 flex gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1" 
                  onClick={() => setIsOpen(false)}
                >
                  Batal
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : "Simpan Data"}
                </Button>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  )
}
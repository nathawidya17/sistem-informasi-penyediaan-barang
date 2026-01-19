'use client' // Kita pakai client component biar interaktif (form & delete)

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Plus, Building2, Phone, MapPin } from "lucide-react"
import { getSuppliers, addSupplier, deleteSupplier } from "@/app/actions/supplierActions"

// Tipe data lokal
type Supplier = {
  id: string
  name: string
  address: string
  phone: string
}

export default function SupplierPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)

  // Load data saat halaman dibuka
  async function loadData() {
    const data = await getSuppliers()
    setSuppliers(data)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  // Handle Tambah
  async function handleSubmit(formData: FormData) {
    const res = await addSupplier(formData)
    if (res.error) {
      alert(res.error)
    } else {
      // Reset form manual atau reload data
      const form = document.getElementById("addSupplierForm") as HTMLFormElement
      form.reset()
      loadData() // Refresh tabel
    }
  }

  // Handle Hapus
  async function handleDelete(id: string) {
    if (confirm("Yakin hapus supplier ini?")) {
      await deleteSupplier(id)
      loadData()
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Data Supplier</h2>
          <p className="text-slate-500">Kelola daftar pemasok barang.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* --- KOLOM KIRI: FORM TAMBAH --- */}
        <div className="md:col-span-1">
          <Card className="border-l-4 border-blue-600 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5"/> Tambah Supplier
              </CardTitle>
              <CardDescription>Masukkan data mitra baru.</CardDescription>
            </CardHeader>
            <CardContent>
              <form id="addSupplierForm" action={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Nama Supplier (PT/CV/Toko)</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input name="name" placeholder="Contoh: PT. Terigu Jaya" className="pl-9" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Nomor HP / Telepon</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input name="phone" placeholder="0812..." className="pl-9" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Alamat Lengkap</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input name="address" placeholder="Jl. Raya..." className="pl-9" required />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  Simpan Data
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* --- KOLOM KANAN: TABEL DAFTAR --- */}
        <div className="md:col-span-2">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Daftar Supplier Aktif</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead>Nama Supplier</TableHead>
                    <TableHead>Kontak</TableHead>
                    <TableHead>Alamat</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suppliers.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-bold text-slate-700">{s.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Phone className="w-3 h-3"/> {s.phone}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-500 text-sm truncate max-w-[200px]" title={s.address}>
                        {s.address}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:bg-red-50 hover:text-red-600"
                          onClick={() => handleDelete(s.id)}
                        >
                          <Trash2 className="w-4 h-4"/>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {!loading && suppliers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center h-24 text-slate-400">
                        Belum ada data supplier.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
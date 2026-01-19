'use client' 

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input" 
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Phone, Building, Search } from "lucide-react" 
import { getSuppliers, deleteSupplier } from "@/app/actions/supplierActions"
import AddSupplierModal from '@/components/AddSupplierModal'

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
  
  // STATE PENCARIAN
  const [searchQuery, setSearchQuery] = useState("")

  // Load data saat halaman dibuka
  async function loadData() {
    setLoading(true)
    const data = await getSuppliers()
    setSuppliers(data)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  // Handle Hapus
  async function handleDelete(id: string) {
    if (confirm("Yakin hapus supplier ini?")) {
      await deleteSupplier(id)
      loadData()
    }
  }

  // LOGIC FILTER PENCARIAN
  const filteredSuppliers = suppliers.filter((item) => {
    const query = searchQuery.toLowerCase()
    return (
      item.name.toLowerCase().includes(query) ||
      item.address.toLowerCase().includes(query) ||
      item.phone.includes(query)
    )
  })

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
  
      {/* HEADER: Judul & Tombol Tambah */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Data Supplier</h2>
          <p className="text-slate-500">Kelola daftar pemasok barang.</p>
        </div>
        
        <div onClick={loadData}>
           <AddSupplierModal/>
        </div>
      </div>

      {/* --- CARD TOTAL SUPPLIER --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Supplier</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* PERBAIKAN: Gunakan suppliers.length (Total Asli) agar tidak berubah saat search */}
            <div className="text-2xl font-bold">{suppliers.length}</div>
            <p className="text-xs text-muted-foreground">Mitra aktif terdaftar</p>
          </CardContent>
        </Card>
      </div>

      {/* TABEL DATA + SEARCH DI HEADER */}
      <div className="grid gap-8">
        <Card className="shadow-sm">
          
          {/* HEADER CARD: Judul di Kiri, Search di Kanan */}
          <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b bg-slate-50/50 pb-4">
            
            <CardTitle>Daftar Supplier Aktif</CardTitle>

            {/* INPUT SEARCH (Masuk ke sini) */}
            <div className="relative w-full md:w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Cari supplier..." 
                className="pl-9 bg-white border-slate-300 h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

          </CardHeader>

          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead>Nama Supplier</TableHead>
                  <TableHead>Kontak</TableHead>
                  <TableHead>Alamat</TableHead>
                  <TableHead className="w-[50px] text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                
                {/* Loop Data Hasil Filter */}
                {filteredSuppliers.map((s) => (
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
                       <div className="flex justify-center">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:bg-red-50 hover:text-red-600"
                          onClick={() => handleDelete(s.id)}
                        >
                          <Trash2 className="w-4 h-4"/>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                
                {/* State Kosong / Tidak Ditemukan */}
                {!loading && filteredSuppliers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24 text-slate-400 italic">
                      {searchQuery 
                        ? `Tidak ditemukan supplier dengan kata kunci "${searchQuery}"` 
                        : "Belum ada data supplier."}
                    </TableCell>
                  </TableRow>
                )}

              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
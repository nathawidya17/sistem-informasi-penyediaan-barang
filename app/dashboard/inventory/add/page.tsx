import { addMaterial } from "@/app/actions/addMaterials" // Pastikan path ini benar
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PackagePlus, Save } from "lucide-react"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function AddProductPage() {
  // 1. Ambil Data Supplier untuk Dropdown
  const suppliers = await prisma.supplier.findMany({
    orderBy: { name: 'asc' }
  })

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-blue-600 mb-4">
        <PackagePlus className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Tambah Produk Baru</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Form Master Data</CardTitle>
          <CardDescription>
            Masukkan detail bahan baku baru untuk keperluan stok dan perhitungan EOQ.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Panggil Server Action */}
          <form action={addMaterial} className="space-y-6">
            
            {/* Nama & Satuan */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nama Barang</Label>
                <Input name="name" placeholder="Contoh: Garam Halus" required />
              </div>
              <div className="space-y-2">
                <Label>Satuan</Label>
                <Input name="unit" placeholder="Kg, Pcs, Liter..." required />
              </div>
            </div>

            {/* SUPPLIER (BARU) */}
            <div className="space-y-2">
              <Label>Supplier</Label>
              {/* PENTING: name="supplierId" agar terbaca di server action */}
              <Select name="supplierId">
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Supplier..." />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Harga & Stok Awal */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Harga per Unit (Rp)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 text-sm">Rp</span>
                  <Input type="number" name="pricePerUnit" placeholder="0" className="pl-9" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Stok Awal</Label>
                <Input type="number" name="stock" placeholder="0" required />
              </div>
            </div>

            <hr className="border-dashed" />

            {/* Parameter EOQ */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Biaya Pesan (S)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 text-sm">Rp</span>
                  <Input type="number" name="eoqBiayaPesan" placeholder="0" className="pl-9" />
                </div>
                <p className="text-[10px] text-muted-foreground">Biaya per satu kali pemesanan.</p>
              </div>
              <div className="space-y-2">
                <Label>Biaya Simpan / Unit (H)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 text-sm">Rp</span>
                  <Input type="number" name="eoqBiayaSimpan" placeholder="0" step="0.01" className="pl-9" />
                </div>
                <p className="text-[10px] text-muted-foreground">Biaya simpan per unit per 6 bulan.</p>
              </div>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" /> Simpan ke Database
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
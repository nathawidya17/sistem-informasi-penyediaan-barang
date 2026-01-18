import { addMaterial } from "@/app/actions/addMaterials"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PackagePlus, Save, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AddProductPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Tombol Kembali */}
      <Button asChild variant="outline" size="sm">
        <Link href="/dashboard/inventory">
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
        </Link>
      </Button>

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
          {/* Panggil Server Action di sini */}
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

            {/* Harga & Stok Awal */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Harga per Unit (Rp)</Label>
                <Input type="number" name="price" placeholder="0" required />
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
                <Input type="number" name="orderingCost" placeholder="Biaya Ongkir/Admin" />
                <p className="text-[10px] text-muted-foreground">Rata-rata biaya sekali pesan.</p>
              </div>
              <div className="space-y-2">
                <Label>Biaya Simpan (%)</Label>
                <Input type="number" name="holdingCost" placeholder="Contoh: 5" step="0.1" />
                <p className="text-[10px] text-muted-foreground">Masukkan angka persen (misal 5 untuk 5%).</p>
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
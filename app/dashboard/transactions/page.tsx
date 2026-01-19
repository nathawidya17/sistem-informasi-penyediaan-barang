import { getMaterials } from "@/app/actions/getMaterials";
import { updateStock } from "@/app/actions/updateStock";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { redirect } from "next/navigation";
import { InventoryTableRow } from "@/components/InventoryTableRow";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function TransactionPage() {
  const materials = await getMaterials();

  async function submitTransaction(formData: FormData) {
    'use server'
    try {
      await updateStock(formData)
      redirect('/dashboard/inventory')
    } catch (error) {
      console.error(error) 
    }
  }

  return (
    // UBAH 1: Container utama diperlebar jadi max-w-7xl (sebelumnya 2xl)
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header Judul */}
      <div className="max-w-2xl mx-auto w-full">
        <h2 className="text-3xl font-bold tracking-tight">Catat Transaksi Gudang</h2>
      </div>

      {/* UBAH 2: Form Input dibungkus div sendiri agar tetap di tengah & rapi (max-w-2xl) */}
      <div className="max-w-2xl mx-auto w-full">
        <Card>
          <CardHeader>
            <CardTitle>Form Keluar/Masuk Barang</CardTitle>
            <CardDescription>
              Catat setiap pergerakan barang untuk menjaga akurasi stok.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Form Server Action */}
            <form action={submitTransaction} className="space-y-4">
              
              {/* Pilih Barang */}
              <div className="space-y-2">
                <Label>Nama Barang</Label>
                <Select name="materialId" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Material..." />
                  </SelectTrigger>
                  <SelectContent>
                    {materials.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name} (Stok: {m.stock} {m.unit})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Pilih Jenis Transaksi */}
              <div className="space-y-2">
                <Label>Jenis Transaksi</Label>
                <Select name="type" required defaultValue="OUT">
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Jenis..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IN">barang MASUK (Pembelian)</SelectItem>
                    <SelectItem value="OUT">Barang KELUAR (Produksi)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Jumlah */}
              <div className="space-y-2">
                <Label>Jumlah (Kg)</Label>
                <Input type="number" name="quantity" placeholder="0" min="1" step="0.01" required />
              </div>

              <Button type="submit" className="w-full">
                Simpan Transaksi
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* UBAH 3: Card Tabel dibiarkan lebar penuh mengikuti container utama (max-w-7xl) */}
      <Card className="mb-16 py-6 w-full shadow-md border-slate-200">
        <CardHeader className="px-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Stok & Parameter Biaya (Live)</CardTitle>
              <CardDescription>
                Data ini diambil langsung dari database sistem.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0"> {/* Padding x-0 agar garis tabel penuh ke samping */}
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="w-[30%] px-6">Nama Bahan</TableHead>
                <TableHead className="px-6">Harga/Unit</TableHead>
                <TableHead className="px-6">Biaya Pesan (S)</TableHead>
                <TableHead className="px-6">Biaya Simpan (H)</TableHead>
                <TableHead className="text-right px-6">Stok Fisik</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materials.map((item) => (
                <InventoryTableRow
                  key={item.id}
                  item={item}
                />
              ))}
              
              {materials.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24 text-slate-500">
                    Belum ada data material. Silakan jalankan seed database.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
    </div>
  );
}
import { getMaterials } from "@/app/actions/getMaterials";
import { updateStock } from "@/app/actions/updateStock";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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
    <div className="p-8 max-w-2xl mx-auto space-y-6">
     

      <h2 className="text-3xl font-bold tracking-tight">Catat Transaksi Gudang</h2>

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
  );
}
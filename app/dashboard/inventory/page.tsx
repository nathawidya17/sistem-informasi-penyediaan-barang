import { getMaterials } from "@/app/actions/getMaterials";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button"; 
import Link from "next/link"; 
import { Plus, PackageCheck } from "lucide-react"; // Ikon tambahan

export default async function InventoryPage() {
  const materials = await getMaterials();

  // Hitung ringkasan cepat (Opsional, biar dashboard makin keren)
  const totalItem = materials.length;
  const totalStok = materials.reduce((acc, curr) => acc + curr.stock, 0);

  return (
    <div className="space-y-6">
      {/* HEADER PAGE - Lebih bersih tanpa banyak tombol navigasi (kan udah ada sidebar) */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
          <p className="text-muted-foreground">
            Overview stok bahan baku utama.
          </p>
        </div>
          {/* Tombol Tambah Produk (BARU) */}
          <Button asChild variant="outline">
            <Link href="/dashboard/inventory/add">
              <Plus className="mr-2 h-4 w-4" /> Produk Baru
            </Link>
          </Button>
        {/* Satu tombol CTA (Call to Action) utama saja */}
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href="/dashboard/transactions">
            <Plus className="mr-2 h-4 w-4" /> Catat Transaksi Baru
          </Link>
        </Button>
      </div>

      {/* RINGKASAN ATAS (Opsional: Biar kayak dashboard enterprise) */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jenis Item</CardTitle>
            <PackageCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItem}</div>
            <p className="text-xs text-muted-foreground">Bahan baku terdaftar</p>
          </CardContent>
        </Card>
        {/* Bisa tambah card ringkasan lain di sini nanti */}
      </div>

      {/* TABEL DATA */}
      <Card>
        <CardHeader>
          <CardTitle>Stok Gudang Saat Ini</CardTitle>
          <CardDescription>
            Data real-time dari database.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Nama Bahan</TableHead>
                <TableHead>Harga Satuan</TableHead>
                <TableHead>Biaya Pesan (S)</TableHead>
                <TableHead>Biaya Simpan (I)</TableHead>
                <TableHead className="text-right">Stok Aktual</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materials.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-700">{item.name}</span>
                      {/* Tampilkan info tambahan kecil di bawah nama */}
                      <span className="text-xs text-slate-400">ID: {item.id.substring(0,8)}...</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    Rp {item.pricePerUnit.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell>
                    {item.orderingCost 
                      ? `Rp ${item.orderingCost.toLocaleString("id-ID")}` 
                      : <span className="text-gray-300">-</span>}
                  </TableCell>
                  <TableCell>
                    {item.holdingCost 
                      ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {(item.holdingCost * 100).toFixed(0)}%
                        </span>
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-lg font-bold text-slate-800">
                      {item.stock.toLocaleString("id-ID")}
                    </span> 
                    <span className="text-sm text-gray-500 ml-1">{item.unit}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
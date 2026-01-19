import { PrismaClient } from "@prisma/client";
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
import { Archive, DollarSign, Package } from "lucide-react"; // Icon tambahan
import { InventoryTableRow } from "@/components/InventoryTableRow";

const prisma = new PrismaClient();

export default async function InventoryPage() {
  // 1. Ambil Data Material (Include Supplier agar namanya terbaca)
  const materials = await prisma.material.findMany({
    orderBy: { name: 'asc' },
    include: {
      supplier: true, // Ambil data supplier terkait
    },
  });

  // 2. Ambil Semua Data Supplier (Untuk Dropdown saat Edit)
  const suppliers = await prisma.supplier.findMany({
    orderBy: { name: 'asc' },
  });

  // Hitung Ringkasan
  const totalItem = materials.length;
  
  // Hitung Estimasi Aset (Stok * Harga)
  const totalAset = materials.reduce((acc, item) => {
    const stock = item.stock || 0;
    const price = item.pricePerUnit || 0;
    return acc + (stock * price);
  }, 0);

  return (
    <div className="space-y-6">
      
      {/* HEADER PAGE */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Inventory Gudang</h2>
          <p className="text-muted-foreground">
            Monitoring stok fisik, supplier, dan parameter biaya bahan baku.
          </p>
        </div>
      </div>

      {/* RINGKASAN ATAS */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Card 1: Total Item */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jenis Bahan</CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItem}</div>
            <p className="text-xs text-muted-foreground">Item terdaftar di database</p>
          </CardContent>
        </Card>

        {/* Card 2: Valuasi Aset */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estimasi Nilai Aset</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalAset.toLocaleString("id-ID", { notation: "compact", maximumFractionDigits: 1 })}
            </div>
            <p className="text-xs text-muted-foreground">Total (Stok × Harga Satuan)</p>
          </CardContent>
        </Card>

        {/* Card 3: Total Supplier (Opsional, info tambahan) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Supplier</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suppliers.length}</div>
            <p className="text-xs text-muted-foreground">Mitra aktif terdaftar</p>
          </CardContent>
        </Card>
      </div>

      {/* TABEL DATA */}
      <Card>
        <CardHeader>
          <CardTitle>Stok & Parameter Biaya (Live)</CardTitle>
          <CardDescription>
            Data ini diambil langsung dari database sistem.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Nama Bahan</TableHead>
                <TableHead>Supplier Utama</TableHead>
                <TableHead>Harga/Unit</TableHead>
                <TableHead>Biaya Pesan (S)</TableHead>
                <TableHead>Biaya Simpan (H)</TableHead>
                <TableHead className="text-right">Stok Fisik</TableHead>
                <TableHead className="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materials.map((item) => (
                <InventoryTableRow
                  key={item.id}
                  item={item}
                  suppliers={suppliers} 
                />
              ))}
              
              {materials.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24 text-slate-500">
                    Belum ada data material. Silakan tambah data baru.
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
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
import { Plus, PackageCheck, Archive } from "lucide-react";
import { InventoryTableRow } from "@/components/InventoryTableRow";

// Definisi Tipe Data
type MaterialData = {
  id: string;
  name: string;
  unit: string;
  pricePerUnit: number;
  stock: number;
  eoqBiayaPesan: number;
  eoqBiayaSimpan: number;
};

export default async function InventoryPage() {
  // Casting tipe data
  const materials = await getMaterials() as unknown as MaterialData[];

  // Hitung ringkasan
  const totalItem = materials.length;
  
  // Hitung Estimasi Aset (Stok * Harga) -> Ditambah safety check (|| 0)
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
            Monitoring stok fisik dan parameter biaya bahan baku.
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
            <span className="text-muted-foreground font-bold">Rp</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalAset.toLocaleString("id-ID", { notation: "compact", maximumFractionDigits: 1 })}
            </div>
            <p className="text-xs text-muted-foreground">Total (Stok × Harga Satuan)</p>
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
                <TableHead className="w-[250px]">Nama Bahan</TableHead>
                <TableHead>Harga/Unit</TableHead>
                <TableHead>Biaya Pesan (S)</TableHead>
                <TableHead>Biaya Simpan (H)</TableHead>
                <TableHead className="text-right">Stok Fisik</TableHead>
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
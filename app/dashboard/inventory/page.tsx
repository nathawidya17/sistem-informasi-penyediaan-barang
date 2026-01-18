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
        <div className="flex gap-2">
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/dashboard/eoq">
              <PackageCheck className="mr-2 h-4 w-4" /> Cek Analisa EOQ
            </Link>
          </Button>
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
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800">{item.name}</span>
                      <span className="text-[10px] text-slate-400 uppercase">ID: {item.id.substring(0,6)}</span>
                    </div>
                  </TableCell>
                  
                  {/* Harga Satuan - FIX: Ditambah ( || 0 ) */}
                  <TableCell>
                    Rp {(item.pricePerUnit || 0).toLocaleString("id-ID")}
                    <span className="text-xs text-slate-400"> / {item.unit}</span>
                  </TableCell>
                  
                  {/* Biaya Pesan (S) - FIX: Ditambah ( || 0 ) */}
                  <TableCell>
                    {item.eoqBiayaPesan > 0
                      ? `Rp ${(item.eoqBiayaPesan || 0).toLocaleString("id-ID", { maximumFractionDigits: 0 })}` 
                      : <span className="text-slate-300">-</span>}
                  </TableCell>
                  
                  {/* Biaya Simpan (H) - FIX: Ditambah ( || 0 ) */}
                  <TableCell>
                    {item.eoqBiayaSimpan > 0
                      ? <span className="text-blue-700 font-medium bg-blue-50 px-2 py-1 rounded-md text-xs">
                          Rp ${(item.eoqBiayaSimpan || 0).toLocaleString("id-ID", { maximumFractionDigits: 2 })}
                        </span>
                      : <span className="text-slate-300">-</span>}
                  </TableCell>
                  
                  {/* Stok Aktual - FIX: Ditambah ( || 0 ) */}
                  <TableCell className="text-right">
                    <span className="text-lg font-bold text-slate-800">
                      {(item.stock || 0).toLocaleString("id-ID")}
                    </span> 
                    <span className="text-sm text-slate-500 ml-1">{item.unit}</span>
                  </TableCell>
                </TableRow>
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
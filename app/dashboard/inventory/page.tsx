import { PrismaClient } from "@prisma/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Archive, DollarSign, Package } from "lucide-react"; 
import { InventoryTableRow } from "@/components/InventoryTableRow";
import { cookies } from "next/headers"; 

const prisma = new PrismaClient();

export default async function InventoryPage() {
  // 1. Ambil Session User & Role
  const cookieStore = await cookies();
  const session = cookieStore.get("user_session")?.value;
  const user = session ? JSON.parse(session) : { role: "GUEST" };
  const userRole = user.role; 
  
  // Hanya PURCHASING yang boleh edit
  const canEdit = userRole === "PURCHASING";

  // 2. Ambil Data Material (Include Supplier & Storage)
  const materials = await prisma.material.findMany({
    orderBy: { name: 'asc' },
    include: { 
      supplier: true,
      storage: true // [PENTING] Ambil data gudang yang nempel di material
    },
  });

  // 3. Ambil Data Master untuk Dropdown di Modal Edit
  const suppliers = await prisma.supplier.findMany({
    orderBy: { name: 'asc' },
  });

  const storages = await prisma.storage.findMany({ // [FIX] Ambil data semua gudang
    orderBy: { name: 'asc' },
  });

  // Hitung Ringkasan
  const totalItem = materials.length;
  const totalAset = materials.reduce((acc, item) => {
    return acc + ((item.stock || 0) * (item.pricePerUnit || 0));
  }, 0);

  return (
    <div className="space-y-6">
      
      {/* HEADER PAGE */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Inventory Gudang</h2>
          <p className="text-slate-500">
            Monitoring stok fisik, supplier, dan parameter biaya bahan baku.
          </p>
        </div>
      </div>

      {/* RINGKASAN ATAS */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className=" shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Total Jenis Bahan</CardTitle>
            <Archive className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{totalItem}</div>
            <p className="text-xs text-slate-500">Item terdaftar di database</p>
          </CardContent>
        </Card>

        <Card className=" shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Estimasi Nilai Aset</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              Rp {totalAset.toLocaleString("id-ID", { notation: "compact", maximumFractionDigits: 0 })}
            </div>
            <p className="text-xs text-slate-500">Total (Stok × Harga Satuan)</p>
          </CardContent>
        </Card>

        <Card className=" shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Total Supplier</CardTitle>
            <Package className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{suppliers.length}</div>
            <p className="text-xs text-slate-500">Mitra aktif terdaftar</p>
          </CardContent>
        </Card>
      </div>

      {/* TABEL DATA */}
      <Card className="shadow-lg border-0">
        <CardHeader className=" text-slate-800 rounded-t-xl pb-4">
          <CardTitle className="text-lg">Stok & Parameter Biaya (Live)</CardTitle>
          <CardDescription className="text-slate-900">
            Data ini diambil langsung dari database sistem.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-[200px] font-bold">Nama Bahan</TableHead>
                <TableHead className="font-bold">Supplier Utama</TableHead>
                <TableHead className="text-right font-bold">Harga/Unit</TableHead>
                <TableHead className="text-right font-bold">Stok Fisik</TableHead>
                
                {/* Header Aksi hanya muncul jika canEdit (Purchasing) */}
                {canEdit && <TableHead className="text-center font-bold">Aksi</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {materials.map((item) => (
                <InventoryTableRow
                  key={item.id}
                  item={item}
                  suppliers={suppliers}
                  storages={storages} 
                  userRole={userRole} 
                />
              ))}
              
              {materials.length === 0 && (
                <TableRow>
                  <TableCell colSpan={canEdit ? 5 : 4} className="text-center h-24 text-slate-500">
                    Belum ada data material.
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
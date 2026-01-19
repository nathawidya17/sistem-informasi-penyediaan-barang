import { PrismaClient } from "@prisma/client";
import TransactionForm from "@/components/TransactionsForm"; 
import CreateSppModal from "@/components/CreateSppModal"; // <--- IMPORT KOMPONEN BARU
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const prisma = new PrismaClient();

export default async function TransactionPage() {
  // Ambil data untuk dropdown form & modal
  const materials = await prisma.material.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      satuan: true, 
      stock: true
    }
  })

  // Ambil history transaksi
  const transactions = await prisma.transaction.findMany({
    include: { material: true },
    orderBy: { createdAt: 'desc' }
  });

  const formatDate = (date: Date | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString('id-ID', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      
      {/* HEADER: Judul & Tombol SPP */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-3xl font-bold tracking-tight">Transaksi Stok</h2>
           <p className="text-slate-500">Pencatatan barang masuk (pembelian) dan keluar (produksi).</p>
        </div>

        {/* --- PASANG TOMBOL SPP DISINI --- */}
        <CreateSppModal materials={materials} />
      </div>

      {/* Form Transaksi Biasa */}
      <TransactionForm materials={materials} />

      {/* TABEL RIWAYAT */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Transaksi</CardTitle>
          <CardDescription>Data historis pergerakan barang di gudang.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-100">
                <TableHead className="w-[50px] text-center font-bold text-black">No</TableHead>
                <TableHead className="font-bold text-black text-center">Tanggal Masuk</TableHead>
                <TableHead className="font-bold text-black text-center">Tanggal Keluar</TableHead>
                <TableHead className="font-bold text-black">Nama Barang</TableHead>
                <TableHead className="font-bold text-black text-center">Satuan</TableHead>
                <TableHead className="font-bold text-black text-right">Jumlah</TableHead>
                <TableHead className="font-bold text-black text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((trx, index) => (
                <TableRow key={trx.id}>
                  <TableCell className="text-center font-medium">{index + 1}</TableCell>
                  
                  <TableCell className="text-center">
                    {trx.dateIn ? <span className="text-emerald-700 font-medium">{formatDate(trx.dateIn)}</span> : "-"}
                  </TableCell>

                  <TableCell className="text-center">
                    {trx.dateOut ? <span className="text-red-700 font-medium">{formatDate(trx.dateOut)}</span> : "-"}
                  </TableCell>

                  <TableCell className="font-bold text-slate-700">
                    {trx.material?.name || "Item Dihapus"}
                  </TableCell>

                  <TableCell className="text-center">
                     <Badge variant="outline" className="bg-slate-50">
                        {trx.material?.satuan || "-"}
                     </Badge>
                  </TableCell>

                  <TableCell className="text-right font-mono font-bold text-base">
                    {trx.quantity.toLocaleString('id-ID')}
                  </TableCell>
                  
                  <TableCell className="text-center">
                    {trx.type === 'IN' 
                      ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">Masuk</span>
                      : <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Keluar</span>
                    }
                  </TableCell>
                </TableRow>
              ))}

              {transactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24 text-slate-500">
                    Belum ada data transaksi.
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
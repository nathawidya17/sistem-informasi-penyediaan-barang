import { PrismaClient } from "@prisma/client"
import OrderForm from "@/components/orderForm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ClipboardList } from "lucide-react"

const prisma = new PrismaClient()

export default async function PurchasingOrderPage() {
  // Ambil data material untuk dropdown
  // Include supplier biar user tau belinya ke siapa
  const materials = await prisma.material.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      unit: true,
      supplier: {
        select: { name: true }
      }
    }
  })

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <ClipboardList className="h-8 w-8 text-blue-600" />
          </div>
          Form Pemesanan
        </h1>
        <p className="text-slate-500 ml-16">
          Input data belanja harian (Purchasing) ke dalam sistem.
        </p>
      </div>

      <Card className="border-t-4 border-blue-600 shadow-xl bg-white">
        <CardHeader className="bg-slate-50/50 pb-6 border-b border-slate-100">
          <CardTitle className="text-xl text-slate-800">Input Order Baru</CardTitle>
          <CardDescription>
            Silakan isi detail barang, jumlah, dan total harga pembelian.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          <OrderForm materials={materials} />
        </CardContent>
      </Card>

    </div>
  )
}
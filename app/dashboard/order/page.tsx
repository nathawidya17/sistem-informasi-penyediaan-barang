import { PrismaClient } from "@prisma/client"
import AddOrderingForm from "@/components/orderForm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart } from "lucide-react"

const prisma = new PrismaClient()

export default async function AddOrderingPage() {
  // Ambil data Material & Supplier untuk Dropdown
  const materials = await prisma.material.findMany({ orderBy: { name: 'asc' } })
  const suppliers = await prisma.supplier.findMany({ orderBy: { name: 'asc' } })

  return (
    <div className="max-w-3xl mx-auto space-y-8 p-8">
      
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <ShoppingCart className="h-6 w-6 text-blue-600" />
          </div>
          Input Riwayat Pembelian
        </h1>
        <p className="text-slate-500 ml-14">
          Data ini digunakan untuk menghitung rata-rata <b>Biaya Pesan (S)</b>.
        </p>
      </div>

      <Card className="border-t-4 border-blue-600 shadow-xl bg-white">
        <CardHeader className="bg-slate-50/50 pb-6 border-b border-slate-100">
          <CardTitle>Form Data Ordering</CardTitle>
          <CardDescription>Masukkan total akumulasi pembelian dalam satu periode.</CardDescription>
        </CardHeader>
        <CardContent className="pt-8 px-8">
          <AddOrderingForm materials={materials} suppliers={suppliers} />
        </CardContent>
      </Card>
    </div>
  )
}
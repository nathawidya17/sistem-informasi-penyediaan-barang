import { PrismaClient } from "@prisma/client"
import AddProductForm from "@/components/AddFormMaterial" // Import komponen yg baru dibuat
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PackagePlus } from "lucide-react"

const prisma = new PrismaClient()

export default async function AddProductPage() {
  // Ambil data di Server Component (Lebih Cepat & Aman)
  const suppliers = await prisma.supplier.findMany({ orderBy: { name: 'asc' } })
  const storages = await prisma.storage.findMany({ orderBy: { name: 'asc' } })

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-8">
      
      {/* HEADER */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <PackagePlus className="h-6 w-6 text-blue-600" />
          </div>
          Tambah Produk Baru
        </h1>
        <p className="text-slate-500 ml-14">
          Isi formulir di bawah ini untuk mendaftarkan bahan baku. Form akan otomatis reset setelah disimpan.
        </p>
      </div>

      <Card className="border-t-4 border-blue-600 shadow-xl bg-white">
        <CardHeader className="bg-slate-50/50 pb-6 border-b border-slate-100">
          <CardTitle className="text-lg text-slate-800">Formulir Master Data</CardTitle>
          <CardDescription>
            Silakan lengkapi data di bawah ini.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-8 px-8">
          {/* Render Client Component Form disini */}
          <AddProductForm suppliers={suppliers} storages={storages} />
        </CardContent>
      </Card>
    </div>
  )
}
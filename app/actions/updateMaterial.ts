'use server'

import { PrismaClient, MaterialCategory } from "@prisma/client"
import { revalidatePath } from "next/cache"

const prisma = new PrismaClient()

export async function updateMaterialAction(formData: FormData) {
  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const unit = formData.get('unit') as string
  const supplierId = formData.get('supplierId') as string
  const storageId = formData.get('storageId') as string
  const categoryRaw = formData.get('category') as string // [BARU]
  
  // Konversi Angka
  const priceRaw = formData.get('pricePerUnit') as string
  const pctRaw = formData.get('storagePercentage') as string 

  const pricePerUnit = parseFloat(priceRaw) || 0
  
  // Konversi Persen ke Desimal (10 -> 0.1)
  let storagePercentage = 0.01 
  if (pctRaw) {
    storagePercentage = parseFloat(pctRaw) / 100
  }

  if (!id || !name) {
    return { success: false, message: "Data tidak valid" }
  }

  // Validasi Kategori agar sesuai Enum Prisma
  const category = (categoryRaw === 'BAHAN_PENOLONG') 
    ? MaterialCategory.BAHAN_PENOLONG 
    : MaterialCategory.BAHAN_BAKU

  try {
    await prisma.material.update({
      where: { id },
      data: {
        name,
        unit,
        category, // [BARU] Simpan Kategori
        pricePerUnit,
        supplierId: supplierId || null,
        storageId: storageId || null,
        storagePercentage, 
      }
    })

    revalidatePath('/dashboard/inventory') // Refresh halaman inventory
    return { success: true, message: "Data berhasil diperbarui" }
  } catch (error) {
    console.error("Update error:", error)
    return { success: false, message: "Gagal update database" }
  }
}
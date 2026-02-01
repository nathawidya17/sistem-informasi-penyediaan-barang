'use server'

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"

const prisma = new PrismaClient()

export async function addMaterial(formData: FormData) {
  const name = formData.get("name") as string
  const unit = formData.get("unit") as string
  const category = formData.get("category") as any
  const supplierId = formData.get("supplierId") as string
  const storageId = formData.get("storageId") as string
  
  // Handle konversi angka, jika kosong default 0
  const priceRaw = formData.get("pricePerUnit") as string
  const stockRaw = formData.get("stock") as string
  const pricePerUnit = priceRaw ? parseFloat(priceRaw) : 0
  const stock = stockRaw ? parseFloat(stockRaw) : 0

  if (!name || !unit || !category || !supplierId || !storageId) {
    return { success: false, message: "Mohon lengkapi semua field yang wajib diisi." }
  }

  try {
    await prisma.material.create({
      data: {
        name,
        unit,
        category,
        pricePerUnit,
        stock,
        supplierId,
        storageId,
        eoqBiayaPesan: 0,
        biayaPenyimpanan: 0 
      }
    })

    revalidatePath("/dashboard/materials") // Refresh data di background
    
    // RETURN SUKSES (Tanpa Redirect)
    return { success: true, message: "Produk berhasil ditambahkan ke database!" }
    
  } catch (error) {
    console.error("Gagal tambah material:", error)
    return { success: false, message: "Terjadi kesalahan saat menyimpan data." }
  }
}
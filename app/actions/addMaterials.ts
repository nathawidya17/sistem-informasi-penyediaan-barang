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
  
  // Konversi Angka
  const priceRaw = formData.get("pricePerUnit") as string
  const stockRaw = formData.get("stock") as string
  const storagePctRaw = formData.get("storagePercentage") as string // Ambil input persen

  const pricePerUnit = priceRaw ? parseFloat(priceRaw) : 0
  const stock = stockRaw ? parseFloat(stockRaw) : 0
  
  // Konversi Persentase: User input 10 (%) -> Masuk DB 0.1
  let storagePercentage = 0.01 // Default 1%
  if (storagePctRaw) {
    storagePercentage = parseFloat(storagePctRaw) / 100
  }

  // Validasi
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
        storagePercentage, // [PENTING] Disimpan di sini untuk hitung H
        // eoqBiayaPesan & biayaPenyimpanan SUDAH DIHAPUS, JANGAN DIMASUKKAN
      }
    })

    revalidatePath("/dashboard/materials")
    
    return { success: true, message: "Produk berhasil ditambahkan! Perhitungan EOQ akan aktif setelah ada transaksi." }
    
  } catch (error) {
    console.error("Gagal tambah material:", error)
    return { success: false, message: "Terjadi kesalahan saat menyimpan data." }
  }
}
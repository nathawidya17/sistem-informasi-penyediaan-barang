'use server'

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

const prisma = new PrismaClient()

export async function addOrder(formData: FormData) {
  // 1. Ambil Data dari Form
  const materialId = formData.get("materialId") as string
  const dateStr = formData.get("date") as string // Format YYYY-MM-DD
  const amount = parseFloat(formData.get("amount") as string) // Jumlah (Kg)
  const price = parseFloat(formData.get("price") as string)   // Total Harga (Rp)

  if (!materialId || !dateStr || !amount || !price) {
    return { success: false, message: "Mohon lengkapi semua data belanja." }
  }

  try {
    // 2. Format Periode (Contoh: "Oktober 2025")
    const dateObj = new Date(dateStr)
    const period = dateObj.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })

    // 3. Cari Material untuk dapat Supplier-nya (Otomatis)
    const material = await prisma.material.findUnique({
      where: { id: materialId }
    })

    if (!material) {
      return { success: false, message: "Barang tidak ditemukan." }
    }

    // 4. Simpan ke Tabel Ordering
    await prisma.ordering.create({
      data: {
        materialId,
        supplierId: material.supplierId, // Otomatis ambil dari master barang
        period: period,
        amount: amount,   // Total Berat (Kg)
        price: price,     // Total Bayar (Rp)
        frequency: 1      // Default 1 kali transaksi
      }
    })

    revalidatePath("/dashboard/purchasing/order")
    return { success: true, message: "Pemesanan berhasil disimpan!" }

  } catch (error) {
    console.error("Gagal order:", error)
    return { success: false, message: "Gagal menyimpan data pemesanan." }
  }
}
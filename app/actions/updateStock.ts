'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache' // Untuk refresh data otomatis

const prisma = new PrismaClient()

export async function updateStock(formData: FormData) {
  const materialId = formData.get('materialId') as string
  const type = formData.get('type') as string // "IN" atau "OUT"
  const quantity = parseFloat(formData.get('quantity') as string)

  if (!materialId || !quantity) return

  // 1. Ambil data material saat ini untuk cek stok
  const material = await prisma.material.findUnique({
    where: { id: materialId }
  })

  if (!material) throw new Error("Material tidak ditemukan")

  // 2. Hitung stok baru
  let newStock = material.stock
  if (type === 'IN') {
    newStock = material.stock + quantity
  } else {
    // Validasi: Stok tidak boleh minus
    if (material.stock < quantity) {
      throw new Error("Stok tidak cukup!")
    }
    newStock = material.stock - quantity
  }

  // 3. Update Database (Gunakan Transaction supaya aman)
  await prisma.$transaction([
    // A. Catat Riwayat Transaksi
    prisma.transaction.create({
      data: {
        materialId,
        type: type as 'IN' | 'OUT',
        quantity,
      }
    }),
    // B. Update Angka Stok di Material
    prisma.material.update({
      where: { id: materialId },
      data: { stock: newStock }
    })
  ])

  // 4. Refresh halaman inventory agar angka stok berubah
  revalidatePath('/dashboard/inventory')
}
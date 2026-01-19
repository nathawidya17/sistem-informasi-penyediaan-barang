'use server'

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"

const prisma = new PrismaClient()

type CartItem = {
  materialId: string
  quantity: number
  satuan: string
}

export async function createBulkSpp(note: string, items: CartItem[]) {
  // 1. Validasi
  if (!items || items.length === 0) {
    throw new Error("Daftar barang masih kosong!")
  }

  // 2. Generate Kode Unik
  const dateCode = new Date().toISOString().slice(0, 10).replace(/-/g, "")
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0")
  const code = `SPP-${dateCode}-${random}`

  try {
    // 3. Simpan Header + Detail Item sekaligus
    await prisma.purchaseRequest.create({
      data: {
        code: code,
        status: 'PENDING',
        note: note || "Permintaan Bulk via Modal",
        items: {
          create: items.map((item) => ({
            materialId: item.materialId,
            quantity: item.quantity,
            satuan: item.satuan
          }))
        }
      }
    })

    // 4. Refresh Halaman
    revalidatePath('/dashboard/transactions')
    revalidatePath('/dashboard/requests')
    
    return { success: true }

  } catch (error) {
    console.error("Error create bulk SPP:", error)
    throw new Error("Gagal menyimpan data ke database.")
  }
}
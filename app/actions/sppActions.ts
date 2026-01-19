'use server'

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"

const prisma = new PrismaClient()

// Tipe data untuk item yang dikirim dari Modal
type SppItemInput = {
  materialId: string
  quantity: number
  satuan: string
}

export async function createSppAction(note: string, items: SppItemInput[]) {
  if (!items || items.length === 0) {
    return { success: false, message: "Daftar barang tidak boleh kosong" }
  }

  // 1. Generate Kode SPP Otomatis (SPP-YYYYMMDD-XXX)
  const date = new Date()
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "") // 20260120
  const random = Math.floor(100 + Math.random() * 900) // 3 digit random
  const code = `SPP-${dateStr}-${random}`

  try {
    // 2. Simpan ke Database (Header + Detail Items)
    await prisma.purchaseRequest.create({
      data: {
        code,
        note,
        status: "PENDING", // Default status
        items: {
          create: items.map((item) => ({
            materialId: item.materialId,
            quantity: item.quantity,
            satuan: item.satuan
          }))
        }
      }
    })

    revalidatePath("/dashboard/requests")
    return { success: true, message: "SPP Berhasil dibuat!" }

  } catch (error) {
    console.error("Gagal buat SPP:", error)
    return { success: false, message: "Terjadi kesalahan sistem" }
  }
}
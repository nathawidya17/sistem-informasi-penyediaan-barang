'use server'

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"

const prisma = new PrismaClient()

export async function addOrdering(formData: FormData) {
  const materialId = formData.get("materialId") as string
  const supplierId = formData.get("supplierId") as string
  const period = formData.get("period") as string
  
  const amountRaw = formData.get("amount") as string
  const priceRaw = formData.get("price") as string
  const freqRaw = formData.get("frequency") as string

  const amount = parseFloat(amountRaw) || 0
  const price = parseFloat(priceRaw) || 0 // Total Rupiah
  const frequency = parseInt(freqRaw) || 1 // Frekuensi

  if (!materialId || !supplierId || !period) {
    return { success: false, message: "Data tidak lengkap!" }
  }

  try {
    await prisma.ordering.create({
      data: {
        materialId,
        supplierId,
        period,
        amount,     // Total Kg
        price,      // Total Rupiah
        frequency   // Jumlah Kali Order
      }
    })

    revalidatePath("/dashboard/eoq") // Refresh halaman EOQ biar S terupdate
    return { success: true, message: "Data ordering berhasil disimpan!" }
  } catch (error) {
    console.error("Gagal save ordering:", error)
    return { success: false, message: "Gagal menyimpan data." }
  }
}
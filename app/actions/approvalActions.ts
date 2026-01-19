'use server'

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"

const prisma = new PrismaClient()

export async function approvePoAction(poId: string, action: 'APPROVE' | 'REJECT') {
  const status = action === 'APPROVE' ? 'APPROVED' : 'REJECTED'

  try {
    // Update Status Purchase Order
    await prisma.purchaseOrder.update({
      where: { id: poId },
      data: { status }
    })

    // (Opsional) Jika di-REJECT, mungkin status SPP harus dikembalikan? 
    // Tapi untuk sekarang kita biarkan SPP tetap 'PROCESSED' (artinya sudah diproses purchasing),
    // hanya saja PO-nya gagal.

    revalidatePath("/dashboard/approval")
    return { success: true, message: `PO Berhasil di-${action === 'APPROVE' ? 'Setujui' : 'Tolak'}` }
  } catch (error) {
    console.error("Gagal Approval:", error)
    return { success: false, message: "Terjadi kesalahan sistem." }
  }
}
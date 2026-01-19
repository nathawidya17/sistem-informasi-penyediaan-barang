'use server'

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"

const prisma = new PrismaClient()

type ProcessItem = {
  materialId: string
  quantity: number
  price: number
  supplierId: string
}

export async function processSppAction(sppId: string, items: ProcessItem[]) {
  // 1. Grouping Item Berdasarkan Supplier
  // (Misal: Item A & B beli di Supplier X, Item C beli di Supplier Y)
  const groupedItems: Record<string, ProcessItem[]> = {}

  items.forEach((item) => {
    if (!groupedItems[item.supplierId]) {
      groupedItems[item.supplierId] = []
    }
    groupedItems[item.supplierId].push(item)
  })

  try {
    await prisma.$transaction(async (tx) => {
      
      // Loop untuk membuat PO bagi setiap Supplier
      for (const [supplierId, groupList] of Object.entries(groupedItems)) {
        
        // Generate Kode PO: PO-YYYYMMDD-XXXX
        const dateCode = new Date().toISOString().slice(0, 10).replace(/-/g, "")
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0")
        const poCode = `PO-${dateCode}-${random}`

        // Create PO Header + Detail Items
        await tx.purchaseOrder.create({
          data: {
            code: poCode,
            status: 'PENDING', // Masih Pending (Menunggu Approval Manajer)
            supplierId: supplierId,
            purchaseRequestId: sppId, // Link ke SPP asal
            items: {
              create: groupList.map(i => ({
                materialId: i.materialId,
                quantity: i.quantity,
                price: i.price
              }))
            }
          }
        })
      }

      // Update Status SPP jadi SELESAI (PROCESSED)
      await tx.purchaseRequest.update({
        where: { id: sppId },
        data: { status: 'PROCESSED' }
      })

    })

    revalidatePath('/dashboard/requests')
    return { success: true }

  } catch (error) {
    console.error("Gagal Proses PO:", error)
    return { success: false, message: "Gagal membuat PO. Cek logs." }
  }
}
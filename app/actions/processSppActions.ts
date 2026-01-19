'use server'

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"

const prisma = new PrismaClient()

// Tipe data yang dikirim dari Form Modal
type ProcessItem = {
  materialId: string
  quantity: number      // Qty Final yang diputuskan Purchasing
  price: number         // Harga beli
  supplierId: string    // Supplier yang dipilih
}

export async function processSppAction(sppId: string, items: ProcessItem[]) {
  console.log("Processing SPP:", sppId, items)

  // 1. Validasi
  // Pastikan semua barang sudah ada suppliernya
  if (items.some(i => !i.supplierId)) {
    throw new Error("Semua barang wajib dipilih Supplier-nya!")
  }

  // 2. GROUPING BY SUPPLIER
  // Kita kelompokkan barang berdasarkan Supplier ID
  // Hasil: { "supp_A": [item1, item2], "supp_B": [item3] }
  const groupedItems: Record<string, ProcessItem[]> = {}

  items.forEach((item) => {
    if (!groupedItems[item.supplierId]) {
      groupedItems[item.supplierId] = []
    }
    groupedItems[item.supplierId].push(item)
  })

  try {
    // 3. Eksekusi Database (Transaction)
    await prisma.$transaction(async (tx) => {
      
      // Loop setiap Supplier yang teridentifikasi
      for (const [supplierId, groupList] of Object.entries(groupedItems)) {
        
        // A. Generate Kode PO Unik
        const dateCode = new Date().toISOString().slice(0, 10).replace(/-/g, "")
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0")
        const poCode = `PO-${dateCode}-${random}`

        // B. Buat Header PO
        await tx.purchaseOrder.create({
          data: {
            code: poCode,
            status: 'PENDING',
            supplierId: supplierId,
            purchaseRequestId: sppId, // Link ke SPP asal
            items: {
              // C. Masukkan Barang-barang milik Supplier ini
              create: groupList.map(i => ({
                materialId: i.materialId,
                quantity: i.quantity,
                price: i.price
              }))
            }
          }
        })
      }

      // D. Update Status SPP Asal jadi SELESAI
      await tx.purchaseRequest.update({
        where: { id: sppId },
        data: { status: 'PROCESSED' }
      })

    }) // End Transaction

    revalidatePath('/dashboard/requests')
    return { success: true }

  } catch (error) {
    console.error("Gagal Proses SPP:", error)
    throw new Error("Gagal memproses PO. Cek server logs.")
  }
}
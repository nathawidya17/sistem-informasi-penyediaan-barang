'use server'

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

const prisma = new PrismaClient()

export async function updateStockAction(formData: FormData) {
  // 1. Ambil data dari form
  const materialId = formData.get("materialId") as string
  const type = formData.get("type") as string // "IN" atau "OUT"
  const dateString = formData.get("date") as string
  const quantityString = formData.get("quantity") as string

  // 2. LOGGING (Cek di Terminal VS Code kamu saat klik Simpan)
  console.log("=== SERVER ACTION START ===")
  console.log({ materialId, type, dateString, quantityString })

  // 3. Validasi Data Dasar
  if (!materialId || !dateString || !quantityString) {
    console.error("❌ Data tidak lengkap!")
    throw new Error("Mohon lengkapi semua data.")
  }

  // Konversi tipe data
  const quantity = parseFloat(quantityString)
  const date = new Date(dateString)

  if (isNaN(quantity) || quantity <= 0) {
    console.error("❌ Jumlah quantity tidak valid")
    throw new Error("Jumlah barang harus angka lebih dari 0")
  }

  try {
    // 4. Jalankan Transaksi Database (Atomic)
    // Kita pakai $transaction agar Create History & Update Stok jalan bareng
    await prisma.$transaction(async (tx) => {
      
      // A. Catat di Tabel Transaction (Riwayat)
      await tx.transaction.create({
        data: {
          materialId,
          type: type as "IN" | "OUT",
          quantity,
          dateIn: type === 'IN' ? date : null,   // Isi dateIn kalau masuk
          dateOut: type === 'OUT' ? date : null, // Isi dateOut kalau keluar
        }
      })

      // B. Update Stok di Tabel Material
      // Jika IN (Masuk) -> Stok Nambah
      // Jika OUT (Keluar) -> Stok Berkurang
      if (type === 'IN') {
        await tx.material.update({
          where: { id: materialId },
          data: {
            stock: { increment: quantity }
          }
        })
      } else {
        await tx.material.update({
          where: { id: materialId },
          data: {
            stock: { decrement: quantity }
          }
        })
      }
    })

    console.log("✅ Transaksi Berhasil Disimpan!")

  } catch (error) {
    console.error("❌ Gagal Update Database:", error)
    throw new Error("Gagal menyimpan transaksi ke database.")
  }

  // 5. PENTING: Refresh halaman agar data baru muncul di tabel
  // Pastikan path ini sesuai dengan url halaman transaksimu
  revalidatePath('/dashboard/transactions')
  revalidatePath('/dashboard/inventory') // Refresh juga halaman inventory biar stoknya update
}
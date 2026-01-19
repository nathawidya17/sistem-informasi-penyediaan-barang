'use server'

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

const prisma = new PrismaClient()

export async function addMaterial(formData: FormData) {
  // Ambil data string
  const name = formData.get("name") as string
  const unit = formData.get("unit") as string
  const supplierId = formData.get("supplierId") as string // <-- Tangkap Supplier ID
  
  // Konversi data angka
  const pricePerUnit = parseFloat(formData.get("pricePerUnit") as string) || 0
  const stock = parseFloat(formData.get("stock") as string) || 0
  const eoqBiayaPesan = parseFloat(formData.get("eoqBiayaPesan") as string) || 0
  const eoqBiayaSimpan = parseFloat(formData.get("eoqBiayaSimpan") as string) || 0

  if (!name || !unit) {
    // Validasi sederhana
    return 
  }

  // Simpan ke Database
  await prisma.material.create({
    data: {
      name,
      unit,
      pricePerUnit,
      stock,
      eoqBiayaPesan,
      eoqBiayaSimpan,
      // Logika Relasi Supplier:
      // Jika user memilih supplier (string tidak kosong), sambungkan.
      // Jika tidak, biarkan null.
      supplierId: supplierId && supplierId !== "" ? supplierId : null
    },
  })

  // Refresh data inventory dan pindah halaman
  revalidatePath("/dashboard/inventory")
  redirect("/dashboard/inventory")
}
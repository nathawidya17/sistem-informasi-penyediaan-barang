'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const prisma = new PrismaClient()

export async function addMaterial(formData: FormData) {
  // 1. Ambil data dari form
  const name = formData.get('name') as string
  const unit = formData.get('unit') as string
  const price = parseFloat(formData.get('price') as string)
  const stock = parseFloat(formData.get('stock') as string)
  const orderingCost = parseFloat(formData.get('orderingCost') as string)
  
  // Konversi Biaya Simpan dari Persen (5) ke Desimal (0.05)
  const holdingCostPercent = parseFloat(formData.get('holdingCost') as string)
  const holdingCost = holdingCostPercent / 100

  // 2. Validasi sederhana
  if (!name || !unit || isNaN(price)) {
    throw new Error('Data tidak lengkap')
  }

  // 3. Simpan ke Database
  await prisma.material.create({
    data: {
      name,
      unit,
      pricePerUnit: price,
      stock: stock || 0,
      orderingCost: orderingCost || 0,
      holdingCost: holdingCost || 0,
    }
  })

  // 4. Refresh data dan balik ke halaman inventory
  revalidatePath('/dashboard/inventory')
  redirect('/dashboard/inventory')
}
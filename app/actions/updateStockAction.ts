'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function updateStockAction(formData: FormData) {
  try {
    const materialId = formData.get('materialId') as string
    const name = formData.get('name') as string
    const unit = formData.get('unit') as string
    const pricePerUnit = parseFloat(formData.get('pricePerUnit') as string) || 0
    const eoqBiayaPesan = parseFloat(formData.get('eoqBiayaPesan') as string) || 0
    const eoqBiayaSimpan = parseFloat(formData.get('eoqBiayaSimpan') as string) || 0
    const stock = parseFloat(formData.get('stock') as string) || 0

    if (!materialId) {
      return { error: 'Material ID tidak valid' }
    }

    // Validasi input
    if (!name || !unit) {
      return { error: 'Nama bahan dan satuan harus diisi' }
    }

    // Update Material di database
    const updatedMaterial = await prisma.material.update({
      where: { id: materialId },
      data: {
        name,
        unit,
        pricePerUnit,
        eoqBiayaPesan,
        eoqBiayaSimpan,
        stock,
      }
    })

    // Revalidate halaman
    revalidatePath('/dashboard/inventory')

    return { success: true, material: updatedMaterial }
  } catch (error) {
    console.error('Error updating material:', error)
    return { error: 'Gagal memperbarui data material' }
  }
}

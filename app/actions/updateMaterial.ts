'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function updateMaterialAction(formData: FormData) {
  const id = formData.get('id') as string
  const name = formData.get('name') as string
  
  // Konversi angka (handling jika string kosong)
  const pricePerUnit = parseFloat(formData.get('pricePerUnit') as string) || 0
  const eoqBiayaPesan = parseFloat(formData.get('eoqBiayaPesan') as string) || 0
  const eoqBiayaSimpan = parseFloat(formData.get('eoqBiayaSimpan') as string) || 0
  const stock = parseFloat(formData.get('stock') as string) || 0

  // Ambil Supplier ID dari dropdown
  const supplierId = formData.get('supplierId') as string

  try {
    await prisma.material.update({
      where: { id },
      data: {
        name,
        pricePerUnit,
        eoqBiayaPesan,
        eoqBiayaSimpan,
        stock,
        // Logika Supplier: 
        // Jika ada ID supplier yg dipilih, hubungkan. 
        // Jika tidak ada/direset, putuskan hubungan (null).
        supplierId: supplierId && supplierId !== "null_value" ? supplierId : null
      },
    })

    // Refresh halaman inventory agar data di tabel berubah
    revalidatePath('/dashboard/inventory')
    
    return { success: true, message: 'Data berhasil diperbarui' }
  } catch (error) {
    console.error('Gagal update material:', error)
    return { success: false, message: 'Gagal memperbarui data' }
  }
}
'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function updateMaterialAction(formData: FormData) {
  const id = formData.get('id') as string
  const role = formData.get('role') as string 

  // VALIDASI: HANYA PURCHASING YANG BOLEH EDIT
  if (role !== 'PURCHASING') {
    return { success: false, message: 'Akses ditolak. Hanya Purchasing yang boleh mengedit.' }
  }

  // Ambil Data dari Form
  const name = formData.get('name') as string
  const satuan = formData.get('satuan') as any // KG/PCS/ROLL
  const pricePerUnit = parseFloat(formData.get('pricePerUnit') as string) || 0
  
  // Parameter EOQ
  const eoqBiayaPesan = parseFloat(formData.get('eoqBiayaPesan') as string) || 0
  const eoqBiayaSimpan = parseFloat(formData.get('eoqBiayaSimpan') as string) || 0
  const existingFreq = parseFloat(formData.get('existingFreq') as string) || 0

  // Supplier Logic
  const supplierId = formData.get('supplierId') as string
  const finalSupplierId = (supplierId && supplierId !== "null_value") ? supplierId : null

  try {
    await prisma.material.update({
      where: { id },
      data: {
        name,
        satuan,
        pricePerUnit,
        eoqBiayaPesan,
        eoqBiayaSimpan,
        existingFreq,
        supplierId: finalSupplierId
      },
    })

    revalidatePath('/dashboard/inventory')
    
    return { success: true, message: 'Data material berhasil diperbarui.' }
  } catch (error) {
    console.error('Gagal update material:', error)
    return { success: false, message: 'Gagal memperbarui data di database.' }
  }
}
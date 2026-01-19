'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

// Ambil semua supplier
export async function getSuppliers() {
  return await prisma.supplier.findMany({
    orderBy: { name: 'asc' }
  })
}

// Tambah supplier baru
export async function addSupplier(formData: FormData) {
  const name = formData.get('name') as string
  const address = formData.get('address') as string
  const phone = formData.get('phone') as string

  if (!name || !address || !phone) {
    return { error: 'Semua field (Nama, Alamat, No HP) wajib diisi' }
  }

  try {
    await prisma.supplier.create({
      data: {
        name,
        address,
        phone,
      },
    })
    revalidatePath('/dashboard/suppliers')
    return { success: true }
  } catch (error) {
    return { error: 'Gagal menambah supplier' }
  }
}

// Hapus supplier
export async function deleteSupplier(id: string) {
  try {
    await prisma.supplier.delete({ where: { id } })
    revalidatePath('/dashboard/suppliers')
    return { success: true }
  } catch (error) {
    return { error: 'Gagal menghapus. Mungkin supplier sedang digunakan di data lain.' }
  }
}
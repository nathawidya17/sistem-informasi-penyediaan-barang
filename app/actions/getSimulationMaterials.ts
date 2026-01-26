'use server'

import { PrismaClient, MaterialCategory, StorageType } from '@prisma/client'

const prisma = new PrismaClient()

type FilterParams = {
  category?: string
  storageType?: string
}

export async function getSimulationMaterials(filters: FilterParams) {
  const whereClause: any = {}

  // Filter Kategori
  if (filters.category && filters.category !== 'ALL') {
    whereClause.category = filters.category as MaterialCategory
  }
  
  // Filter Storage (Lewat Relasi Storage)
  if (filters.storageType && filters.storageType !== 'ALL') {
    whereClause.storage = {
      type: filters.storageType as StorageType
    }
  }

  const materials = await prisma.material.findMany({
    where: whereClause,
    orderBy: { name: 'asc' },
    include: {
      storage: true // Penting! Ambil data Storage untuk dapat harga (H)
    }
  })

  // Mapping data bersih ke Frontend
  return materials.map(m => ({
    id: m.id,
    name: m.name,
    unit: m.unit,
    // S (Biaya Pesan)
    s: m.eoqBiayaPesan || 0,
    // H (Biaya Simpan) - Prioritas ambil dari Storage Price, kalo null ambil dari kolom backup
    h: m.storage?.price || m.eoqBiayaSimpan || 0,
    // Fixed Cost (Biaya Simpan Aktual)
    fixedCost: m.existingHoldCost || 0
  }))
}
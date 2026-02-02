'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getMaterials() {
  const materials = await prisma.material.findMany({
    orderBy: { name: 'asc' }
  })
  
  // MAPPING DATA
  const formattedData = materials.map((m) => ({
    id: m.id,
    name: m.name,
    unit: m.unit,
    stock: m.stock || 0,
    pricePerUnit: m.pricePerUnit || 0,
    

    // Data Aktual (Sesuai Laporan Excel)
  }))

  return formattedData
}
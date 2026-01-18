'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getMaterials() {
  const materials = await prisma.material.findMany({
    orderBy: { name: 'asc' }
  })
  
  // MAPPING DATA (FIX TYPO DISINI)
  const formattedData = materials.map((m) => ({
    id: m.id,
    name: m.name,
    unit: m.unit,
    
    // Parameter Rumus EOQ
    eoqBiayaPesan: m.eoqBiayaPesan || 0, // S
    eoqBiayaSimpan: m.eoqBiayaSimpan || 0, // H

    // Data Aktual (Sesuai Laporan Excel)
    // DULU ERROR DISINI KARENA PAKE 'exHoldCost'
    exHoldCost: m.existingHoldCost || 0, // SEKARANG BENAR: 'existingHoldCost'
    exFreq: m.existingFreq || 0,
    exQty: m.existingQty || 0
  }))

  return formattedData
}
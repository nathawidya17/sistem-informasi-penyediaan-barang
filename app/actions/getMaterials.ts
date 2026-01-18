'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getMaterials() {
  // Mengambil semua bahan baku, diurutkan abjad
  const materials = await prisma.material.findMany({
    orderBy: {
      name: 'asc'
    }
  })
  return materials
}
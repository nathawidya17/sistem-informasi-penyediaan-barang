'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getMaterials() {
  const materials = await prisma.material.findMany({
    orderBy: { name: 'asc' }
  })
  
  // Langsung kembalikan data apa adanya dari database
  return materials
}
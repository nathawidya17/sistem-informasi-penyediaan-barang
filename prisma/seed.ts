// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Memulai Seeding Data Presisi...')

  // 1. KOSONGKAN DATABASE LAMA
  try {
    await prisma.transaction.deleteMany()
    await prisma.material.deleteMany()
    await prisma.supplier.deleteMany()
  } catch (e) {
    console.log('Database sudah bersih.')
  }

  // 2. ISI DATA MATERIAL (DENGAN NILAI S & H YANG BENAR)
  
  // --- Terigu Golden Crown ---
  // S = 140 Juta, H = 447 Perak
  await prisma.material.create({
    data: {
      name: 'Terigu Golden Crown',
      unit: 'Kg',
      pricePerUnit: 10320,
      stock: 5000,
      eoqBiayaPesan: 140785583, // <--- INI S (Tidak Boleh 0)
      eoqBiayaSimpan: 447.47,   // <--- INI H (Tidak Boleh 0)
    }
  })

  // --- Gula Rafinasi Grade B ---
  // S = 120 Juta, H = 595 Perak
  await prisma.material.create({
    data: {
      name: 'Gula Rafinasi Grade B',
      unit: 'Kg',
      pricePerUnit: 7200,
      stock: 2000,
      eoqBiayaPesan: 120030000, // <--- INI S
      eoqBiayaSimpan: 595.86,   // <--- INI H
    }
  })

  // --- NZMP Whole Milk Powder ---
  // S = 118 Juta, H = 8.966 Perak
  await prisma.material.create({
    data: {
      name: 'NZMP Whole Milk Powder',
      unit: 'Kg',
      pricePerUnit: 66840,
      stock: 500,
      eoqBiayaPesan: 118826667, // <--- INI S
      eoqBiayaSimpan: 8966.38,  // <--- INI H
    }
  })

  console.log('✅ Seeding Selesai! Data S & H sudah masuk.')
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Seeding Data Excel Presisi...')

  try {
    await prisma.transaction.deleteMany()
    await prisma.material.deleteMany()
    await prisma.supplier.deleteMany()
  } catch (e) {}

  await prisma.supplier.create({ data: { name: 'PT. Bungasari Flour Mills' } })
  await prisma.supplier.create({ data: { name: 'PT. Sentra Usahatama Jaya' } })

  // 1. TERIGU GOLDEN CROWN
  await prisma.material.create({
    data: {
      name: 'Terigu Golden Crown',
      unit: 'Kg',
      pricePerUnit: 10320,
      stock: 5000,
      
      // Parameter Rumus
      eoqBiayaPesan: 140785583, // S (Benar)
      eoqBiayaSimpan: 447.47,   // H (Benar)
      
      // Data Aktual (Penyimpanan Tetap)
      existingHoldCost: 324000000, // <--- INI ANGKA 324 Juta YANG ANDA CARI
      existingFreq: 72,
    }
  })

  // 2. GULA RAFINASI
  await prisma.material.create({
    data: {
      name: 'Gula Rafinasi Grade B',
      unit: 'Kg',
      pricePerUnit: 7200,
      stock: 2000,
      eoqBiayaPesan: 120030000,
      eoqBiayaSimpan: 595.86,
      existingHoldCost: 216000000, // 216 Juta
      existingFreq: 30,
    }
  })

  // 3. SUSU
  await prisma.material.create({
    data: {
      name: 'NZMP Whole Milk Powder',
      unit: 'Kg',
      pricePerUnit: 66840,
      stock: 500,
      eoqBiayaPesan: 118826667,
      eoqBiayaSimpan: 8966.38,
      existingHoldCost: 180000000, // 180 Juta
      existingFreq: 18,
    }
  })

  console.log('✅ Seeding Selesai.')
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { console.error(e); process.exit(1) })
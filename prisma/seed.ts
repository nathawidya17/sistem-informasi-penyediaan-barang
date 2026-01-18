// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding (Update Biaya)...')

  // Reset data lama biar bersih
  try {
    await prisma.orderItem.deleteMany()
    await prisma.purchaseOrder.deleteMany()
    await prisma.transaction.deleteMany()
    await prisma.material.deleteMany()
    await prisma.supplier.deleteMany()
  } catch (e) {
    console.log('Database clean...')
  }

  // 1. Masukkan Data Supplier
  await prisma.supplier.createMany({
    data: [
      { name: 'PT. Manunggal Perkasa', phone: '021-5550001' },
      { name: 'PT. Sentra Usahatama Jaya', phone: '021-5550002' },
      { name: 'PT. Aroma Indonesia Internasional', phone: '021-5550003' }
    ]
  })

  // 2. Masukkan Data Bahan Baku (Data Updated)
  await prisma.material.createMany({
    data: [
      {
        name: 'Terigu Golden Crown',
        unit: 'kg',
        pricePerUnit: 10320,
        holdingCost: 0.07,     // Tetap 7% (Standar tertinggi)
        orderingCost: 1175000,
        stock: 5000
      },
      {
        name: 'Gula Rafinasi Grade B',
        unit: 'kg',
        pricePerUnit: 7200,
        holdingCost: 0.05,     // UPDATE: Jadi 5% sesuai request
        orderingCost: 1175000,
        stock: 2000
      },
      {
        name: 'NZMP Whole Milk Powder',
        unit: 'kg',
        pricePerUnit: 66840,
        holdingCost: 0.05,     // UPDATE: Kita set 5% (tengah-tengah 3-7%)
        orderingCost: 1175000, // Asumsi biaya pesan sama dengan bahan baku lain
        stock: 500
      }
    ]
  })

  console.log('Seeding finished. Gula & Susu diset 5%.')
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
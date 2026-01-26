import { PrismaClient, Role, MaterialCategory, StorageType } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Data...')

  // 1. BERSIHKAN
  try {
    await prisma.ordering.deleteMany()
    await prisma.transaction.deleteMany() // Hapus transaksi lama
    await prisma.requestItem.deleteMany()
    await prisma.orderItem.deleteMany()
    await prisma.purchaseOrder.deleteMany()
    await prisma.purchaseRequest.deleteMany()
    await prisma.material.deleteMany()
    await prisma.storage.deleteMany()
    await prisma.user.deleteMany()
  } catch (e) {}

  // 2. USER
  await prisma.user.createMany({
    data: [
      { username: 'gudang', password: '123', role: Role.GUDANG },
      { username: 'purchasing', password: '123', role: Role.PURCHASING },
      { username: 'manajer', password: '123', role: Role.MANAJER }
    ],
    skipDuplicates: true
  })

  // 3. STORAGE (H)
  const stgTerigu = await prisma.storage.create({ data: { name: 'Gudang Bahan Baku A', type: StorageType.DRY_STORAGE, price: 447.47 } })
  const stgGula = await prisma.storage.create({ data: { name: 'Gudang Bahan Baku B', type: StorageType.DRY_STORAGE, price: 595.86 } })
  const stgSusu = await prisma.storage.create({ data: { name: 'Gudang Bahan Baku C', type: StorageType.DRY_STORAGE, price: 8966.38 } })
  const stgChem = await prisma.storage.create({ data: { name: 'Gudang Kimia', type: StorageType.CHEMICAL_STORAGE, price: 500 } })

  // 4. SUPPLIER
  await prisma.supplier.createMany({
    data: [
      { id: 'b835a9c4-f52f-11f0-bff1-221aaedcbe0c', name: 'Bakels ( Malaysia ) SDN BHD', address: 'Jl. Raya Industri Malaysia No. 101, Kuala Lumpur', phone: '+60-3-555-0101' },
      { id: 'b8364b9a-f52f-11f0-bff1-221aaedcbe0c', name: 'Bakels Bhangsheng Food Ingredients ( Guangdo) CO,. Ltd', address: 'Guangzhou Industrial Park Block A, China', phone: '+86-20-555-0102' },
      { id: 'b83668c8-f52f-11f0-bff1-221aaedcbe0c', name: 'CV. FA Chemical', address: 'Jl. Kimia Farma No. 12, Jakarta', phone: '021-5550103' },
      { id: 'b83668e6-f52f-11f0-bff1-221aaedcbe0c', name: 'CV. Garuda Mas Lestari', address: 'Jl. Garuda No. 45, Surabaya', phone: '031-5550104' },
      { id: 'b83668fa-f52f-11f0-bff1-221aaedcbe0c', name: 'CV. Sasana Aneka Pangan', address: 'Jl. Pangan Sejahtera No. 8, Bandung', phone: '022-5550105' },
      { id: 'b836690e-f52f-11f0-bff1-221aaedcbe0c', name: 'CV. Standard Food Globalindo', address: 'Jl. Industri Makanan No. 99, Semarang', phone: '024-5550106' },
      { id: 'b8366954-f52f-11f0-bff1-221aaedcbe0c', name: 'CV. Sukses Pangan Abadi', address: 'Jl. Abadi Jaya No. 7, Medan', phone: '061-5550107' },
      { id: 'b836695e-f52f-11f0-bff1-221aaedcbe0c', name: 'Cargill Bio- Chemicals Co,. Ltd', address: 'Jl. Raya Bogor KM 28, Jakarta', phone: '021-5550108' },
      { id: 'b836711a-f52f-11f0-bff1-221aaedcbe0c', name: 'Hens Chemicalindo', address: 'Jl. Chemical Raya No. 3, Tangerang', phone: '021-5550109' },
      { id: 'b8367142-f52f-11f0-bff1-221aaedcbe0c', name: 'Mutiara Ihsan', address: 'Jl. Mutiara No. 5, Bekasi', phone: '021-5550110' },
      { id: 'b8367156-f52f-11f0-bff1-221aaedcbe0c', name: 'PD. Satria', address: 'Jl. Satria Muda No. 11, Cirebon', phone: '0231-5550111' },
      { id: 'b836716a-f52f-11f0-bff1-221aaedcbe0c', name: 'PD. Sentosa', address: 'Jl. Sentosa Raya No. 22, Solo', phone: '0271-5550112' },
      { id: 'b836717e-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. APP PURINUSA EKAPERSADA', address: 'Jl. Ekapersada No. 88, Karawang', phone: '0267-5550113' },
      { id: 'b8367192-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. Adyaceda', address: 'Jl. Ceda Utama No. 4, Jakarta', phone: '021-5550114' },
      { id: 'b836719c-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. Alam Manis Indonesia', address: 'Jl. Manis Raya No. 6, Lampung', phone: '0721-5550115' },
      { id: 'b83671b0-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. Ares Kusuma Raya', address: 'Jl. Kusuma Bangsa No. 10, Jakarta', phone: '021-5550116' },
      { id: 'b83671c4-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. Aroma Indonesia Internasional', address: 'Jl. Aroma Wangi No. 2, Bogor', phone: '0251-5550117' },
      { id: 'b83671d8-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. Bungasari flour Mills Indonesia', address: 'Jl. Raya Flour No. 1, Cilegon', phone: '0254-5550118' },
      { id: 'b83671e2-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. Creasindo Megapratama', address: 'Jl. Mega Pratama No. 9, Jakarta', phone: '021-5550119' },
      { id: 'b83671f6-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. Duta Sugar International', address: 'Jl. Gula Manis No. 55, Jakarta', phone: '021-5550120' },
      { id: 'b8367214-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. Dwimitra Semerbak Artamulia', address: 'Jl. Semerbak No. 33, Tangerang', phone: '021-5550121' },
      { id: 'b836721e-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. Hardjawahyu Lestari', address: 'Jl. Wahyu No. 77, Surabaya', phone: '031-5550122' },
      { id: 'b8367232-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. Jaya Fermex', address: 'Jl. Fermex Indah No. 14, Jakarta', phone: '021-5550123' },
      { id: 'b8367246-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. Jutarasa Abadi', address: 'Jl. Rasa Sayang No. 21, Bandung', phone: '022-5550124' },
      { id: 'b8367250-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. Karacoco Nucifera Pratama', address: 'Jl. Kelapa Dua No. 5, Manado', phone: '0431-5550125' },
      { id: 'b8367264-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. Lesaffre Sari Nusa', address: 'Jl. Sari Nusa No. 8, Jakarta', phone: '021-5550126' },
      { id: 'b836726e-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. Manunggal Perkasa', address: 'Jl. Perkasa No. 1, Cilacap', phone: '0282-5550127' },
      { id: 'b8367282-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. Matahariraya Kimiatama', address: 'Jl. Matahari No. 12, Jakarta', phone: '021-5550128' },
      { id: 'b836728c-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. Mulia Raya Agrijaya', address: 'Jl. Agrijaya No. 3, Medan', phone: '061-5550129' },
      { id: 'b83672a0-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. Putra Abtar Mandiri', address: 'Jl. Mandiri Raya No. 4, Jakarta', phone: '021-5550130' },
      { id: 'b83672b4-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. SMART TBK', address: 'Jl. Sinar Mas No. 1, Jakarta', phone: '021-5550131' },
      { id: 'b83672be-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. Saf Indonusa', address: 'Jl. Indonusa No. 9, Jakarta', phone: '021-5550132' },
      { id: 'b83672d2-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. Sakura Prima Jaya Lestari', address: 'Jl. Sakura No. 15, Jepang', phone: '021-5550133' },
      { id: 'b83672f0-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. Sarana Prima Nusantara', address: 'Jl. Prima No. 2, Semarang', phone: '024-5550134' },
      { id: 'b83672fa-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. Sentra Usahatama Jaya', address: 'Jl. Usaha Jaya No. 6, Surabaya', phone: '031-5550135' },
      { id: 'b836730e-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. Sukses Andalan Global', address: 'Jl. Global No. 10, Jakarta', phone: '021-5550136' },
      { id: 'b8367318-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. Sungai Budi Grup', address: 'Jl. Sungai Budi No. 1, Lampung', phone: '0721-5550137' },
      { id: 'b836732c-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. TRISA LIKUID FARMA', address: 'Jl. Farmasi No. 7, Bandung', phone: '022-5550138' },
      { id: 'b8367336-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. Talaga Unggas Bahagia', address: 'Jl. Unggas No. 8, Cirebon', phone: '0231-5550139' },
      { id: 'b836734a-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. United Chemical Inter Aneka', address: 'Jl. Inter Aneka No. 5, Jakarta', phone: '021-5550140' },
      { id: 'b8367368-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. Yahe Internasional Indonesia', address: 'Jl. Internasional No. 88, Jakarta', phone: '021-5550141' },
      { id: 'b8367372-f52f-11f0-bff1-221aaedcbe0c', name: 'Toko Berkah Jaya', address: 'Jl. Pasar Baru No. 10, Jakarta', phone: '021-5550142' }
    ],
    skipDuplicates: true
  })

  // 5. MATERIAL & HISTORY (D & S)
  
  // Terigu
  const terigu = await prisma.material.create({
    data: {
      name: 'Terigu Golden Crown',
      unit: 'Kg',
      category: MaterialCategory.BAHAN_BAKU,
      pricePerUnit: 10320,
      stock: 4000,
      existingHoldCost: 324000000, 
      eoqBiayaPesan: 140785583,
      storageId: stgTerigu.id,
      supplierId: 'b835a9c4-f52f-11f0-bff1-221aaedcbe0c'
    }
  })
  // History Excel
  await prisma.ordering.create({
    data: {
      materialId: terigu.id,
      period: 'April - September 2025', // String biasa
      amount: 724075,
      frequency: 72,
      price: 10136562000
    }
  })

  // Gula
  const gula = await prisma.material.create({
    data: {
      name: 'Gula Rafinasi Grade B',
      unit: 'Kg',
      category: MaterialCategory.BAHAN_BAKU,
      pricePerUnit: 7200,
      stock: 2000,
      existingHoldCost: 216000000,
      eoqBiayaPesan: 120030000,
      storageId: stgGula.id,
      supplierId: 'b8364b9a-f52f-11f0-bff1-221aaedcbe0c'
    }
  })
  await prisma.ordering.create({
    data: {
      materialId: gula.id,
      period: 'April - September 2025',
      amount: 362500,
      frequency: 30,
      price: 3600900000
    }
  })

  console.log('✅ Seeding Selesai.')
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })
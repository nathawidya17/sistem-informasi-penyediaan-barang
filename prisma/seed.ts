import { PrismaClient, Role, RequestStatus, Material_satuan } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Memulai Seeding Database...')

  // 1. BERSIHKAN DATA LAMA
  // Urutan delete penting untuk menghindari error Foreign Key
  await prisma.orderItem.deleteMany()
  await prisma.requestItem.deleteMany()
  await prisma.transaction.deleteMany()
  await prisma.purchaseOrder.deleteMany()
  await prisma.purchaseRequest.deleteMany()
  await prisma.material.deleteMany()
  await prisma.supplier.deleteMany()
  await prisma.user.deleteMany()

  console.log('🧹 Database dibersihkan.')

  // 2. BUAT USER (Menggunakan Enum Role)
  await prisma.user.createMany({
    data: [
      {
        username: 'gudang',
        password: '123',
        role: Role.GUDANG
      },
      {
        username: 'purchasing',
        password: '123',
        role: Role.PURCHASING
      },
      {
        username: 'manajer',
        password: '123',
        role: Role.MANAJER
      }
    ]
  })
  console.log('👤 3 User dibuat (Gudang, Purchasing, Manajer).')

  // 3. BUAT SUPPLIERS (Data Lengkap)
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
      { id: 'b83672d2-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. Sakura Prima Jaya Lestari', address: 'Jl. Sakura No. 15, Jepang (Dummy)', phone: '021-5550133' },
      { id: 'b83672f0-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. Sarana Prima Nusantara', address: 'Jl. Prima No. 2, Semarang', phone: '024-5550134' },
      { id: 'b83672fa-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. Sentra Usahatama Jaya', address: 'Jl. Usaha Jaya No. 6, Surabaya', phone: '031-5550135' },
      { id: 'b836730e-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. Sukses Andalan Global', address: 'Jl. Global No. 10, Jakarta', phone: '021-5550136' },
      { id: 'b8367318-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. Sungai Budi Grup', address: 'Jl. Sungai Budi No. 1, Lampung', phone: '0721-5550137' },
      { id: 'b836732c-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. TRISA LIKUID FARMA', address: 'Jl. Farmasi No. 7, Bandung', phone: '022-5550138' },
      { id: 'b8367336-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. Talaga Unggas Bahagia', address: 'Jl. Unggas No. 8, Cirebon', phone: '0231-5550139' },
      { id: 'b836734a-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. United Chemical Inter Aneka', address: 'Jl. Inter Aneka No. 5, Jakarta', phone: '021-5550140' },
      { id: 'b8367368-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. Yahe Internasional Indonesia', address: 'Jl. Internasional No. 88, Jakarta', phone: '021-5550141' },
      { id: 'b8367372-f52f-11f0-bff1-221aaedcbe0c', name: 'Toko Berkah Jaya', address: 'Jl. Pasar Baru No. 10, Jakarta', phone: '021-5550142' }
    ]
  })
  console.log('🏭 42 Supplier dibuat.')

  // 4. BUAT MATERIALS (Pakai Enum Material_satuan)
  await prisma.material.createMany({
    data: [
      {
        id: '1',
        name: 'Terigu Golden Crown',
        satuan: Material_satuan.KG, // Menggunakan Enum
        pricePerUnit: 10320,
        stock: 4000,
        eoqBiayaPesan: 140785583,
        eoqBiayaSimpan: 447.47,
        existingHoldCost: 324000000,
        existingFreq: 72,
        supplierId: 'b83671d8-f52f-11f0-bff1-221aaedcbe0c' // PT. Bungasari
      },
      {
        id: '2',
        name: 'Gula Rafinasi Grade B',
        satuan: Material_satuan.KG, // Menggunakan Enum
        pricePerUnit: 7200,
        stock: 2000,
        eoqBiayaPesan: 120030000,
        eoqBiayaSimpan: 595.86,
        existingHoldCost: 216000000,
        existingFreq: 30,
        supplierId: 'b83672fa-f52f-11f0-bff1-221aaedcbe0c' // PT. Sentra Usahatama
      }
    ]
  })
  console.log('📦 2 Material dibuat.')

  // 5. BUAT TRANSAKSI HISTORY
  await prisma.transaction.createMany({
    data: [
      {
        id: '761e76e2-9542-4a45-a803-ec7171d26971',
        type: 'IN',
        quantity: 1000,
        materialId: '1',
        dateIn: new Date('2026-01-18')
      },
      {
        id: 'b9ac4633-f614-4696-9483-62e3e8dc082f',
        type: 'OUT',
        quantity: 1000,
        materialId: '2',
        dateOut: new Date('2026-01-18')
      }
    ]
  })
  console.log('📝 Transaksi history dibuat.')

  // 6. BUAT SPP (REQUEST) - Menggunakan Enum RequestStatus
  
  // SPP 1
  await prisma.purchaseRequest.create({
    data: {
      id: '4ae63a88-ecb6-4222-861a-b80b0c343cd8',
      code: 'SPP-20260119-574',
      status: RequestStatus.PENDING, // Menggunakan Enum
      note: 'Stock menipis',
      items: {
        create: [
          {
            id: '0579b093-797a-41e3-9275-9a696b17e65b',
            materialId: '2', 
            quantity: 5000,
            satuan: 'KG'
          },
          {
            id: '1ee2e018-f962-4d29-b7d5-031586ab1b2d',
            materialId: '1', 
            quantity: 1000,
            satuan: 'KG'
          }
        ]
      }
    }
  })

  // SPP 2
  await prisma.purchaseRequest.create({
    data: {
      id: 'f1e9320d-6bb1-4ccb-9574-81e6c4dd7fca',
      code: 'SPP-20260119-146',
      status: RequestStatus.PENDING, // Menggunakan Enum
      note: 'beak', 
      items: {
        create: [
          {
            id: 'cfb46a4b-9525-47b5-b1a1-d356797fa10e',
            materialId: '2', 
            quantity: 10000,
            satuan: 'KG'
          },
          {
            id: 'd429c3b3-bf21-405b-89d0-748f27bbb8f7',
            materialId: '1', 
            quantity: 50000,
            satuan: 'KG'
          }
        ]
      }
    }
  })

  console.log('📑 2 SPP dibuat.')
  console.log('✅ SEEDING SELESAI!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
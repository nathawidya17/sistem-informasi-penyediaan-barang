import { PrismaClient, Role, MaterialCategory, StorageType } from '@prisma/client'

const prisma = new PrismaClient()

// --- 1. CONFIG BIAYA GUDANG (Sesuai SQL Dump) ---
const STORAGE_COSTS: Record<string, number> = {
  'dc2ae8d7-c2dc-4d62-943b-8c7695e72a0a': 720000000, // Dry Storage
  'f5c72fcc-8c96-4648-8e8f-fad4790217ba': 420522931, // Cold Storage
  '8da20dfe-7fca-475d-b185-b540c7a4fc32': 640394721, // Liquid Storage
  'b34f679f-3e3d-4cfe-8892-5ebb350c9f26': 37508256,  // Chemical Storage
  'ff4c12f9-6349-4416-bae4-1c46d3f3516c': 12056038,  // Frozen Storage
  'de6eb857-d936-410f-b998-7eb4fa08e976': 351445719, // General Storage
}

// --- 2. TARGET ALOKASI BIAYA (Rupiah) DARI EXCEL ---
// Ini adalah nilai 'Biaya Penyimpanan Bahan Baku' (Kolom F di Excel)
// Kita gunakan ini untuk reverse-engineer persentase agar H akurat.
const MATERIAL_ALLOCATIONS: Record<string, number> = {
  "Terigu Golden Crown": 324000000,
  "Gula Rafinasi Grade B": 216000000,
  "NZMP Whole Milk Powder": 180000000,
  "Terigu kantil": 457587920.5,
  "Gula R2": 457587920.5,
  "Garam Refina": 228793960.3,
  "SKM Indomilk/ Krimer Kental Manis Plain Indomilk": 228793960.3,
  "Five Stars": 274552752.3,
  "Grandairy Susu UHT/ Grand Diary Full Cream Milk": 42052293.18,
  "Glucose Syrup 75 %": 96059208.18,
  "KARTON": 298728861.2,
  "PLASTIK": 52716857.85,
}

// Helper untuk menghitung Persentase yang Pas
const getAdjustedPercentage = (materialName: string, storageId: string, defaultPct: number) => {
  const targetAllocation = MATERIAL_ALLOCATIONS[materialName]
  const baseCost = STORAGE_COSTS[storageId]

  if (targetAllocation && baseCost) {
    // Rumus: Persentase = Target Rupiah / Biaya Gudang
    return targetAllocation / baseCost
  }
  return defaultPct // Fallback jika data tidak ada di list alokasi
}

async function main() {
  console.log('🔄 Memulai Seeding: Restore Data + Kalibrasi H (Excel Match)...')

  // 1. CLEANUP
  try {
    await prisma.transaction.deleteMany()
    await prisma.ordering.deleteMany()
    await prisma.orderItem.deleteMany()
    await prisma.requestItem.deleteMany()
    await prisma.purchaseOrder.deleteMany()
    await prisma.purchaseRequest.deleteMany()
    await prisma.material.deleteMany()
    await prisma.storage.deleteMany()
    await prisma.supplier.deleteMany()
    await prisma.user.deleteMany()
  } catch (e) {
    console.log('⚠️ Database bersih/baru.')
  }

  // 2. USER
  await prisma.user.createMany({
    data: [
      { id: '9031f27e-15ae-4c5e-b42b-f56aff2e87c7', username: 'manajer', password: '123', role: Role.MANAJER, createdAt: new Date('2026-02-01T09:14:00.626Z') },
      { id: 'bf4bd5e6-9897-4f20-8843-3d88d29a0f1d', username: 'purchasing', password: '123', role: Role.PURCHASING, createdAt: new Date('2026-02-01T09:14:00.626Z') },
      { id: 'cf9f5b20-682d-48b3-9231-6b6a39df82ed', username: 'gudang', password: '123', role: Role.GUDANG, createdAt: new Date('2026-02-01T09:14:00.626Z') },
    ]
  })

  // 3. STORAGE (Biaya Sesuai DB)
  await prisma.storage.createMany({
    data: [
      { id: '8da20dfe-7fca-475d-b185-b540c7a4fc32', name: 'Liquid Storage', type: StorageType.LIQUID_STORAGE, operatingCost: 640394721 },
      { id: 'b34f679f-3e3d-4cfe-8892-5ebb350c9f26', name: 'Chemical Storage', type: StorageType.CHEMICAL_STORAGE, operatingCost: 37508256 },
      { id: 'dc2ae8d7-c2dc-4d62-943b-8c7695e72a0a', name: 'Dry Storage', type: StorageType.DRY_STORAGE, operatingCost: 720000000 },
      { id: 'de6eb857-d936-410f-b998-7eb4fa08e976', name: 'General Storage', type: StorageType.GENERAL_STORAGE, operatingCost: 351445719 },
      { id: 'f5c72fcc-8c96-4648-8e8f-fad4790217ba', name: 'Cold Storage', type: StorageType.COLD_STORAGE, operatingCost: 420522931 },
      { id: 'ff4c12f9-6349-4416-bae4-1c46d3f3516c', name: 'Frozen Storage', type: StorageType.FROZEN_STORAGE, operatingCost: 12056038 },
    ]
  })

  // 4. SUPPLIER
  await prisma.supplier.createMany({
    data: [
      { id: 'b835a9c4-f52f-11f0-bff1-221aaedcbe0c', name: 'Bakels ( Malaysia ) SDN BHD' },
      { id: 'b8364b9a-f52f-11f0-bff1-221aaedcbe0c', name: 'Bakels Bhangsheng Food Ingredients' },
      { id: 'b83668c8-f52f-11f0-bff1-221aaedcbe0c', name: 'CV. FA Chemical' },
      { id: 'b83668e6-f52f-11f0-bff1-221aaedcbe0c', name: 'CV. Garuda Mas Lestari' },
      { id: 'b83668fa-f52f-11f0-bff1-221aaedcbe0c', name: 'CV. Sasana Aneka Pangan' },
      { id: 'b836690e-f52f-11f0-bff1-221aaedcbe0c', name: 'CV. Standard Food Globalindo' },
      { id: 'b8366954-f52f-11f0-bff1-221aaedcbe0c', name: 'CV. Sukses Pangan Abadi' },
      { id: 'b836695e-f52f-11f0-bff1-221aaedcbe0c', name: 'Cargill Bio- Chemicals Co,. Ltd' },
      { id: 'b836711a-f52f-11f0-bff1-221aaedcbe0c', name: 'Hens Chemicalindo' },
      { id: 'b8367142-f52f-11f0-bff1-221aaedcbe0c', name: 'Mutiara Ihsan' },
      { id: 'b8367156-f52f-11f0-bff1-221aaedcbe0c', name: 'PD. Satria' },
      { id: 'b836716a-f52f-11f0-bff1-221aaedcbe0c', name: 'PD. Sentosa' },
      { id: 'b836717e-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. APP PURINUSA EKAPERSADA' },
      { id: 'b8367192-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. Adyaceda' },
      { id: 'b836719c-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. Alam Manis Indonesia' },
      { id: 'b83671b0-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. Ares Kusuma Raya' },
      { id: 'b83671c4-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. Aroma Indonesia Internasional' },
      { id: 'b83671d8-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. Bungasari flour Mills Indonesia' },
      { id: 'b83671e2-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. Creasindo Megapratama' },
      { id: 'b83671f6-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. Duta Sugar International' },
      { id: 'b8367214-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. Dwimitra Semerbak Artamulia' },
      { id: 'b836721e-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. Hardjawahyu Lestari' },
      { id: 'b8367232-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. Jaya Fermex' },
      { id: 'b8367246-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. Jutarasa Abadi' },
      { id: 'b8367250-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. Karacoco Nucifera Pratama' },
      { id: 'b8367264-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. Lesaffre Sari Nusa' },
      { id: 'b836726e-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. Manunggal Perkasa' },
      { id: 'b8367282-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. Matahariraya Kimiatama' },
      { id: 'b836728c-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. Mulia Raya Agrijaya' },
      { id: 'b83672a0-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. Putra Abtar Mandiri' },
      { id: 'b83672b4-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. SMART TBK' },
      { id: 'b83672be-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. Saf Indonusa' },
      { id: 'b83672d2-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. Sakura Prima Jaya Lestari' },
      { id: 'b83672f0-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. Sarana Prima Nusantara' },
      { id: 'b83672fa-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. Sentra Usahatama Jaya' },
      { id: 'b836730e-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. Sukses Andalan Global' },
      { id: 'b8367318-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. Sungai Budi Grup' },
      { id: 'b836732c-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. TRISA LIKUID FARMA' },
      { id: 'b8367336-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. Talaga Unggas Bahagia' },
      { id: 'b836734a-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. United Chemical Inter Aneka' },
      { id: 'b8367368-f52f-11f0-bff1-221aaedcbe0c', name: 'PT. Yahe Internasional Indonesia' },
      { id: 'b8367372-f52f-11f0-bff1-221aaedcbe0c', name: 'Toko Berkah Jaya' },
    ]
  })

  // 5. MATERIAL (Persentase dikalibrasi)
  console.log('📦 Seeding Materials (Calibrated Percentages)...')
  
  await prisma.material.createMany({
    data: [
      { 
        id: '17802948-034b-48ba-adba-e1a26d1727f7', 
        name: 'Gula Rafinasi Grade B', 
        unit: 'Kg', pricePerUnit: 7200, stock: 1000, category: MaterialCategory.BAHAN_BAKU, 
        storageId: 'dc2ae8d7-c2dc-4d62-943b-8c7695e72a0a', supplierId: 'b83672fa-f52f-11f0-bff1-221aaedcbe0c',
        storagePercentage: getAdjustedPercentage('Gula Rafinasi Grade B', 'dc2ae8d7-c2dc-4d62-943b-8c7695e72a0a', 0.3)
      },
      { 
        id: '269daecc-9506-42a7-b9d0-21c82bb13828', 
        name: 'Garam Refina', 
        unit: 'Kg', pricePerUnit: 4120, stock: 1000, category: MaterialCategory.BAHAN_BAKU, 
        storageId: 'dc2ae8d7-c2dc-4d62-943b-8c7695e72a0a', supplierId: 'b83668fa-f52f-11f0-bff1-221aaedcbe0c',
        storagePercentage: getAdjustedPercentage('Garam Refina', 'dc2ae8d7-c2dc-4d62-943b-8c7695e72a0a', 0.01)
      },
      { 
        id: '2bcf55e8-9bdb-4ada-8488-f35522b04fb4', 
        name: 'Terigu kantil', 
        unit: 'Kg', pricePerUnit: 8294, stock: 1712850, category: MaterialCategory.BAHAN_BAKU, 
        storageId: 'dc2ae8d7-c2dc-4d62-943b-8c7695e72a0a', supplierId: 'b836726e-f52f-11f0-bff1-221aaedcbe0c',
        storagePercentage: getAdjustedPercentage('Terigu kantil', 'dc2ae8d7-c2dc-4d62-943b-8c7695e72a0a', 0.1)
      },
      { 
        id: '331318ee-f01e-4b3c-8928-7f082c63564b', 
        name: 'PLASTIK', 
        unit: 'Pcs', pricePerUnit: 1500, stock: 1000, category: MaterialCategory.BAHAN_PENOLONG, 
        storageId: 'de6eb857-d936-410f-b998-7eb4fa08e976', supplierId: 'b836717e-f52f-11f0-bff1-221aaedcbe0c',
        storagePercentage: getAdjustedPercentage('PLASTIK', 'de6eb857-d936-410f-b998-7eb4fa08e976', 0.15)
      },
      { 
        id: '3a28f890-c184-4ef9-a7e2-cb14fbf08bd8', 
        name: 'Terigu Golden Crown', 
        unit: 'Kg', pricePerUnit: 10320, stock: 1000, category: MaterialCategory.BAHAN_BAKU, 
        storageId: 'dc2ae8d7-c2dc-4d62-943b-8c7695e72a0a', supplierId: 'b83671d8-f52f-11f0-bff1-221aaedcbe0c',
        storagePercentage: getAdjustedPercentage('Terigu Golden Crown', 'dc2ae8d7-c2dc-4d62-943b-8c7695e72a0a', 0.45)
      },
      { 
        id: '411522a5-7dbe-47d2-8d2c-70fb6ac7d9c7', 
        name: 'NZMP Whole Milk Powder', 
        unit: 'Kg', pricePerUnit: 66840, stock: 1000, category: MaterialCategory.BAHAN_BAKU, 
        storageId: 'dc2ae8d7-c2dc-4d62-943b-8c7695e72a0a', supplierId: 'b83671c4-f52f-11f0-bff1-221aaedcbe0c',
        storagePercentage: getAdjustedPercentage('NZMP Whole Milk Powder', 'dc2ae8d7-c2dc-4d62-943b-8c7695e72a0a', 0.25)
      },
      { 
        id: '6c1db418-15ab-4136-99b3-02e8d315f45f', 
        name: 'SKM Indomilk/ Krimer Kental Manis Plain Indomilk', 
        unit: 'Kg', pricePerUnit: 27500, stock: 1000, category: MaterialCategory.BAHAN_BAKU, 
        storageId: 'dc2ae8d7-c2dc-4d62-943b-8c7695e72a0a', supplierId: 'b8367192-f52f-11f0-bff1-221aaedcbe0c',
        storagePercentage: getAdjustedPercentage('SKM Indomilk/ Krimer Kental Manis Plain Indomilk', 'dc2ae8d7-c2dc-4d62-943b-8c7695e72a0a', 0.01)
      },
      { 
        id: 'bc970ccb-15b8-4d8c-9c80-6be16b2425f0', 
        name: 'Five Stars', 
        unit: 'Kg', pricePerUnit: 12000, stock: 1000, category: MaterialCategory.BAHAN_BAKU, 
        storageId: 'dc2ae8d7-c2dc-4d62-943b-8c7695e72a0a', supplierId: 'b8367264-f52f-11f0-bff1-221aaedcbe0c',
        storagePercentage: getAdjustedPercentage('Five Stars', 'dc2ae8d7-c2dc-4d62-943b-8c7695e72a0a', 0.01)
      },
      { 
        id: 'c622d990-3fce-4d74-912c-94b60a479b74', 
        name: 'Grandairy Susu UHT/ Grand Diary Full Cream Milk', 
        unit: 'Liter', pricePerUnit: 16500, stock: 1000, category: MaterialCategory.BAHAN_BAKU, 
        storageId: 'f5c72fcc-8c96-4648-8e8f-fad4790217ba', supplierId: 'b836728c-f52f-11f0-bff1-221aaedcbe0c',
        storagePercentage: getAdjustedPercentage('Grandairy Susu UHT/ Grand Diary Full Cream Milk', 'f5c72fcc-8c96-4648-8e8f-fad4790217ba', 0.01)
      },
      { 
        id: 'd0e3fd45-941f-4a7a-838c-c9b3106d77b9', 
        name: 'Glucose Syrup 75 %', 
        unit: 'Kg', pricePerUnit: 8000, stock: 1000, category: MaterialCategory.BAHAN_BAKU, 
        storageId: '8da20dfe-7fca-475d-b185-b540c7a4fc32', supplierId: 'b836732c-f52f-11f0-bff1-221aaedcbe0c',
        storagePercentage: getAdjustedPercentage('Glucose Syrup 75 %', '8da20dfe-7fca-475d-b185-b540c7a4fc32', 0.01)
      },
      { 
        id: 'daf67635-89c4-4a51-9376-3ebf194963ce', 
        name: 'KARTON', 
        unit: 'Pcs', pricePerUnit: 3500, stock: 1000, category: MaterialCategory.BAHAN_PENOLONG, 
        storageId: 'de6eb857-d936-410f-b998-7eb4fa08e976', supplierId: 'b836717e-f52f-11f0-bff1-221aaedcbe0c',
        storagePercentage: getAdjustedPercentage('KARTON', 'de6eb857-d936-410f-b998-7eb4fa08e976', 0.85)
      },
      { 
        id: 'e35fdc9e-71e3-4565-8f18-d0b2eadcef59', 
        name: 'Gula R2', 
        unit: 'Kg', pricePerUnit: 8879, stock: 1000, category: MaterialCategory.BAHAN_BAKU, 
        storageId: 'dc2ae8d7-c2dc-4d62-943b-8c7695e72a0a', supplierId: 'b83671f6-f52f-11f0-bff1-221aaedcbe0c',
        storagePercentage: getAdjustedPercentage('Gula R2', 'dc2ae8d7-c2dc-4d62-943b-8c7695e72a0a', 0.01)
      },
    ]
  })

  // 6. ORDERING
  console.log('📋 Seeding Ordering...')
  await prisma.ordering.createMany({
    data: [
      { id: '145bb8b1-1f72-4433-9db8-ab2578e42739', materialId: 'daf67635-89c4-4a51-9376-3ebf194963ce', supplierId: 'b836717e-f52f-11f0-bff1-221aaedcbe0c', period: 'April - September 2025', amount: 758237, frequency: 30, price: 2653829500 },
      { id: '2dfbdaec-eb14-4cea-9e62-25a94a20878e', materialId: 'd0e3fd45-941f-4a7a-838c-c9b3106d77b9', supplierId: 'b836732c-f52f-11f0-bff1-221aaedcbe0c', period: 'April - September 2025', amount: 33675, frequency: 30, price: 269400000 },
      { id: '3e5e3dc1-68a7-43ec-ae8c-7f447c8e8581', materialId: 'c622d990-3fce-4d74-912c-94b60a479b74', supplierId: 'b836728c-f52f-11f0-bff1-221aaedcbe0c', period: 'April - September 2025', amount: 71988, frequency: 30, price: 1237330500 },
      { id: '3f9ef05d-f0fc-4fb7-a360-2c2f09d709cd', materialId: 'bc970ccb-15b8-4d8c-9c80-6be16b2425f0', supplierId: 'b8367264-f52f-11f0-bff1-221aaedcbe0c', period: 'April - September 2025', amount: 17990, frequency: 24, price: 284880000 },
      { id: '5c4b8ebc-6858-4df2-ab6f-150f956ea46e', materialId: '2bcf55e8-9bdb-4ada-8488-f35522b04fb4', supplierId: 'b836726e-f52f-11f0-bff1-221aaedcbe0c', period: 'April - September 2025', amount: 333150, frequency: 30, price: 4176858400 },
      { id: '7c9e8e67-9da3-4ab3-a870-ab6d86c9c19a', materialId: '269daecc-9506-42a7-b9d0-21c82bb13828', supplierId: 'b83668fa-f52f-11f0-bff1-221aaedcbe0c', period: 'April - September 2025', amount: 11500, frequency: 30, price: 94760000 },
      { id: '7eb5bf73-f312-4b9d-9a10-55654096f72d', materialId: '331318ee-f01e-4b3c-8928-7f082c63564b', supplierId: 'b836717e-f52f-11f0-bff1-221aaedcbe0c', period: 'April - September 2025', amount: 7701, frequency: 30, price: 11551500 },
      { id: 'b4f86365-4ca7-4ad9-8d85-2c666f1956f5', materialId: '411522a5-7dbe-47d2-8d2c-70fb6ac7d9c7', supplierId: 'b83671c4-f52f-11f0-bff1-221aaedcbe0c', period: 'April - September 2025', amount: 20075, frequency: 30, price: 2252508000 },
      { id: 'c9a2b86d-3530-463b-9e25-5c75c021aa7a', materialId: 'e35fdc9e-71e3-4565-8f18-d0b2eadcef59', supplierId: 'b83671f6-f52f-11f0-bff1-221aaedcbe0c', period: 'April - September 2025', amount: 4700, frequency: 5, price: 41731300 },
      { id: 'f1fe6797-e721-43c9-be75-2e7ee76e07f9', materialId: '17802948-034b-48ba-adba-e1a26d1727f7', supplierId: 'b83672fa-f52f-11f0-bff1-221aaedcbe0c', period: 'April - September 2025', amount: 362500, frequency: 30, price: 3962160000 },
      { id: 'f3ca0859-44fd-4c9b-a6d7-2a93eb9d8981', materialId: '3a28f890-c184-4ef9-a7e2-cb14fbf08bd8', supplierId: 'b83671d8-f52f-11f0-bff1-221aaedcbe0c', period: 'April - September 2025', amount: 724075, frequency: 30, price: 10133982000 },
      { id: 'fd2c7dce-30ed-4064-9fc5-ea0bbbf360b7', materialId: '6c1db418-15ab-4136-99b3-02e8d315f45f', supplierId: 'b8367192-f52f-11f0-bff1-221aaedcbe0c', period: 'April - September 2025', amount: 12340, frequency: 30, price: 660550000 },
    ]
  })

  // 7. TRANSACTION (Tanggal Mundur 2025)
  console.log('🔄 Seeding Transactions...')
  await prisma.transaction.createMany({
    data: [
      { id: '088e04ba-b069-4803-92aa-8c0125db525d', materialId: '2bcf55e8-9bdb-4ada-8488-f35522b04fb4', type: 'OUT', quantity: 74000, date: new Date('2025-09-17T00:00:00.000Z'), createdAt: new Date('2026-02-01T09:24:20.205Z'), note: null, storageId: null },
      { id: '122f4dba-a6f5-4992-9c75-6fe063598231', materialId: '2bcf55e8-9bdb-4ada-8488-f35522b04fb4', type: 'OUT', quantity: 44000, date: new Date('2025-05-15T00:00:00.000Z'), createdAt: new Date('2026-02-01T09:21:58.930Z'), note: null, storageId: null },
      { id: '1f988f61-8d52-4a8e-a41e-c1760599d79f', materialId: '2bcf55e8-9bdb-4ada-8488-f35522b04fb4', type: 'OUT', quantity: 57125, date: new Date('2025-06-24T00:00:00.000Z'), createdAt: new Date('2026-02-01T09:23:11.216Z'), note: null, storageId: null },
      { id: '2d7e2de2-0350-474e-a1e2-46c53fc19859', materialId: '2bcf55e8-9bdb-4ada-8488-f35522b04fb4', type: 'OUT', quantity: 70850, date: new Date('2025-07-10T00:00:00.000Z'), createdAt: new Date('2026-02-01T09:23:38.435Z'), note: null, storageId: null },
      { id: 'd8e2804a-6d7b-41ed-92bb-44697d741336', materialId: '2bcf55e8-9bdb-4ada-8488-f35522b04fb4', type: 'OUT', quantity: 87175, date: new Date('2025-08-12T00:00:00.000Z'), createdAt: new Date('2026-02-01T09:23:54.585Z'), note: null, storageId: null },
      { id: 'eb9067c9-9118-4170-84ab-087fac05f658', materialId: '2bcf55e8-9bdb-4ada-8488-f35522b04fb4', type: 'IN', quantity: 45000, date: new Date('2025-05-02T00:00:00.000Z'), createdAt: new Date('2026-02-01T09:21:40.337Z'), note: null, storageId: null },
      { id: 'f913920f-7c5d-4064-b990-bd0ab1186eb7', materialId: '2bcf55e8-9bdb-4ada-8488-f35522b04fb4', type: 'IN', quantity: 2000000, date: new Date('2025-06-02T00:00:00.000Z'), createdAt: new Date('2026-02-01T09:22:45.534Z'), note: null, storageId: null },
    ]
  })

  console.log('✅ Seeding Selesai (Data identik dengan SQL Dump + Fix Perhitungan).')
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })
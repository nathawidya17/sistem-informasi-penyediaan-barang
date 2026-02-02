'use server'

import { PrismaClient, MaterialCategory, StorageType, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

export type EOQFilter = {
  period?: string
  category?: string    
  storageType?: string 
}

export async function getEOQAnalysis(filter?: EOQFilter) {
  
  // 1. FILTER UMUM
  const materialWhere: Prisma.MaterialWhereInput = {}
  if (filter?.category && filter.category !== 'ALL') {
    materialWhere.category = filter.category as MaterialCategory
  }
  if (filter?.storageType && filter.storageType !== 'ALL') {
    materialWhere.storage = { type: filter.storageType as StorageType }
  }

  // 2. LOGIKA PERIODE (Fixed: Mundur 1 Bulan)
  // Contoh: User pilih "2025-10" (Oktober)
  // Kita ingin data Window: 1 April s/d 30 September
  
  const now = new Date()
  let targetDate = new Date(now.getFullYear(), now.getMonth(), 1) // Default bulan ini

  if (filter?.period) {
    const parts = filter.period.split('-')
    if (parts.length === 2) {
        const [year, month] = parts.map(Number)
        // targetDate = 1 Oktober 2025
        if (!isNaN(year) && !isNaN(month)) targetDate = new Date(year, month - 1, 1)
    }
  }

  // Window Akhir = Akhir bulan SEBELUMNYA (30 September 23:59)
  const windowEnd = new Date(targetDate)
  windowEnd.setDate(0) // setDate(0) otomatis mundur ke hari terakhir bulan lalu
  windowEnd.setHours(23, 59, 59, 999)
  
  // Window Awal = Mundur 6 bulan dari target (1 April 00:00)
  const windowStart = new Date(targetDate)
  windowStart.setMonth(windowStart.getMonth() - 6) 
  // (Bulan 10 - 6 = Bulan 4 alias April)

  // Validasi Tanggal
  if (isNaN(windowStart.getTime())) return []

  // 3. AMBIL DATA
  const materials = await prisma.material.findMany({
    where: materialWhere,
    include: {
      storage: true, 
      orderings: true, // History Pembelian (Untuk Hitung S)
      transactions: {  // History Pemakaian (Untuk Hitung D)
        where: {
          type: 'OUT',
          date: {
            gte: windowStart, // >= 1 April
            lte: windowEnd    // <= 30 September
          }
        }
      }
    },
    orderBy: { name: 'asc' }
  })

  const results = materials.map((m) => {
    
    // --- A. HITUNG D (Total Pemakaian periode April-September) ---
    const D = m.transactions.reduce((sum, t) => sum + t.quantity, 0)

    // --- B. HITUNG S (Biaya Pesan Rata-Rata) ---
    // S = Total Biaya Pesan / Total Frekuensi
    const totalOrderCost = m.orderings.reduce((sum, o) => sum + o.price, 0)
    const totalFreq = m.orderings.reduce((sum, o) => sum + o.frequency, 0)
    
    let S = 0
    if (totalFreq > 0) {
        S = totalOrderCost / totalFreq
    }

    // --- C. HITUNG H (Biaya Simpan per Unit) --- 
    // H = (Biaya Gudang Total * % Alokasi) / Total Demand
    // Ini memastikan H sama persis dengan Excel karena menggunakan pembagi D yang sama
    let H = 0
    const warehouseCost = m.storage?.operatingCost || 0
    const allocation = m.storagePercentage || 0
    
    // Total Rupiah yang dialokasikan untuk barang ini
    const allocatedRupiah = warehouseCost * allocation

    if (D > 0) {
       H = allocatedRupiah / D 
    } else {
       H = 0 
    }

    // --- D. RUMUS EOQ ---
    let Q_eoq = 0
    if (D > 0 && S > 0 && H > 0) {
        Q_eoq = Math.sqrt((2 * D * S) / H)
    }

    const Freq_eoq = Q_eoq > 0 ? D / Q_eoq : 0
    const OrderCost_EOQ = Freq_eoq * S
    const StorageCost_EOQ = (Q_eoq / 2) * H
    const Total_EOQ = OrderCost_EOQ + StorageCost_EOQ

    return {
      id: m.id, 
      name: m.name, 
      unit: m.unit, 
      storageName: m.storage?.name || "-", 
      category: m.category,
      
      D: D, 
      S: S, 
      H: H, 
      qEoq: Q_eoq, 
      freqEoq: Freq_eoq, 
      totalEoq: Total_EOQ
    }
  })

  // Filter: Hanya tampilkan yang ada transaksi
  return results.filter(r => r.D > 0)
}
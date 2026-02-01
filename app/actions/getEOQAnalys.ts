'use server'

import { PrismaClient, MaterialCategory, StorageType, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

export type EOQFilter = {
  period?: string
  category?: string    
  storageType?: string 
}

export async function getEOQAnalysis(filter?: EOQFilter) {
  
  // 1. Filter
  const materialWhere: Prisma.MaterialWhereInput = {}
  if (filter?.category && filter.category !== 'ALL') {
    materialWhere.category = filter.category as MaterialCategory
  }
  if (filter?.storageType && filter.storageType !== 'ALL') {
    materialWhere.storage = { type: filter.storageType as StorageType }
  }

  // 2. Window Waktu (6 Bulan)
  const now = new Date()
  let targetDate = new Date(now.getFullYear(), now.getMonth(), 1) 

  if (filter?.period) {
    const parts = filter.period.split('-')
    if (parts.length === 2) {
        const [year, month] = parts.map(Number)
        if (!isNaN(year) && !isNaN(month)) targetDate = new Date(year, month - 1, 1)
    }
  }

  const windowEnd = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0, 23, 59, 59)
  const windowStart = new Date(targetDate)
  windowStart.setMonth(windowStart.getMonth() - 5) 
  windowStart.setDate(1) 

  if (isNaN(windowStart.getTime())) return []

  // 3. Ambil Data (Include Storage untuk dapat OperatingCost)
  const materials = await prisma.material.findMany({
    where: materialWhere,
    include: {
      storage: true, 
      orderings: true, // Untuk hitung S
      transactions: {  // Untuk hitung D
        where: {
          type: 'OUT',
          date: { gte: windowStart, lte: windowEnd }
        }
      }
    },
    orderBy: { name: 'asc' }
  })

  const results = materials.map((m) => {
    
    // --- A. HITUNG D (DEMAND) ---
    const D = m.transactions.reduce((sum, t) => sum + t.quantity, 0)

    // --- B. HITUNG S (BIAYA PESAN) ---
    // Rumus: Total Biaya Order / Total Frekuensi
    const totalOrderCost = m.orderings.reduce((sum, o) => sum + o.price, 0)
    const totalFreq = m.orderings.reduce((sum, o) => sum + o.frequency, 0)
    
    let S = 0
    if (totalFreq > 0) {
        S = totalOrderCost / totalFreq
    }

    // --- C. HITUNG H (BIAYA SIMPAN) --- 
    // Rumus: (Biaya Gudang Total * Persentase Material) / D
    // Ini membuat H naik jika D turun (boros simpan), dan turun jika D naik (efisien).
    let H = 0
    const warehouseCost = m.storage?.operatingCost || 0
    const allocation = m.storagePercentage || 0
    const allocatedCost = warehouseCost * allocation

    if (D > 0) {
       H = allocatedCost / D 
    } else {
       // Fallback kalau D 0 (belum ada transaksi), pakai estimasi harga per unit gudang
       // atau 0 agar tidak error
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

  return results.filter(r => r.D > 0)
}
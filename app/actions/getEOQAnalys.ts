'use server'

import { PrismaClient, MaterialCategory, StorageType, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

export type EOQFilter = {
  period?: string
  category?: string    
  storageType?: string 
}

export async function getEOQAnalysis(filter?: EOQFilter) {
  
  // 1. Filter Material
  const materialWhere: Prisma.MaterialWhereInput = {}
  if (filter?.category && filter.category !== 'ALL') {
    materialWhere.category = filter.category as MaterialCategory
  }
  if (filter?.storageType && filter.storageType !== 'ALL') {
    materialWhere.storage = { type: filter.storageType as StorageType }
  }

  // 2. Filter Periode (Date Range)
  let dateFilter: any = undefined
  let orderingFilter: any = undefined

  if (filter?.period) {
    const isYYYYMM = filter.period.match(/^\d{4}-\d{2}$/)
    if (isYYYYMM) {
      const [year, month] = filter.period.split('-').map(Number)
      const startDate = new Date(year, month - 1, 1)
      const endDate = new Date(year, month, 0, 23, 59, 59) 
      
      // Filter untuk Transaksi Harian
      dateFilter = { gte: startDate, lte: endDate }
      
      // Filter untuk History (String Match)
      const monthName = startDate.toLocaleDateString('id-ID', { month: 'long' })
      orderingFilter = { contains: monthName }
    } else {
      orderingFilter = { contains: filter.period }
    }
  }

  const materials = await prisma.material.findMany({
    where: materialWhere,
    include: {
      storage: true, 
      orderings: { where: filter?.period ? { period: orderingFilter } : undefined },
      transactions: { where: dateFilter ? { date: dateFilter } : undefined }
    },
    orderBy: { name: 'asc' }
  })

  const results = materials.map((m) => {
    // --- STEP A: HITUNG DEMAND (D) ---
    const dHist = m.orderings.reduce((sum, o) => sum + o.amount, 0)
    // Transaksi OUT dihitung sebagai Demand
    const dReal = m.transactions.filter(t => t.type === 'OUT').reduce((sum, t) => sum + t.quantity, 0)
    
    const D = dHist + dReal

    // --- STEP B: HITUNG FREKUENSI (F) ---
    const fHist = m.orderings.reduce((sum, o) => sum + o.frequency, 0)
    // Transaksi IN dihitung sebagai Frekuensi Pembelian
    const fReal = m.transactions.filter(t => t.type === 'IN').length
    
    const Freq_Act = fHist + fReal

    // --- STEP C: HITUNG BIAYA PESAN (S) ---
    // Rumus S = Total Biaya Pesan / Total Frekuensi
    const cHist = m.orderings.reduce((sum, o) => sum + o.price, 0)
    
    let S = m.eoqBiayaPesan // Default jika tidak ada history
    if (fHist > 0) {
        S = cHist / fHist // Rata-rata biaya per pesan
    }

    // --- STEP D: HITUNG BIAYA SIMPAN (H) ---
    // Ambil dari Master Storage (Harga per Unit)
    const H = m.storage?.price || 0

    // --- STEP E: RUMUS EOQ (Q) ---
    // Q = Akar( 2 * D * S / H )
    let Q_eoq = 0
    if (H > 0 && D > 0 && S > 0) {
        Q_eoq = Math.sqrt((2 * D * S) / H)
    }

    // --- STEP F: TURUNAN ---
    const Freq_eoq = Q_eoq > 0 ? D / Q_eoq : 0
    
    // Total Biaya Aktual
    const OrderCost_Act = Freq_Act * S
    const StorageCost_Act = (Freq_Act > 0) ? (D / Freq_Act / 2) * H : 0
    const Total_Act = OrderCost_Act + StorageCost_Act

    // Total Biaya EOQ
    const OrderCost_EOQ = Freq_eoq * S
    const StorageCost_EOQ = (Q_eoq / 2) * H
    const Total_EOQ = OrderCost_EOQ + StorageCost_EOQ

    return {
      id: m.id, name: m.name, unit: m.unit, storageName: m.storage?.name || "-", category: m.category,
      D, S, H,
      freqAct: Freq_Act, totalAct: Total_Act,
      qEoq: Q_eoq, freqEoq: Freq_eoq, totalEoq: Total_EOQ,
      savings: Total_Act - Total_EOQ
    }
  })

  // Filter: Hanya tampilkan yang ada Demand
  return results.filter(r => r.D > 0)
}
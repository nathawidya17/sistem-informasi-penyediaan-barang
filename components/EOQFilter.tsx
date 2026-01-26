'use client'

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function EoqFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Default Value: Bulan sekarang / Filter kosong
  const [month, setMonth] = useState(searchParams.get("month") || new Date().getMonth().toString())
  const [year, setYear] = useState(searchParams.get("year") || new Date().getFullYear().toString())
  const [category, setCategory] = useState(searchParams.get("category") || "BAHAN_BAKU")
  const [storage, setStorage] = useState(searchParams.get("storage") || "GENERAL_STORAGE")

  const handleFilter = () => {
    // Update URL dengan parameter baru
    router.push(`/dashboard/eoq?month=${month}&year=${year}&category=${category}&storage=${storage}`)
  }

  return (
    <Card className="mb-6">
      <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        
        {/* 1. Pilih Bulan */}
        <div className="space-y-2">
          <Label>Bulan</Label>
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => (
                <SelectItem key={i} value={i.toString()}>
                  {new Date(0, i).toLocaleString('id-ID', { month: 'long' })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 2. Pilih Tahun (Minimal 2025) */}
        <div className="space-y-2">
          <Label>Tahun</Label>
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2026">2026</SelectItem>
              <SelectItem value="2027">2027</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 3. Kategori */}
        <div className="space-y-2">
          <Label>Kategori</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="BAHAN_BAKU">Bahan Baku</SelectItem>
              <SelectItem value="BAHAN_PENOLONG">Bahan Penolong</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 4. Tipe Gudang */}
        <div className="space-y-2">
          <Label>Tipe Gudang</Label>
          <Select value={storage} onValueChange={setStorage}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="DRY_STORAGE">Dry Storage</SelectItem>
              <SelectItem value="COLD_STORAGE">Cold Storage</SelectItem>
              <SelectItem value="LIQUID_STORAGE">Liquid Storage</SelectItem>
              <SelectItem value="CHEMICAL_STORAGE">Chemical Storage</SelectItem>
              <SelectItem value="FROZEN_STORAGE">Frozen Storage</SelectItem>
              <SelectItem value="GENERAL_STORAGE">General Storage</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tombol Tampilkan */}
        <Button onClick={handleFilter} className="bg-blue-600 hover:bg-blue-700">
          Tampilkan Data
        </Button>

      </CardContent>
    </Card>
  )
}
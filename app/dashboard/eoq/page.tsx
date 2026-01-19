import EOQCalculator from "@/components/EOQCalculator"

export default function EOQPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Kalkulator EOQ</h2>
          <p className="text-muted-foreground">
            Sistem Perhitungan Pengoptimalan Persediaan Bahan Baku
          </p>
        </div>
      </div>
      
      <EOQCalculator />
    </div>
  )
}
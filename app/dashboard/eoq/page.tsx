import { getMaterials } from "@/app/actions/getMaterials";
import EOQForm from "@/app/dashboard/eoq/EOQForm";

export default async function EOQPage() {
  // Ambil data bahan baku dari database
  const materials = await getMaterials();

  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Kalkulator EOQ</h2>
        <p className="text-muted-foreground">
          Hitung Economic Order Quantity untuk menentukan jumlah pemesanan optimal.
        </p>
      </div>
      
      {/* Panggil Client Component yang berisi rumus */}
      <EOQForm materials={materials} />
    </div>
  );
}
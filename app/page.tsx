import { redirect } from 'next/navigation'

export default function Home() {
  // Langsung lempar user ke halaman Inventory
  redirect('/dashboard/inventory')
}
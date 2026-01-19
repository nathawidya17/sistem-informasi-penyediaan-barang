import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const session = request.cookies.get('user_session')?.value
  const path = request.nextUrl.pathname

  // 1. Jika belum login & coba akses dashboard -> Lempar ke Login
  if (!session && path.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 2. Jika sudah login & coba akses login -> Lempar ke Dashboard
  if (session && path === '/login') {
    return NextResponse.redirect(new URL('/dashboard/inventory', request.url))
  }

  // 3. CEK HAK AKSES PER ROLE
  if (session && path.startsWith('/dashboard')) {
    const user = JSON.parse(session)
    const role = user.role

    // -- ATURAN GUDANG --
    // Gudang TIDAK BOLEH akses: Suppliers dan EOQ
    // (Sekarang Gudang SUDAH BOLEH akses Requests/SPP, jadi dihapus dari daftar blokir)
    if (role === 'GUDANG') {
      if (path.includes('/suppliers') || path.includes('/eoq')) {
        return NextResponse.redirect(new URL('/dashboard/inventory', request.url))
      }
    }

    // -- ATURAN PURCHASING --
    // Purchasing TIDAK BOLEH akses: Transaksi Stok dan EOQ
    if (role === 'PURCHASING') {
      if (path.includes('/transactions') || path.includes('/eoq')) {
        return NextResponse.redirect(new URL('/dashboard/inventory', request.url))
      }
    }

    // -- ATURAN MANAJER --
    // Manajer TIDAK BOLEH akses: Transaksi Stok, Suppliers, Requests
    if (role === 'MANAJER') {
      if (path.includes('/transactions') || path.includes('/suppliers') || path.includes('/requests')) {
        return NextResponse.redirect(new URL('/dashboard/inventory', request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}
'use server'

import { PrismaClient } from "@prisma/client"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const prisma = new PrismaClient()

export async function loginAction(formData: FormData) {
  const username = formData.get("username") as string
  const password = formData.get("password") as string

  const user = await prisma.user.findUnique({
    where: { username }
  })

  // Cek user & password (plain text utk demo)
  if (!user || user.password !== password) {
    return { error: "Username atau Password salah!" }
  }

  const sessionData = JSON.stringify({
    id: user.id,
    username: user.username,
    role: user.role
  })

  // [PERBAIKAN] Tambahkan 'await' di sini karena cookies() adalah Promise
  const cookieStore = await cookies()
  
  cookieStore.set("user_session", sessionData, { 
    httpOnly: true, 
    path: "/",
    maxAge: 60 * 60 * 24 // 1 hari
  })

  redirect("/dashboard/inventory")
}

export async function logoutAction() {
  // [PERBAIKAN] Tambahkan 'await' di sini juga
  const cookieStore = await cookies()
  
  cookieStore.delete("user_session")
  redirect("/login")
}
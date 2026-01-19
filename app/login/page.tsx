'use client'

import { useState } from "react"
import { loginAction } from "@/app/actions/authActions"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Lock, User } from "lucide-react"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    setError("")
    
    const res = await loginAction(formData)
    if (res?.error) {
      setError(res.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <Card className="w-full max-w-sm shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
            <Lock className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-blue-900">Oojhi Admin</CardTitle>
          <CardDescription>Masukan akun sesuai divisi anda</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            
            <div className="space-y-2">
              <Label>Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input name="username" placeholder="Username" className="pl-9" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input name="password" type="password" placeholder="••••••" className="pl-9" required />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                {error}
              </div>
            )}

            <Button className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? "Masuk..." : "Login System"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createUser, updateUser } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import type { User } from ".prisma/client"

type FormErrors = {
  name?: string[]
  email?: string[]
  role?: string[]
  _form?: string
}

export function UserForm({ user }: { user?: User }) {
  const router = useRouter()
  const [errors, setErrors] = useState<FormErrors>({})
  const [role, setRole] = useState(user?.role || "user")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    setErrors({})

    // Asegurarse de que el rol seleccionado se incluya en el formData
    formData.set("role", role)

    try {
      const result = user?.id ? await updateUser(user.id, formData) : await createUser(formData)

      if (result?.error) {
        setErrors(result.error)
        setIsSubmitting(false)
      } else if (result?.success) {
        router.push("/users")
      }
    } catch (error) {
      console.error("Error en el formulario:", error)
      setErrors({ _form: "Ocurrió un error al procesar el formulario." })
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" name="name" defaultValue={user?.name || ""} placeholder="Nombre completo" required />
            {errors.name && <p className="text-sm text-red-500">{errors.name[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={user?.email || ""}
              placeholder="correo@ejemplo.com"
              required
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Rol</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Seleccionar rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">Usuario</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && <p className="text-sm text-red-500">{errors.role[0]}</p>}
          </div>

          {errors._form && <p className="text-sm text-red-500 font-medium">{errors._form}</p>}

          <div className="flex justify-end gap-4">
            <Link href="/users">
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : user ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

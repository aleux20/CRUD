"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createUser, updateUser } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import type { User } from "@prisma/client";

type FormErrors = {
  name?: string[];
  email?: string[];
  role?: string[];
  _form?: string;
};

export function UserForm({ user }: { user?: User }) {
  const router = useRouter();
  const [errors, setErrors] = useState<FormErrors>({});
  const [role, setRole] = useState<"user" | "admin" | "editor">(
    user?.role === "admin" || user?.role === "editor" ? user.role : "user"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setErrors({});
    formData.set("role", role);

    try {
      const result = user?.id
        ? await updateUser(user.id, formData)
        : await createUser(formData);

      if ("error" in result) {
        setErrors(result.error);
        setIsSubmitting(false);
      } else {
        router.push("/users");
      }
    } catch (error) {
      console.error("Error en el formulario:", error);
      setErrors({ _form: "Ocurrió un error al procesar el formulario." });
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>{user ? "Editar Usuario" : "Crear Nuevo Usuario"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleSubmit(formData);
          }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              name="name"
              defaultValue={user?.name || ""}
              placeholder="Nombre completo"
              required
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className="text-sm text-destructive flex items-center gap-1 mt-1">
                <AlertCircle className="h-4 w-4" />
                {errors.name[0]}
              </p>
            )}
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
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="text-sm text-destructive flex items-center gap-1 mt-1">
                <AlertCircle className="h-4 w-4" />
                {errors.email[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Rol</Label>
            <Select
              value={role}
              onValueChange={(value) => setRole(value as typeof role)}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Seleccionar rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">Usuario</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-destructive flex items-center gap-1 mt-1">
                <AlertCircle className="h-4 w-4" />
                {errors.role[0]}
              </p>
            )}
          </div>

          {errors._form && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-md flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm font-medium">{errors._form}</p>
            </div>
          )}

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
  );
}

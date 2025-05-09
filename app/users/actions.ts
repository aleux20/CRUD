"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import { z } from "zod"
import type { User } from "@prisma/client"

// Schema para validación de usuarios
const UserSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  role: z.string().default("user"),
})

export async function getUsers(): Promise<User[]> {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        created_at: "desc",
      },
    })
    return users
  } catch (error) {
    console.error("Error al obtener usuarios:", error)
    throw new Error("No se pudieron cargar los usuarios")
  }
}

export async function getUserById(id: number): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    })
    return user
  } catch (error) {
    console.error("Error al obtener usuario:", error)
    throw new Error("No se pudo cargar el usuario")
  }
}

export async function createUser(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const role = (formData.get("role") as string) || "user"

  // Validar datos
  const validatedFields = UserSchema.safeParse({
    name,
    email,
    role,
  })

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    }
  }

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        role,
      },
    })

    revalidatePath("/users")
    return { success: true }
  } catch (error) {
    console.error("Error al crear usuario:", error)
    return {
      error: {
        _form: "Error al crear el usuario. El email podría estar duplicado.",
      },
    }
  }
}

export async function updateUser(id: number, formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const role = (formData.get("role") as string) || "user"

  // Validar datos
  const validatedFields = UserSchema.safeParse({
    id,
    name,
    email,
    role,
  })

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    }
  }

  try {
    await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        role,
      },
    })

    revalidatePath("/users")
    return { success: true }
  } catch (error) {
    console.error("Error al actualizar usuario:", error)
    return {
      error: {
        _form: "Error al actualizar el usuario. El email podría estar duplicado.",
      },
    }
  }
}

export async function deleteUser(id: number) {
  try {
    await prisma.user.delete({
      where: { id },
    })

    revalidatePath("/users")
  } catch (error) {
    console.error("Error al eliminar usuario:", error)
    throw new Error("No se pudo eliminar el usuario")
  }
}

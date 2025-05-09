"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { z } from "zod";
import type { User } from "@prisma/client";

const UserSchema = z.object({
  name: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  role: z.string().default("user"),
});

// Tipo común de respuesta
export type ActionResult =
  | { success: true }
  | { error: Record<string, string | string[]> };

export async function getUsers(): Promise<User[]> {
  try {
    return await prisma.user.findMany({
      orderBy: { created_at: "desc" },
    });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    throw new Error("No se pudieron cargar los usuarios");
  }
}

export async function getUserById(id: number): Promise<User | null> {
  try {
    return await prisma.user.findUnique({ where: { id } });
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    throw new Error("No se pudo cargar el usuario");
  }
}

export async function createUser(formData: FormData): Promise<ActionResult> {
  const validated = UserSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    role: formData.get("role") ?? undefined,
  });

  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors };
  }

  try {
    await prisma.user.create({ data: validated.data });
    revalidatePath("/users");
    return { success: true };
  } catch (error) {
    console.error("Error al crear usuario:", error);
    return {
      error: {
        _form: "Error al crear el usuario. El email podría estar duplicado.",
      },
    };
  }
}

export async function updateUser(
  id: number,
  formData: FormData
): Promise<ActionResult> {
  const validated = UserSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    role: formData.get("role") ?? undefined,
  });

  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors };
  }

  try {
    await prisma.user.update({
      where: { id },
      data: validated.data,
    });
    revalidatePath("/users");
    return { success: true };
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    return {
      error: {
        _form:
          "Error al actualizar el usuario. El email podría estar duplicado.",
      },
    };
  }
}

export async function deleteUser(id: number) {
  try {
    await prisma.user.delete({ where: { id } });
    revalidatePath("/users");
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    throw new Error("No se pudo eliminar el usuario");
  }
}

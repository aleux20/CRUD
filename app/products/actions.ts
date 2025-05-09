"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { z } from "zod";
import type { Product } from "@prisma/client";

// Schema para validación de productos
const ProductSchema = z.object({
  id: z.number().optional(),
  name: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  description: z.string().optional().nullable(),
  price: z.coerce
    .number()
    .positive({ message: "El precio debe ser mayor que 0" }),
  stock: z.coerce
    .number()
    .int()
    .nonnegative({ message: "El stock no puede ser negativo" }),
  image_url: z.string().optional().nullable(),
});

// Función auxiliar para parsear datos del formulario
function parseFormData(formData: FormData) {
  return {
    name: formData.get("name") as string,
    description: (formData.get("description") as string) || null,
    price: Number.parseFloat(formData.get("price") as string),
    stock: Number.parseInt(formData.get("stock") as string),
    image_url: (formData.get("image_url") as string) || null,
  };
}

// Obtener todos los productos
export async function getProducts(): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        created_at: "desc",
      },
    });
    return products;
  } catch (error) {
    console.error("Error al obtener productos:", error);
    throw new Error("No se pudieron cargar los productos");
  }
}

// Obtener un producto por ID
export async function getProductById(id: number): Promise<Product | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });
    return product;
  } catch (error) {
    console.error("Error al obtener producto:", error);
    throw new Error("No se pudo cargar el producto");
  }
}

// Crear un producto
export async function createProduct(
  formData: FormData
): Promise<{ success: true } | { error: Record<string, string[] | string> }> {
  const data = parseFormData(formData);

  // Validación extra básica
  if (!data.name || isNaN(data.price) || isNaN(data.stock)) {
    return {
      error: {
        _form: "Campos requeridos inválidos.",
      },
    };
  }

  const validatedFields = ProductSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.product.create({
      data,
    });

    revalidatePath("/products");
    return { success: true };
  } catch (error) {
    console.error("Error al crear producto:", error);
    return {
      error: {
        _form: "Error al crear el producto.",
      },
    };
  }
}

// Actualizar un producto
export async function updateProduct(
  id: number,
  formData: FormData
): Promise<{ success: true } | { error: Record<string, string[] | string> }> {
  const data = parseFormData(formData);

  const validatedFields = ProductSchema.safeParse({
    ...data,
    id,
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.product.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date(),
      },
    });

    revalidatePath("/products");
    return { success: true };
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    return {
      error: {
        _form: "Error al actualizar el producto.",
      },
    };
  }
}

// Eliminar un producto
export async function deleteProduct(
  id: number
): Promise<{ success?: true; error?: { _form: string } }> {
  try {
    await prisma.product.delete({
      where: { id },
    });

    revalidatePath("/products");
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    return {
      error: {
        _form: "No se pudo eliminar el producto.",
      },
    };
  }
}

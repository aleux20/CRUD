"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createProduct, updateProduct } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import type { Product } from "@prisma/client";
import type { Decimal } from "@prisma/client/runtime/library";

type FormErrors = {
  name?: string[];
  description?: string[];
  price?: string[];
  stock?: string[];
  image_url?: string[];
  _form?: string;
};

type ActionResult = {
  success?: boolean;
  error?: FormErrors;
};

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Función para formatear el precio para el input
  function formatPriceForInput(
    price: Decimal | number | string | null | undefined
  ): string {
    if (price === null || price === undefined) return "";
    if (typeof price === "object" && "toString" in price)
      return price.toString();
    return String(price);
  }

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setErrors({});

    try {
      const result: ActionResult = product?.id
        ? await updateProduct(product.id, formData)
        : await createProduct(formData);

      if (result?.error) {
        setErrors(result.error);
        setIsSubmitting(false);
      } else if (result?.success) {
        router.push("/products");
      }
    } catch (error) {
      console.error("Error en el formulario:", error);
      setErrors({ _form: "Ocurrió un error al procesar el formulario." });
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Producto</Label>
            <Input
              id="name"
              name="name"
              defaultValue={product?.name || ""}
              placeholder="Nombre del producto"
              required
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={product?.description || ""}
              placeholder="Descripción del producto"
              rows={3}
              aria-invalid={!!errors.description}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description[0]}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="price">Precio</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                defaultValue={formatPriceForInput(product?.price)}
                placeholder="0.00"
                required
                aria-invalid={!!errors.price}
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                min="0"
                step="1"
                defaultValue={product?.stock || "0"}
                placeholder="0"
                required
                aria-invalid={!!errors.stock}
              />
              {errors.stock && (
                <p className="text-sm text-red-500">{errors.stock[0]}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">URL de Imagen</Label>
            <Input
              id="image_url"
              name="image_url"
              type="url"
              defaultValue={product?.image_url || ""}
              placeholder="https://ejemplo.com/imagen.jpg"
              aria-invalid={!!errors.image_url}
            />
            {errors.image_url && (
              <p className="text-sm text-red-500">{errors.image_url[0]}</p>
            )}
          </div>

          {errors._form && (
            <p className="text-sm text-red-500 font-medium">{errors._form}</p>
          )}

          <div className="flex justify-end gap-4">
            <Link href="/products">
              <Button variant="outline" type="button" disabled={isSubmitting}>
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : product ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

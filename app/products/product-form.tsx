"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createProduct, updateProduct } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
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
      const result = product?.id
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
      <CardHeader className="pb-3">
        <CardTitle>
          {product ? "Editar Producto" : "Crear Nuevo Producto"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Producto</Label>
            <Input
              id="name"
              name="name"
              defaultValue={product?.name || ""}
              placeholder="Nombre del producto"
              required
            />
            {errors.name && (
              <p className="text-sm text-destructive flex items-center gap-1 mt-1">
                <AlertCircle className="h-4 w-4" />
                {errors.name[0]}
              </p>
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
            />
            {errors.description && (
              <p className="text-sm text-destructive flex items-center gap-1 mt-1">
                <AlertCircle className="h-4 w-4" />
                {errors.description[0]}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="price">Precio</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={formatPriceForInput(product?.price)}
                  placeholder="0.00"
                  className="pl-7"
                  required
                />
              </div>
              {errors.price && (
                <p className="text-sm text-destructive flex items-center gap-1 mt-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.price[0]}
                </p>
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
              />
              {errors.stock && (
                <p className="text-sm text-destructive flex items-center gap-1 mt-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.stock[0]}
                </p>
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
            />
            {errors.image_url && (
              <p className="text-sm text-destructive flex items-center gap-1 mt-1">
                <AlertCircle className="h-4 w-4" />
                {errors.image_url[0]}
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
            <Link href="/products">
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" variant="secondary" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : product ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

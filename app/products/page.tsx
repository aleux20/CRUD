import Link from "next/link";
import { getProducts, deleteProduct } from "./actions";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, Pencil } from "lucide-react";
import type { Decimal } from "@prisma/client/runtime/library";
import DeleteButton from "@/components/deleteButton";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Productos</h1>
        <Link href="/products/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuevo Producto
          </Button>
        </Link>
      </div>

      <div className="bg-card rounded-lg shadow overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Última Actualización</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  No hay productos registrados
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id} className="hover:bg-muted/30">
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell className="font-medium">
                    ${formatPrice(product.price)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${Number(product.stock) > 20
                          ? "bg-success/20 text-success-foreground"
                          : Number(product.stock) > 5
                            ? "bg-warning/20 text-warning-foreground"
                            : "bg-destructive/20 text-destructive-foreground"
                        }`}
                    >
                      {product.stock} unidades
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(product.updated_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/products/${product.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <DeleteButton id={product.id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// Función para formatear el precio (Decimal de Prisma)
function formatPrice(price: Decimal | number | string): string {
  if (typeof price === "object" && price !== null && "toFixed" in price) {
    return price.toFixed(2);
  }
  if (typeof price === "number") {
    return price.toFixed(2);
  }
  return Number(price).toFixed(2);
}

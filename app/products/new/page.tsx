import { ProductForm } from "../product-form";

export default function NewProductPage() {
  return (
    <div className="container mx-auto py-6" aria-labelledby="new-product-heading">
      <h1 className="text-2xl font-bold mb-6">Crear Nuevo Producto</h1>
      <ProductForm />
    </div>
  );
}

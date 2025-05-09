import { ProductForm } from "../../product-form";
import { getProductById } from "../../actions";
import { notFound } from "next/navigation";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const productId = Number.parseInt(params.id);

  if (isNaN(productId)) {
    notFound();
  }

  const product = await getProductById(productId);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Editar Producto</h1>
      <ProductForm product={product} />
    </div>
  );
}

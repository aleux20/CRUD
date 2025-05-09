import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <main className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">
        Sistema CRUD de Usuarios y Productos
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gestión de Usuarios */}
        <Card>
          <CardHeader>
            <CardTitle>Gestión de Usuarios</CardTitle>
            <CardDescription>
              Crear, ver, actualizar y eliminar usuarios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <Button asChild className="w-full">
                <Link href="/users">Ver Usuarios</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/users/new">Crear Usuario</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Gestión de Productos */}
        <Card>
          <CardHeader>
            <CardTitle>Gestión de Productos</CardTitle>
            <CardDescription>
              Crear, ver, actualizar y eliminar productos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <Button asChild className="w-full">
                <Link href="/products">Ver Productos</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/products/new">Crear Producto</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

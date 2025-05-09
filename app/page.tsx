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
    <main className="container mx-auto py-10 min-h-[calc(100vh-5rem)]">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Sistema CRUD de Usuarios y Productos
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gestión de Usuarios */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Gestión de Usuarios</CardTitle>
            <CardDescription>
              Crear, ver, actualizar y eliminar usuarios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <Link href="/users">
                <Button variant="secondary" className="w-full text-white">
                  Ver Usuarios
                </Button>
              </Link>
              <Link href="/users/new">
                <Button variant="outline" className="w-full">
                  Crear Usuario
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Gestión de Productos */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Gestión de Productos</CardTitle>
            <CardDescription>
              Crear, ver, actualizar y eliminar productos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <Link href="/products">
                <Button variant="secondary" className="w-full text-white">
                  Ver Productos
                </Button>
              </Link>
              <Link href="/products/new">
                <Button variant="outline" className="w-full">
                  Crear Producto
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

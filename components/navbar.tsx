"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Package } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  const pathname = usePathname();

  const linkClasses = (href: string) =>
    `flex items-center px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ${pathname === href ? "bg-gray-200 dark:bg-gray-700 font-semibold" : ""
    }`;

  return (
    <nav
      className="bg-background border-b"
      aria-label="Barra de navegación principal"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center text-xl font-bold text-primary">
              <Home className="mr-2 h-6 w-6" />
              <span>CRUD App</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/users" className={linkClasses("/users")}>
              <Users className="mr-2 h-5 w-5" />
              <span>Usuarios</span>
            </Link>
            <Link href="/products" className={linkClasses("/products")}>
              <Package className="mr-2 h-5 w-5" />
              <span>Productos</span>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}

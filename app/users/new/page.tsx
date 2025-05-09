import { UserForm } from "../user-form"

export default function NewUserPage() {
  return (
    <div className="container mx-auto py-6" aria-labelledby="new-user-heading">
      <h1 className="text-2xl font-bold mb-6">Crear Nuevo Usuario</h1>
      <UserForm />
    </div>
  )
}

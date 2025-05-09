import { UserForm } from "../../user-form"
import { getUserById } from "../../actions"
import { notFound } from "next/navigation"

export default async function EditUserPage({ params }: { params: { id: string } }) {
  const userId = Number.parseInt(params.id)

  if (isNaN(userId)) {
    notFound()
  }

  const user = await getUserById(userId)

  if (!user) {
    notFound()
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Editar Usuario</h1>
      <UserForm user={user} />
    </div>
  )
}

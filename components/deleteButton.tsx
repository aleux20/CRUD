"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteProduct } from "@/app/products/actions";
import { useTransition } from "react";

type Props = {
    id: number;
};

export default function DeleteButton({ id }: Props) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        const confirmed = window.confirm(
            "¿Estás seguro de que deseas eliminar este producto?"
        );
        if (!confirmed) return;

        startTransition(() => {
            deleteProduct(id);
        });
    };

    return (
        <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isPending}
        >
            <Trash2 className="h-4 w-4" />
        </Button>
    );
}

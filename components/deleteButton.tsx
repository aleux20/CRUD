"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";

type Props = {
    id: number;
    onDelete: (id: number) => Promise<any>;
    confirmMessage?: string;
};

export default function DeleteButton({
    id,
    onDelete,
    confirmMessage = "¿Estás seguro de que deseas eliminar este usuario?",
}: Props) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        const confirmed = window.confirm(confirmMessage);
        if (!confirmed) return;

        startTransition(() => {
            onDelete(id);
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

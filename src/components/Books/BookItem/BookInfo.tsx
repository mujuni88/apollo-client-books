import { Button, Chip } from "@nextui-org/react";
import { PencilIcon, TrashIcon } from "lucide-react";
import React, { FormEvent } from "react";
import { Book } from "../../../lib/utils";
import { useDeleteBook } from "../../../hooks/books/useDeleteBook";

export const BookInfo: React.FC<Book & { onEdit: () => void }> = ({
  id,
  title,
  categories,
  onEdit,
}) => {
  const { deleteBook, loading } = useDeleteBook();

  const handleDelete = async (e: FormEvent) => {
    e.preventDefault();
    deleteBook({ id });
  };

  return (
    <form
      className="grid grid-cols-3 gap-2 items-center"
      onSubmit={handleDelete}
    >
      <p className="text-bold">{title}</p>
      <div className="text-bold flex flex-wrap gap-2 items-center">
        {(categories ?? []).map((c) => (
          <Chip key={c.id} color="primary" variant="faded">
            {c.name}
          </Chip>
        ))}
      </div>
      <div className="gap-3 flex flex-end items-center justify-end">
        <Button
          color={"default"}
          onClick={onEdit}
          disabled={loading}
          type="button"
          isIconOnly
          variant="light"
        >
          <PencilIcon size={16} />
        </Button>
        <Button
          color={"danger"}
          disabled={loading}
          type="submit"
          isIconOnly
          variant="light"
        >
          <TrashIcon size={16} />
        </Button>
      </div>
    </form>
  );
};

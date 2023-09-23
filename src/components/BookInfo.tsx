import { Reference, useMutation, gql } from "@apollo/client";
import { Button, Chip } from "@nextui-org/react";
import { PencilIcon, TrashIcon } from "lucide-react";
import React, { FormEvent } from "react";
import { BookProps, Category } from "../lib/book";
import { useToast } from "./ui/use-toast";

const DELETE_BOOK = gql`
  mutation DeleteBook($id: String!) {
    deleteBook(id: $id)
  }
`;

export const BookInfo: React.FC<BookProps & { onEdit: () => void }> = ({
  id,
  title,
  categories,
  onEdit,
}) => {
  const { toast } = useToast();
  const [deleteBook, { loading, error }] = useMutation(DELETE_BOOK);

  if (error) {
    toast({
      variant: "destructive",
      title: "Error deleting book",
    });
  }

  const handleDelete = async (e: FormEvent) => {
    e.preventDefault();
    deleteBook({
      variables: {
        id,
      },
      optimisticResponse: {
        deleteBook: true,
      },
      update(cache, { data }) {
        if (!data.deleteBook) return;

        cache.modify({
          fields: {
            books(existingBooks: Reference[], { readField }) {
              console.log("existingBooks", existingBooks);
              return existingBooks.filter(
                (bookRef) => readField("id", bookRef) !== id,
              );
            },
          },
        });
      },
    });
  };
  return (
    <form
      className="grid grid-cols-3 gap-2 items-center"
      onSubmit={handleDelete}
    >
      <p className="text-bold">{title}</p>
      <div className="text-bold flex flex-wrap gap-2 items-center">
        {(categories ?? []).map((c) => (
          <Chip key={c} color="primary" variant="faded">
            {Category[c]}
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

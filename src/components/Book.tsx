import { Reference, gql, useMutation } from "@apollo/client";
import { PencilIcon, TrashIcon } from "lucide-react";
import React, { FormEvent, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";

const UPDATE_BOOK = gql`
  mutation UpdateBook($id: String!, $title: String!) {
    updateBook(id: $id, title: $title) {
      id
      title
    }
  }
`;

const DELETE_BOOK = gql`
  mutation DeleteBook($id: String!) {
    deleteBook(id: $id)
  }
`;

export const Book: React.FC<Book> = ({ id, title }) => {
  const [edit, setEdit] = useState(false);

  return edit ? (
    <BookEditForm id={id} title={title} onFinish={() => setEdit(false)} />
  ) : (
    <BookInfo id={id} title={title} onEdit={() => setEdit(true)} />
  );
};

const BookEditForm: React.FC<Book & { onFinish: () => void }> = ({
  id,
  title,
  onFinish,
}) => {
  const { toast } = useToast();
  const [input, setInput] = useState(title);
  const [updateBook, { loading, error }] = useMutation(UPDATE_BOOK);

  if (error) {
    toast({
      variant: "destructive",
      title: "Error updating book",
    });
  }

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    await updateBook({
      variables: {
        id,
        title,
      },
      optimisticResponse: {
        updateBook: {
          __typename: "Book",
          id,
          title,
        },
      },
    });
    onFinish();
  };

  return (
    <form
      className="grid grid-cols-3 gap-2 items-center"
      onSubmit={handleUpdate}
    >
      <Input
        name="title"
        disabled={loading}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="col-span-2"
      />
      <div className="space-x-2 grid grid-cols-2">
        <Button type="submit" disabled={loading || !input}>
          Update
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            onFinish();
            setInput(title);
          }}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

const BookInfo: React.FC<Book & { onEdit: () => void }> = ({
  id,
  title,
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
      <p className="text-bold col-span-2">{title}</p>
      <div className="space-x-2 grid grid-cols-2">
        <Button variant={"secondary"} onClick={onEdit} disabled={loading} type='button'>
          <PencilIcon size={16} className="mr-2" />
          Edit
        </Button>
        <Button variant={"destructive"} disabled={loading} type="submit">
          <TrashIcon size={16} className="mr-2" />
          Delete
        </Button>
      </div>
    </form>
  );
};

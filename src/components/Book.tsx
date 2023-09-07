import React, { useState, FormEvent } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { PencilIcon, TrashIcon } from "lucide-react";
import { gql, useMutation } from "@apollo/client";
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
  const [updateBook, { loading, error }] = useMutation(UPDATE_BOOK);
  const [deleteBook, { loading:deleting, error: dErr }] = useMutation(DELETE_BOOK);

  const { toast } = useToast();

  if (error || dErr) {
    toast({
      variant: "destructive",
      title: "Error",
    });
  }


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title");
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
    setEdit(false);
  };

  const handleDelete = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    deleteBook({
      variables: {
        id
      },
      optimisticResponse: {
        deleteBook: true,
      }
    })
  }
  return (
      <div>
        {edit ? (
        <form className="grid grid-cols-3 gap-2 items-center" onSubmit={handleSubmit}>
          
            <Input name="title" disabled={loading} placeholder={title} className='col-span-2'/>
            <div className="space-x-2 grid grid-cols-2">
              <Button type="submit" disabled={loading}>
                Update
              </Button>
              <Button
                variant="outline"
                onClick={() => setEdit(false)}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <form className="grid grid-cols-3 gap-2 items-center" onSubmit={handleDelete}>
            <p className="text-bold col-span-2">{title}</p>
            <div>

            <Button variant={"secondary"} onClick={() => setEdit(true)} disabled={deleting}>
              <PencilIcon size={16} className='mr-2'/>
              Edit
            </Button>
            <Button type="submit" variant={"destructive"} disabled={deleting}>
            <TrashIcon size={16} className='mr-2'/>

                Delete
              </Button>
            </div>
          </form>
        )}
      </div>
  );
};

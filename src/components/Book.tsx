import React, { useState, FormEvent } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { PencilIcon } from "lucide-react";
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

export const Book: React.FC<Book> = ({ id, title }) => {
  const [edit, setEdit] = useState(false);
  const [updateBook, { loading, error }] = useMutation(UPDATE_BOOK);
  const { toast } = useToast();

  if (error) {
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
  return (
    <div className="">
      <form className="grid grid-cols-[1fr_auto] gap-2" onSubmit={handleSubmit}>
        {edit ? (
          <>
            <Input name="title" disabled={loading} />
            <div className="space-x-2">
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
          </>
        ) : (
          <>
            <p className="text-bold">{title}</p>
            <Button variant={"ghost"} onClick={() => setEdit(true)}>
              <PencilIcon />
            </Button>
          </>
        )}
      </form>
    </div>
  );
};

import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";

export const ADD_BOOK = gql`
  mutation addBook($title: String!) {
    addBook(title: $title) {
      id
      title
    }
  }
`;
export function AddBook() {
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [addBook] = useMutation(ADD_BOOK, {
    update(cache, { data: { addBook } }) {
      cache.modify({
        fields: {
          books(existingBooks = []) {
            const newBookRef = cache.writeFragment({
              data: addBook,
              fragment: gql`
                fragment NewBook on Book {
                  id
                  title
                }
              `,
            });
            return existingBooks.concat(newBookRef);
          },
        },
      });
    },
  });
  return (
    <div>
      <form
        className="grid grid-cols-[1fr_auto] gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          addBook({
            variables: { title: input },

            // Optimistically add the Book to the locally cached
            // list before the server responds
            optimisticResponse: {
              addBook: {
                id: "temp-id",
                __typename: "Book",
                title: input,
              },
            },
          });
          setInput("");
          toast({
            title: "Book added successfully",
          });
        }}
      >
        <Input value={input} onChange={(e) => setInput(e.target.value)} />
        <Button type="submit">Create Book</Button>
      </form>
    </div>
  );
}

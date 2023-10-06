import { useMutation, gql } from "@apollo/client";
import { Book } from "../lib/utils";
import { useToast } from "../components/ui/use-toast";

export const ADD_BOOK = gql`
  mutation addBook($title: String!, $categories: [Category]) {
    addBook(title: $title, categories: $categories) {
      id
      title
      categories {
        id
        name
      }
    }
  }
`;

type ReturnData = {
  addBook: Book & { __typename: "Book" };
};
type AddBookVars = Pick<Book, "title">;

export const useAddBook = () => {
  const { toast } = useToast();
  const [addBook, { loading }] = useMutation<ReturnData, AddBookVars>(
    ADD_BOOK,
    {
      onError() {
        toast({
          variant: "destructive",
          description: "Error adding book",
        });
      },
      update(cache, { data }) {
        if (!data?.addBook) return;

        cache.modify({
          fields: {
            books(existingBooks = [], { toReference }) {
              return existingBooks.concat(toReference(data.addBook));
            },
          },
        });
      },
    },
  );

  return {
    loading,
    addBook,
  };
};

import { useMutation, gql } from "@apollo/client";
import { Book, BookFilter, getParamsFromStoreFieldName } from "../../lib/utils";
import { toast } from "sonner";

type StoreParams = {
  filter?: BookFilter;
};
export const ADD_BOOK = gql`
  mutation addBook($title: String!, $categories: [CategoryInput]) {
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
type AddBookVars = Omit<Book, "id">;

export const useAddBook = () => {
  const [addBook, { loading }] = useMutation<ReturnData, AddBookVars>(
    ADD_BOOK,
    {
      onError() {
        toast.error("Error adding book");
      },

      onCompleted() {
        toast.success("Book added successfully");
      },

      update(cache, { data }) {
        if (!data?.addBook) return;

        cache.modify({
          fields: {
            books(existingBooks = [], { toReference, storeFieldName }) {
              const { filter } =
                (getParamsFromStoreFieldName(storeFieldName) as StoreParams) ||
                {};
              const doesMatch = (filter?.categoryIds ?? []).some(
                (cId) => data.addBook.categories?.some((c) => c.id === cId),
              );

              if (!filter?.categoryIds?.length || doesMatch) {
                return [...existingBooks, toReference(data.addBook)];
              } else {
                return existingBooks;
              }
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

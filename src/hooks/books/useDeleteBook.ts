import { Reference, gql, useMutation } from "@apollo/client";
import { toast } from "sonner";

const DELETE_BOOK = gql`
  mutation DeleteBook($id: String!) {
    deleteBook(id: $id)
  }
`;

export const useDeleteBook = () => {
  const [_deleteBook, { loading, error }] = useMutation(DELETE_BOOK, {
    onError() {
      toast.error("Error deleting book");
    },
    onCompleted() {
      toast.success("Book deleted successfully");
    },
  });

  const deleteBook = async ({ id }: { id: string }) => {
    _deleteBook({
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
        cache.evict({ id: `Book:${id}` });
        cache.gc();
      },
    });
  };
  return {
    loading,
    error,
    deleteBook,
  };
};

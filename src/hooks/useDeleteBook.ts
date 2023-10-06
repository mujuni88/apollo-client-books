import { Reference, gql, useMutation } from "@apollo/client";
import { useToast } from "../components/ui/use-toast";

const DELETE_BOOK = gql`
  mutation DeleteBook($id: String!) {
    deleteBook(id: $id)
  }
`;

export const useDeleteBook = () => {
  const { toast } = useToast();
  const [_deleteBook, { loading, error }] = useMutation(DELETE_BOOK, {
    onError() {
      toast({
        variant: "destructive",
        title: "Error deleting book",
      });
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
      },
    });
  };
  return {
    loading,
    error,
    deleteBook,
  };
};

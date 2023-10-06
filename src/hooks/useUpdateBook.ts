import { gql, useMutation } from "@apollo/client";
import { useToast } from "../components/ui/use-toast";
import { Category } from "../lib/utils";

const UPDATE_BOOK = gql`
  mutation UpdateBook(
    $id: String!
    $title: String!
    $categories: [CategoryInput]
  ) {
    updateBook(id: $id, title: $title, categories: $categories) {
      id
      title
      categories
    }
  }
`;

export const useUpdateBook = () => {
  const { toast } = useToast();
  const [_updateBook, { loading }] = useMutation(UPDATE_BOOK, {
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error updating book",
      });
    },
    onCompleted() {
      toast({
        variant: "default",
        title: "Book updated successfully",
      });
    },
  });

  const updateBook = async ({
    id,
    title,
    categories,
  }: {
    id: string;
    title: string;
    categories: Category[];
  }) => {
    await _updateBook({
      variables: {
        id,
        title,
        categories: Array.from(categories),
      },
      optimisticResponse: {
        updateBook: {
          __typename: "Book",
          id,
          title,
          categories: Array.from(categories),
        },
      },
    });
  };

  return {
    updateBook,
    loading,
  };
};
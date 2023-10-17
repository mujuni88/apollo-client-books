import { gql, useMutation } from "@apollo/client";
import { toast } from "sonner";
import { Category } from "../../lib/utils";

const UPDATE_BOOK = gql`
  mutation UpdateBook(
    $id: String!
    $title: String!
    $categories: [CategoryInput]
  ) {
    updateBook(id: $id, title: $title, categories: $categories) {
      id
      title
      categories {
        id
        name
      }
    }
  }
`;

export const useUpdateBook = () => {
  const [_updateBook, { loading }] = useMutation(UPDATE_BOOK, {
    onError: () => {
      toast("Error updating book");
    },
    onCompleted() {
      toast.success("Book updated successfully");
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

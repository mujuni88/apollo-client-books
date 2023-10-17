import { gql, useQuery } from "@apollo/client";
import { Book } from "../../lib/utils";
import { toast } from "sonner";

const GET_BOOK = gql`
  query getBook($id: String!) {
    book(id: $id) {
      id
      title
      categories {
        id
        name
      }
    }
  }
`;

export const useGetBook = (id: string) => {
  const { loading, error, data } = useQuery<{ book: Book[] }, { id: string }>(
    GET_BOOK,
    {
      variables: {
        id,
      },
      onError() {
        toast.error("Error fetching book");
      },
    },
  );

  return {
    loading,
    error,
    book: data?.book ?? [],
  };
};

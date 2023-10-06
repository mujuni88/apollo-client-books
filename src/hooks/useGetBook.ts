import { gql, useQuery } from "@apollo/client";
import { Book } from "../lib/utils";
import { useToast } from "../components/ui/use-toast";

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
  const { toast } = useToast();
  const { loading, error, data } = useQuery<{ book: Book[] }, { id: string }>(
    GET_BOOK,
    {
      variables: {
        id,
      },
      onError() {
        toast({
          variant: "destructive",
          title: "Error fetching book",
        });
      },
    },
  );

  return {
    loading,
    error,
    book: data?.book ?? [],
  };
};

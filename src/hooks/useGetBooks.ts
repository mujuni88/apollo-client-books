import { gql, useQuery } from "@apollo/client";
import { Book, BookFilter } from "../lib/utils";
import { useToast } from "../components/ui/use-toast";

const GET_BOOKS = gql`
  query getBooks($filter: BookFilter) {
    books(filter: $filter) {
      id
      title
      categories {
        id
        name
      }
    }
  }
`;

export const useGetBooks = (filter?: BookFilter) => {
  const { toast } = useToast();
  const { loading, error, data } = useQuery<
    { books: Book[] },
    { filter?: BookFilter }
  >(GET_BOOKS, {
    variables: {
      filter,
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error fetching books",
      });
    },
  });

  return {
    loading,
    error,
    books: data?.books ?? [],
  };
};

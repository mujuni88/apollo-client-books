import { gql, useQuery } from "@apollo/client";
import { Book, BookFilter } from "../../lib/utils";
import { toast } from "sonner";

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
  const { loading, error, data, refetch } = useQuery<
    { books: Book[] },
    { filter?: BookFilter }
  >(GET_BOOKS, {
    variables: {
      filter,
    },
    onError: () => {
      toast("Error fetching books");
    },
  });

  return {
    loading,
    error,
    refetch,
    books: data?.books ?? [],
  };
};

import { gql, useQuery } from "@apollo/client";
import { Book } from "../lib/utils";

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

export const useGetBooks = (id: string) => {
  const { loading, error, data } = useQuery<{ book: Book[] }, { id:string }>(GET_BOOK, {
    variables: {
      id
    }
  });

  return {
    loading,
    error,
    book: (data?.book ?? [])
  }
}
import { gql, useQuery } from "@apollo/client";
import { Category } from "../lib/utils";

const GET_CATEGORIES = gql`
  {
    categories {
      id
      title
    }
  }
`;

export const useGetCategories = () => {
  const { loading, error, data } = useQuery<{ categories: Category[] }>(GET_CATEGORIES);

  return {
    loading,
    error,
    books: (data?.categories ?? [])
  }
}
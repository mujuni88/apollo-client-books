import { gql, useQuery } from "@apollo/client";
import { Category } from "../lib/utils";

const GET_CATEGORY = gql`
  query getCategory($id: String!) {
    category(id: $id) {
      id
      name
    }
  }
`;

export const useGetCategory = (id: string) => {
  const { loading, error, data } = useQuery<
    { category: Category[] },
    { id: string }
  >(GET_CATEGORY, {
    variables: {
      id,
    },
  });

  return {
    loading,
    error,
    category: data?.category ?? [],
  };
};

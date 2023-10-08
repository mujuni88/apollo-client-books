import { gql, useQuery } from "@apollo/client";
import { Category } from "../../lib/utils";
import { toast } from "sonner";

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
    onError() {
      toast.error("Error fetching category");
    },
  });

  return {
    loading,
    error,
    category: data?.category ?? [],
  };
};

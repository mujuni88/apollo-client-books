import { gql, useQuery } from "@apollo/client";
import { Category } from "../lib/utils";
import { useToast } from "../components/ui/use-toast";

const GET_CATEGORY = gql`
  query getCategory($id: String!) {
    category(id: $id) {
      id
      name
    }
  }
`;

export const useGetCategory = (id: string) => {
  const { toast } = useToast();
  const { loading, error, data } = useQuery<
    { category: Category[] },
    { id: string }
  >(GET_CATEGORY, {
    variables: {
      id,
    },
    onError() {
      toast({
        variant: "destructive",
        title: "Error fetching category",
      });
    },
  });

  return {
    loading,
    error,
    category: data?.category ?? [],
  };
};

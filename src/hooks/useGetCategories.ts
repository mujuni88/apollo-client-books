import { gql, useQuery } from "@apollo/client";
import { Category } from "../lib/utils";
import { useToast } from "../components/ui/use-toast";

const GET_CATEGORIES = gql`
  {
    categories {
      id
      name
    }
  }
`;

export const useGetCategories = () => {
  const { toast } = useToast();
  const { loading, error, data } = useQuery<{ categories: Category[] }>(
    GET_CATEGORIES,
    {
      onError() {
        toast({
          variant: "destructive",
          title: "Error fetching categories",
        });
      },
    },
  );

  return {
    loading,
    error,
    categories: data?.categories ?? [],
  };
};

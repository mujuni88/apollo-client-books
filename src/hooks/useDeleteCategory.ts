import { Reference, gql, useMutation } from "@apollo/client";
import { useToast } from "../components/ui/use-toast";

const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: String!) {
    deleteCategory(id: $id)
  }
`;

export const useDeleteCategory = () => {
  const { toast } = useToast();
  const [_deleteCategory, { loading, error }] = useMutation(DELETE_CATEGORY, {
    onError() {
      toast({
        variant: "destructive",
        title: "Error deleting category",
      });
    },
  });

  const deleteCategory = async ({ id }: { id: string }) => {
    _deleteCategory({
      variables: {
        id,
      },
      optimisticResponse: {
        deleteCategory: true,
      },
      update(cache, { data }) {
        if (!data.deleteCategory) return;

        cache.modify({
          fields: {
            categorys(existingCategorys: Reference[], { readField }) {
              console.log("existingCategories", existingCategorys);
              return existingCategorys.filter(
                (categoryRef) => readField("id", categoryRef) !== id,
              );
            },
          },
        });
      },
    });
  };
  return {
    loading,
    error,
    deleteCategory,
  };
};

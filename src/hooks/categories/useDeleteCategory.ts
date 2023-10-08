import { Reference, gql, useMutation } from "@apollo/client";
import { toast } from "sonner";

const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: String!) {
    deleteCategory(id: $id)
  }
`;

export const useDeleteCategory = () => {
  const [_deleteCategory, { loading, error }] = useMutation(DELETE_CATEGORY, {
    onError() {
      toast.error("Error deleting category");
    },
    onCompleted() {
      toast.success("Category deleted successfully");
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
            categories(existingCategories: Reference[], { readField }) {
              console.log("existingCategories", existingCategories);
              return existingCategories.filter(
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

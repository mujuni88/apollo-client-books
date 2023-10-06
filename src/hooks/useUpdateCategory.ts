import { gql, useMutation } from "@apollo/client";
import { toast } from "sonner";
import { Category } from "../lib/utils";

const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($id: String!, $name: String!) {
    updateCategory(id: $id, name: $name) {
      id
      name
    }
  }
`;

export const useUpdateCategory = () => {
  const [_updateCategory, { loading }] = useMutation(UPDATE_CATEGORY, {
    onError: () => {
      toast.error("Error updating category");
    },
    onCompleted() {
      toast.success("Category updated successfully");
    },
  });

  const updateCategory = async ({
    id,
    name,
    categories,
  }: {
    id: string;
    name: string;
    categories: Category[];
  }) => {
    await _updateCategory({
      variables: {
        id,
        name,
        categories: Array.from(categories),
      },
      optimisticResponse: {
        updateCategory: {
          __typename: "Category",
          id,
          name,
          categories: Array.from(categories),
        },
      },
    });
  };

  return {
    updateCategory,
    loading,
  };
};

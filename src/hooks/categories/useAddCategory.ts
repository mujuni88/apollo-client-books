import { useMutation, gql } from "@apollo/client";
import { Category } from "../../lib/utils";
import { toast } from "sonner";

export const ADD_CATEGORY = gql`
  mutation addCategory($name: String!) {
    addCategory(name: $name) {
      id
      name
    }
  }
`;

type ReturnData = {
  addCategory: Category & { __typename: "Category" };
};
type AddCategoryVars = Omit<Category, "id">;

export const useAddCategory = () => {
  const [addCategory, { loading }] = useMutation<ReturnData, AddCategoryVars>(
    ADD_CATEGORY,
    {
      onError() {
        toast.error("Error adding category");
      },
      onCompleted() {
        toast.success("Category added successfully");
      },
      update(cache, { data }) {
        if (!data?.addCategory) return;

        cache.modify({
          fields: {
            categories(existingCategories = [], { toReference }) {
              return existingCategories.concat(toReference(data.addCategory));
            },
          },
        });
      },
    },
  );

  return {
    loading,
    addCategory,
  };
};

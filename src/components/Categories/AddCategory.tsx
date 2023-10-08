import { Button, Input } from "@nextui-org/react";
import { useState } from "react";
import { useAddCategory } from "../../hooks/categories/useAddCategory";

export function AddCategory() {
  const [name, setName] = useState("");
  const { addCategory, loading } = useAddCategory();

  return (
    <div>
      <form
        className="grid grid-cols-[1fr_auto] gap-3 items-center"
        onSubmit={(e) => {
          e.preventDefault();
          addCategory({
            variables: { name },
            optimisticResponse: {
              addCategory: {
                id: "temp-id",
                __typename: "Category",
                name,
              },
            },
          });
          setName("");
        }}
      >
        <Input
          isRequired
          size="sm"
          variant="underlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter category name"
        />
        <Button color="primary" type="submit" isLoading={loading}>
          Add
        </Button>
      </form>
    </div>
  );
}

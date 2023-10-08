import { Button, Input } from "@nextui-org/react";
import { useState } from "react";
import { CategoryDropdown } from "../CategoryDropdown";
import { useGetCategories } from "../../hooks/categories/useGetCategories";
import { useAddBook } from "../../hooks/books/useAddBook";

export function AddBook() {
  const [title, setTitle] = useState("");
  const { categories, loading } = useGetCategories();
  const { addBook } = useAddBook();
  const [selectedKeys, setSelectedKeys] = useState(() => new Set<string>([]));
  const selectedCategories = categories
    .filter((c) => selectedKeys.has(c.id))
    .map(({ id, name }) => ({ id, name }));

  return (
    <div>
      <form
        className="grid grid-cols-[1fr_1fr_auto] gap-3 items-center"
        onSubmit={(e) => {
          e.preventDefault();
          addBook({
            variables: { title, categories: selectedCategories },
            optimisticResponse: {
              addBook: {
                id: "temp-id",
                __typename: "Book",
                title,
                categories: selectedCategories,
              },
            },
          });
          setTitle("");
          setSelectedKeys(new Set<string>());
        }}
      >
        <Input
          isRequired
          label="Title"
          size="sm"
          variant="underlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter book title"
        />
        <CategoryDropdown
          categories={categories}
          selectedCategories={selectedKeys}
          onCategoryChange={setSelectedKeys}
        />
        <Button color="primary" type="submit" isLoading={loading}>
          Add Book
        </Button>
      </form>
    </div>
  );
}

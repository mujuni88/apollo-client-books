import { Button, Input } from "@nextui-org/react";
import React, { FormEvent, useState } from "react";
import { Book } from "../../../lib/utils";
import { useGetCategories } from "../../../hooks/categories/useGetCategories";
import { useUpdateBook } from "../../../hooks/books/useUpdateBook";
import { CategoryDropdown } from "../../CategoryDropdown";

export const BookEditForm: React.FC<Book & { onFinish: () => void }> = ({
  id,
  title: _title,
  categories: _categories,
  onFinish,
}) => {
  const [title, setTitle] = useState(_title);
  const { categories, loading } = useGetCategories();
  const { updateBook } = useUpdateBook();
  const [selectedKeys, setSelectedKeys] = useState(
    () => new Set<string>((_categories ?? []).map((c) => c.id)),
  );
  const selectedCategories = categories
    .filter((c) => selectedKeys.has(c.id))
    .map(({ id, name }) => ({ id, name }));

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    await updateBook({ id, title, categories: selectedCategories });
    onFinish();
  };

  return (
    <form
      className="grid grid-cols-3 gap-2 items-center"
      onSubmit={handleUpdate}
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
      <div className="space-x-2 grid grid-cols-2">
        <Button
          type="submit"
          isLoading={loading}
          isDisabled={!title}
          color="primary"
        >
          Update
        </Button>
        <Button
          type="button"
          color="default"
          onClick={() => {
            onFinish();
            setTitle(title);
          }}
          isDisabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

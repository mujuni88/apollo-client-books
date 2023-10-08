import React, { useState, FormEvent } from "react";
import { Category } from "../../lib/utils";
import { Button, Input } from "@nextui-org/react";
import { PencilIcon, TrashIcon } from "lucide-react";
import { useDeleteCategory } from "../../hooks/categories/useDeleteCategory";
import { useUpdateCategory } from "../../hooks/categories/useUpdateCategory";

export const CategoryItem: React.FC<Category> = ({ id, name }) => {
  const [edit, setEdit] = useState(false);

  return edit ? (
    <CategoryEditForm id={id} name={name} onFinish={() => setEdit(false)} />
  ) : (
    <CategoryInfo id={id} name={name} onEdit={() => setEdit(true)} />
  );
};

export const CategoryInfo: React.FC<Category & { onEdit: () => void }> = ({
  id,
  name,
  onEdit,
}) => {
  const { deleteCategory, loading } = useDeleteCategory();

  const handleDelete = async (e: FormEvent) => {
    e.preventDefault();
    deleteCategory({ id });
  };

  return (
    <form
      className="grid grid-cols-2 gap-2 items-center"
      onSubmit={handleDelete}
    >
      <p className="text-bold">{name}</p>
      <div className="gap-3 flex flex-end items-center justify-end">
        <Button
          color={"default"}
          onClick={onEdit}
          disabled={loading}
          type="button"
          isIconOnly
          variant="light"
        >
          <PencilIcon size={16} />
        </Button>
        <Button
          color={"danger"}
          disabled={loading}
          type="submit"
          isIconOnly
          variant="light"
        >
          <TrashIcon size={16} />
        </Button>
      </div>
    </form>
  );
};

export const CategoryEditForm: React.FC<
  Category & { onFinish: () => void }
> = ({ id, name: _name, onFinish }) => {
  const [name, setName] = useState(_name);
  const { updateCategory, loading } = useUpdateCategory();

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    await updateCategory({ id, name });
    onFinish();
  };

  return (
    <form
      className="grid grid-cols-2 gap-2 items-center"
      onSubmit={handleUpdate}
    >
      <Input
        isRequired
        label="Title"
        size="sm"
        variant="underlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter category name"
      />
      <div className="space-x-2 grid grid-cols-2">
        <Button
          type="submit"
          isLoading={loading}
          isDisabled={!name}
          color="primary"
        >
          Update
        </Button>
        <Button
          type="button"
          color="default"
          onClick={() => {
            onFinish();
            setName(name);
          }}
          isDisabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

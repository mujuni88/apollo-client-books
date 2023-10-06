
import { gql, useMutation } from "@apollo/client";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import React, { FormEvent, useState } from "react";

const UPDATE_BOOK = gql`
  mutation UpdateBook($id: String!, $title: String!, $categories: [Category]) {
    updateBook(id: $id, title: $title, categories: $categories) {
      id
      title
      categories
    }
  }
`;

export const useUpdateBook = () => {
  const { toast } = useToast();
  const [updateBook, { loading, error }] = useMutation(UPDATE_BOOK, {
    onError: () => {
    toast({
      variant: "destructive",
      title: "Error updating book",
    });

    }
  });

  const handleUpdate = async ({}) => {
    e.preventDefault();
    await updateBook({
      variables: {
        id,
        title,
        categories: Array.from(categories),
      },
      optimisticResponse: {
        updateBook: {
          __typename: "Book",
          id,
          title,
          categories: Array.from(categories),
        },
      },
    });
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
      <Select
        size="sm"
        variant="underlined"
        label="Category"
        placeholder="Select Category"
        selectionMode="multiple"
        selectedKeys={categories}
        onChange={(e) => {
          const val = e.target.value
            .trim()
            .split(",") as (keyof typeof Category)[];
          setCategories(new Set(val));
        }}
      >
        {categoriesOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </Select>
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

import { gql, useMutation } from "@apollo/client";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { useState } from "react";
import { Category, categoriesOptions } from "../lib/book";
import { useToast } from "./ui/use-toast";

export const ADD_BOOK = gql`
  mutation addBook($title: String!, $categories: [Category]) {
    addBook(title: $title, categories: $categories) {
      id
      title
      categories
    }
  }
`;
export function AddBook() {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [categories, setCategories] = useState(new Set([] as (keyof typeof Category)[] satisfies string[]));
  const [addBook, { loading }] = useMutation(ADD_BOOK, {
    update(cache, { data: { addBook } }) {
      cache.modify({
        fields: {
          books(existingBooks = [], { toReference }) {
            return existingBooks.concat(toReference(addBook));
          },
        },
      });
    },
  });

  return (
    <div>
      <form
        className="grid grid-cols-[1fr_1fr_auto] gap-3 items-center"
        onSubmit={(e) => {
          e.preventDefault();
          addBook({
            variables: { title, categories: Array.from(categories)},
            optimisticResponse: {
              addBook: {
                id: "temp-id",
                __typename: "Book",
                title,
                categories: Array.from(categories)
              },
            },
          });
          setTitle("");
          setCategories(new Set())
          toast({
            title: "Book added successfully",
          });
        }}
      >
          <Input isRequired label='Title' size='sm' variant="underlined" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter book title"/>        
          <Select
            size='sm'
            variant="underlined"
            label="Category"
            placeholder="Select Category"
            selectionMode="multiple"
            selectedKeys={categories}
            onChange={(e) => {
              const val = e.target.value.trim().split(',') as (keyof typeof Category)[];
              setCategories(new Set(val))
            }}
          >
            {categoriesOptions.map((option) =>
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            )}
          </Select>
        <Button color='primary' type="submit" isLoading={loading}>Add Book</Button>
      </form>
    </div>
  );
}

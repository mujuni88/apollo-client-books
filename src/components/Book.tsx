import { Reference, gql, useMutation } from "@apollo/client";
import { Button, Chip, Input, Select, SelectItem } from "@nextui-org/react";
import { PencilIcon, TrashIcon } from "lucide-react";
import React, { FormEvent, useState } from "react";
import { BookInfo, Category, categoriesOptions } from '../lib/book';
import { useToast } from "./ui/use-toast";

const UPDATE_BOOK = gql`
  mutation UpdateBook($id: String!, $title: String!, $categories: [Category]) {
    updateBook(id: $id, title: $title, categories: $categories) {
      id
      title
      categories
    }
  }
`;

const DELETE_BOOK = gql`
  mutation DeleteBook($id: String!) {
    deleteBook(id: $id)
  }
`;

export const Book: React.FC<BookInfo> = ({ id, title, categories }) => {
  const [edit, setEdit] = useState(false);

  return edit ? (
    <BookEditForm id={id} title={title} categories={categories} onFinish={() => setEdit(false)} />
  ) : (
    <BookInfo id={id} title={title} categories={categories} onEdit={() => setEdit(true)} />
  );
};

const BookEditForm: React.FC<BookInfo & { onFinish: () => void }> = ({
  id,
  title: _title,
  categories: _categories,
  onFinish,
}) => {
  const { toast } = useToast();
  const [title, setTitle] = useState(_title);
  const [categories, setCategories] = useState(new Set(_categories));
  const [updateBook, { loading, error }] = useMutation(UPDATE_BOOK);

  if (error) {
    toast({
      variant: "destructive",
      title: "Error updating book",
    });
  }

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    await updateBook({
      variables: {
        id,
        title,
        categories: Array.from(categories)
      },
      optimisticResponse: {
        updateBook: {
          __typename: "Book",
          id,
          title,
          categories: Array.from(categories)
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
      <div className="space-x-2 grid grid-cols-2">
        <Button type="submit" isLoading={loading} isDisabled={!title} color='primary'>
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

const BookInfo: React.FC<BookInfo & { onEdit: () => void }> = ({
  id,
  title,
  categories,
  onEdit,
}) => {
  const { toast } = useToast();
  const [deleteBook, { loading, error }] = useMutation(DELETE_BOOK);

  if (error) {
    toast({
      variant: "destructive",
      title: "Error deleting book",
    });
  }

  const handleDelete = async (e: FormEvent) => {
    e.preventDefault();
    deleteBook({
      variables: {
        id,
      },
      optimisticResponse: {
        deleteBook: true,
      },
      update(cache, { data }) {
        if (!data.deleteBook) return;

        cache.modify({
          fields: {
            books(existingBooks: Reference[], { readField }) {
              console.log("existingBooks", existingBooks);
              return existingBooks.filter(
                (bookRef) => readField("id", bookRef) !== id,
              );
            },
          },
        });
      },
    });
  };
  return (
    <form
      className="grid grid-cols-3 gap-2 items-center"
      onSubmit={handleDelete}
    >
      <p className="text-bold">{title}</p>
      <div className="text-bold flex flex-wrap gap-2 items-center">{(categories ?? []).map(c => <Chip color='primary' variant="faded">{Category[c]}</Chip>)}</div>
      <div className="gap-3 flex flex-end items-center justify-end">
        <Button color={"default"} onClick={onEdit} disabled={loading} type='button' isIconOnly variant="light">
          <PencilIcon size={16} />
        </Button>
        <Button color={"danger"} disabled={loading} type="submit" isIconOnly variant="light">
          <TrashIcon size={16} />
        </Button>
      </div>
    </form>
  );
};

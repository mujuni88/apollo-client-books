import { BookItem } from "./BookItem";
import { useGetBooks } from "../../hooks/books/useGetBooks";
import { AddBook } from "./AddBook";
import { CategoryDropdown } from "../CategoryDropdown";
import { useGetCategories } from "../../hooks/categories/useGetCategories";
import { useEffect, useState } from "react";

export function Books() {
  const { categories, loading: loadingCategories } = useGetCategories();
  const { books, loading, error, refetch } = useGetBooks();
  const isEmpty = !books.length && !loading && !error;
  const [selectedKeys, setSelectedKeys] = useState(() => new Set<string>([]));

  useEffect(() => {
    refetch({
      filter: {
        categoryIds: Array.from(selectedKeys).filter(Boolean),
      },
    });
  }, [selectedKeys]);

  return (
    <div>
      <AddBook />
      <div className="mt-10 pt-10">
        <div className="grid grid-cols-[1fr_1fr] items-center gap-5 border-b-2 border-black-500 pb-5 mb-5">
          <h2 className="text-2xl">Books</h2>
          <CategoryDropdown
            variant="flat"
            label={"Filter"}
            placeholder="Filter by categories"
            isLoading={loadingCategories}
            categories={categories}
            selectedCategories={selectedKeys}
            onCategoryChange={setSelectedKeys}
          />
        </div>
        {isEmpty ? (
          <p className="text-center text-l text-stone-500">
            No Books found. Add Books
          </p>
        ) : null}
        {loading ? <p className="text-center">Loading...</p> : null}
        {error ? (
          <p className="text-center text-red-300">Error loading books</p>
        ) : null}
        <ul className="w-full space-y-5">
          {books.map(({ id, title, categories }) => {
            return (
              <BookItem
                key={id}
                id={id}
                title={title}
                categories={categories}
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
}

import { BookItem } from "./BookItem";
import { useGetBooks } from "../hooks/useGetBooks";

export function Books() {
  const { books, loading, error } = useGetBooks();
  const isEmpty = !books.length && !loading;

  return (
    <div className="mt-10 pt-10">
      <h2 className="border-b-2 border-black-500 text-2xl pb-5 mb-5">Books</h2>
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
            <BookItem key={id} id={id} title={title} categories={categories} />
          );
        })}
      </ul>
    </div>
  );
}

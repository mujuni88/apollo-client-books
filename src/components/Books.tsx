import { gql, useQuery } from "@apollo/client";
import { Book } from "./Book";

const GET_BOOKS = gql`
  {
    books {
      id
      title
    }
  }
`;

export function Books() {
  const { loading, error, data } = useQuery<{ books: Book[] }>(GET_BOOKS);
  const books = (data?.books ?? []).map(({ id, title }) => {
    return <Book key={id} id={id} title={title} />
  });
  const isEmpty = !books.length && !loading && !error;

  return (
    <div className="mt-10 pt-10">
      <h2 className='border-b-2 border-black-500 text-2xl pb-5 mb-5'>Books</h2>
      {isEmpty ? <p className='text-center text-l text-stone-500'>No Books found. Add Books</p> : null}
      {loading ? <p className="text-center">Loading...</p> : null}
      {error ? <p className="text-center text-red-300">Error loading books</p> : null}
      <ul className='w-full space-y-5'>{books}</ul>
    </div>
  );
}

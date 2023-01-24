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
    return <Book key={id} id={id} title={title} />;
  });

  return (
    <div className="">
      {loading ? <p>Loading...</p> : null}
      {error ? <p>Error loading books</p> : null}
      <ul className="flex flex-col gap-2">{books}</ul>
    </div>
  );
}

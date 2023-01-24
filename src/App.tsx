import { ApolloProvider } from "@apollo/client";
import { AddBook } from "./components/AddBook";
import { Books } from "./components/Books";
import { client } from "./lib/client";
import { Toaster } from "./components/ui/toaster";

export default function App() {
  return (
    <ApolloProvider client={client}>
      <div className="w-screen h-screen">
        <div className="container flex flex-col justify-center items-center h-full gap-4">
          <AddBook />
          <Books />
        </div>
        <Toaster />
      </div>
    </ApolloProvider>
  );
}

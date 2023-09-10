import { ApolloProvider } from "@apollo/client";
import { AddBook } from "./components/AddBook";
import { Books } from "./components/Books";
import { client } from "./lib/client";
import { Toaster } from "./components/ui/toaster";
import {NextUIProvider} from "@nextui-org/react";

export default function App() {
  return (
    <ApolloProvider client={client}>
      <NextUIProvider>
        <div className="w-screen h-screen">
          <div className="container pb-20">
            <h1 className='text-l mb-5 uppercase text-sky-500 font-extrabold tracking-wide py-5 drop-shadow-md'>My Library</h1>
            <AddBook />
            <Books />
          </div>
          <Toaster />
        </div>
      </NextUIProvider>
    </ApolloProvider>
  );
}
import * as React from "react";

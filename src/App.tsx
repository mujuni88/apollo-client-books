import { ApolloProvider } from "@apollo/client";
import { Books } from "./components/Books";
import { Categories } from "./components/Categories";
import { Logo } from "./components/Logo";
import { client } from "./lib/client";
import { NextUIProvider } from "@nextui-org/react";
import { Toaster } from "sonner";

export default function App() {
  return (
    <ApolloProvider client={client}>
      <NextUIProvider>
        <Toaster richColors position="top-right" />
        <div className="w-screen h-screen">
          <div className="container pb-20">
            <Logo />
            <div className="grid grid-cols-[2fr_1fr] gap-5 mt-20">
              <Books />
              <Categories />
            </div>
          </div>
        </div>
      </NextUIProvider>
    </ApolloProvider>
  );
}
import * as React from "react";

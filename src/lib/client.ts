import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  uri: `https://f6rv63-4000.csb.app`,
  cache: new InMemoryCache(),
});

import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  uri: `https://qrq7zj-4000.csb.app`,
  cache: new InMemoryCache(),
});

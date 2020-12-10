import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: '/.netlify/functions/bookmarks',
  cache: new InMemoryCache()
});
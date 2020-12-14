const { ApolloServer, gql } = require('apollo-server-lambda')
const faunadb = require('faunadb'),
  q = faunadb.query;

  require('dotenv').config(); 

const typeDefs = gql`
  type Query {
    bookmark: [Bookmark!]
  }
  type Bookmark {
    id: ID!
    url: String!
    desc: String!
  }
  type Mutation {
    addBookmark(url: String!, desc: String!) : Bookmark   
    delBookmark(id: ID!): Bookmark
  }
`


const resolvers = {
  Query: {
    bookmark: async (root, args, context) => {
      try {
        var client = new faunadb.Client({ secret: process.env.FAUNADB_ADMIN_SECRET })
        var result = await client.query(
          q.Map(
            q.Paginate(q.Match(q.Index("url"))),
            q.Lambda(x => q.Get(x))
          )
        )        
        return result.data.map(d => {
          return {
            id: d.ref.id,
            url: d.data.url,
            desc: d.data.desc,
          }
        })
      }      
      catch(error) {
        console.log('error ===> ', error);
      } 
      
    },
  },

  Mutation: {
    addBookmark: async (_, { url, desc }) => {
      // console.log('url-desc', url, 'desc ===>', desc);
      try {
        var client = new faunadb.Client({ secret: process.env.FAUNADB_ADMIN_SECRET })
        var result = await client.query(
          q.Create(
            q.Collection('links'),
            { data: {
              url,
              desc
            }
           },
          )
        );
        console.log(result.ref.id);
        console.log(result.ts);
        console.log("Document Created and Inserted in Container: " + result.ref.id);
        return result.ref.data;        
      }      

      catch (error) {
        console.log('Error: ');
        console.log(error);
      }
    },    

    delBookmark: async(_, { id }) => {
      try {
        var client = new faunadb.Client({ secret: process.env.FAUNADB_ADMIN_SECRET })
        var result = await client.query(
          q.Delete(q.Ref(q.Collection("links"), id))
        )
        return result.data
      } catch(error) {
        return error
      }
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const handler = server.createHandler()

module.exports = { handler }
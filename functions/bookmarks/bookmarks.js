const { ApolloServer, gql } = require('apollo-server-lambda')

const typeDefs = gql`
  type Query {
    bookmark: [Bookmark!]
  }
  type Bookmark {
    id: ID!
    url: String!
    desc: String!
  }
`

const authors = [
  { id: 1, url: 'https://github.com/panacloud-modern-global-apps/jamstack-serverless', desc: 'This is a repo of jamstack-serverless' },
  { id: 2, url: 'https://github.com/panacloud-modern-global-apps/full-stack-serverless-cdk', desc: 'This is a repo of fullstack-serverless-cdk' },
  { id: 3, url: 'https://github.com/HamzaAhmedSheikh/project-12D_Bookmarking-Application', desc: 'This is a repo of Bookmarking-Application' },
]

const resolvers = {
  Query: {    
    bookmark: (root, args, context) => {
      return authors
    },        
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const handler = server.createHandler()

module.exports = { handler }

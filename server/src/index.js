const { GraphQLServer } = require("graphql-yoga");

// Dummy data
let links = [
  {
    id: "link-0",
    url: "www.justinkaseman.com",
    description: "Justin Kaseman's personal website",
  },
];

// Schema
const typeDefs = `
type Query {
    info: String!
    feed: [Link!]!
}

type Link {
    id: ID!
    description: String!
    url: String!
}
`;

// Resolvers
const resolvers = {
  Query: {
    info: () => `This is the API of a HackerNews clone`,
    feed: () => links,
  },
  Link: {
    id: root => root.id,
    description: root => root.description,
    url: root => root.url,
  },
};

// Server
const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => console.log(`Server running on port 4000`));

require("dotenv").config();
const { GraphQLServer } = require("graphql-yoga");
const { Prisma } = require("prisma-binding");

const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const AuthPayload = require("./resolvers/AuthPayload");
const Subscription = require("./resolvers/Subscription");

// Resolvers
const resolvers = {
  Query,
  Mutation,
  AuthPayload,
  Subscription,
};

// Server
const server = new GraphQLServer({
  typeDefs: `server/src/schema.graphql`,
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: "server/src/generated/prisma.graphql",
      endpoint: "https://us1.prisma.sh/justin-kaseman-9b6280/newsclone/dev",
      secret: process.env.prisma_secret,
      debug: true,
    }),
  }),
});

server.start(() => console.log(`Server running on port 4000`));

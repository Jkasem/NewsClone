const { GraphQLServer } = require("graphql-yoga");
const { Prisma } = require("prisma-binding");

// Resolvers
const resolvers = {
  Query: {
    info: () => `This is the API of a HackerNews clone`,
    feed: () => links,
    link: (root, args, context, info) => {
      return context.db.query.links({}, info);
    },
  },
  Mutation: {
    postLink: (root, args, context, info) => {
      return context.db.mutation.createLink(
        {
          data: {
            url: args.url,
            descriptions: args.description,
          },
        },
        info
      );
    },
    updateLink: (root, args) => {
      const index = links.indexOf(links.reduce(link => link.id === args.id));
      let linkToUpdate = links[index];
      if (args.id) linkToUpdate.id = args.id;
      if (args.description) linkToUpdate.description = args.description;
      return linkToUpdate;
    },
    deleteLink: (root, args) => {
      const index = links.indexOf(links.reduce(link => link.id === args.id));
      const output = links[index];
      links.splice(index, 1);
      return output;
    },
  },
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

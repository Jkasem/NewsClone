const { GraphQLServer } = require("graphql-yoga");

// Dummy data
let links = [
  {
    id: "link-0",
    url: "www.justinkaseman.com",
    description: "Justin Kaseman's personal website",
  },
];

let idCount = links.length;
// Resolvers
const resolvers = {
  Query: {
    info: () => `This is the API of a HackerNews clone`,
    feed: () => links,
    link: (root, args) => root,
  },
  Mutation: {
    postLink: (root, args) => {
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      };
      links.push(link);
      return link;
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
});

server.start(() => console.log(`Server running on port 4000`));

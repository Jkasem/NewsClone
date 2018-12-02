require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getUserId } = require("../utils");

async function signup(parent, args, context, info) {
  const password = await bcrypt.hash(args.password, 10);
  const user = await context.db.mutation.createUser(
    {
      data: { ...args, password },
    },
    `{id}`
  );

  const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

  return {
    token,
    user,
  };
}

async function login(parent, args, context, info) {
  const user = await context.db.query.user(
    { where: { email: args.email } },
    ` { id password } `
  );
  if (!user) {
    throw new Error("No user found");
  }

  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

  return {
    token,
    user,
  };
}

function postLink(root, args, context, info) {
  const userId = getUserId(context);
  return context.db.mutation.createLink(
    {
      data: {
        url: args.url,
        description: args.description,
        postedBy: { connect: { id: userId } },
      },
    },
    info
  );
}

async function vote(root, args, context, info) {
  const userId = getUserId(context);

  const linkExists = await context.db.exists.Vote({
    user: { id: userId },
    link: { id: args.linkId },
  });
  if (linkExists) {
    throw new Error(`Already voted for link: ${args.linkId}`);
  }

  return context.db.mutation.createVote(
    {
      data: {
        user: { connect: { id: userId } },
        link: { connect: { id: args.linkId } },
      },
    },
    info
  );
}

// function updateLink(root, args) {
//   const index = links.indexOf(links.reduce(link => link.id === args.id));
//   let linkToUpdate = links[index];
//   if (args.id) linkToUpdate.id = args.id;
//   if (args.description) linkToUpdate.description = args.description;
//   return linkToUpdate;
// }

// function deleteLink(root, args) {
//   const index = links.indexOf(links.reduce(link => link.id === args.id));
//   const output = links[index];
//   links.splice(index, 1);
//   return output;
// }

module.exports = {
  signup,
  login,
  postLink,
  vote,
  //   updateLink,
  //   deleteLink,
};

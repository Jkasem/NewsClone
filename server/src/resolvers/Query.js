const info = () => `This is the API of a HackerNews clone`;
const feed = (root, args, context, info) => context.db.query.links({}, info);

module.exports = {
  info,
  feed,
};

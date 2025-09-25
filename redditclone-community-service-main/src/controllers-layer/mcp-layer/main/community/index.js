module.exports = (headers) => {
  // Community Db Object Rest Api Router
  const communityMcpRouter = [];
  // getCommunity controller
  communityMcpRouter.push(require("./get-community")(headers));
  // createCommunity controller
  communityMcpRouter.push(require("./create-community")(headers));
  // updateCommunity controller
  communityMcpRouter.push(require("./update-community")(headers));
  // deleteCommunity controller
  communityMcpRouter.push(require("./delete-community")(headers));
  // listCommunities controller
  communityMcpRouter.push(require("./list-communities")(headers));
  return communityMcpRouter;
};

module.exports = (headers) => {
  // CommunityPinned Db Object Rest Api Router
  const communityPinnedMcpRouter = [];
  // getCommunityPinned controller
  communityPinnedMcpRouter.push(require("./get-communitypinned")(headers));
  // createCommunityPinned controller
  communityPinnedMcpRouter.push(require("./create-communitypinned")(headers));
  // updateCommunityPinned controller
  communityPinnedMcpRouter.push(require("./update-communitypinned")(headers));
  // deleteCommunityPinned controller
  communityPinnedMcpRouter.push(require("./delete-communitypinned")(headers));
  // listCommunityPinned controller
  communityPinnedMcpRouter.push(require("./list-communitypinned")(headers));
  return communityPinnedMcpRouter;
};

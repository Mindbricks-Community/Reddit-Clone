module.exports = (headers) => {
  // CommunityRule Db Object Rest Api Router
  const communityRuleMcpRouter = [];
  // getCommunityRule controller
  communityRuleMcpRouter.push(require("./get-communityrule")(headers));
  // createCommunityRule controller
  communityRuleMcpRouter.push(require("./create-communityrule")(headers));
  // updateCommunityRule controller
  communityRuleMcpRouter.push(require("./update-communityrule")(headers));
  // deleteCommunityRule controller
  communityRuleMcpRouter.push(require("./delete-communityrule")(headers));
  // listCommunityRules controller
  communityRuleMcpRouter.push(require("./list-communityrules")(headers));
  return communityRuleMcpRouter;
};

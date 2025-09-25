module.exports = (headers) => {
  // CommunityMember Db Object Rest Api Router
  const communityMemberMcpRouter = [];
  // getCommunityMember controller
  communityMemberMcpRouter.push(require("./get-communitymember")(headers));
  // createCommunityMember controller
  communityMemberMcpRouter.push(require("./create-communitymember")(headers));
  // updateCommunityMember controller
  communityMemberMcpRouter.push(require("./update-communitymember")(headers));
  // deleteCommunityMember controller
  communityMemberMcpRouter.push(require("./delete-communitymember")(headers));
  // listCommunityMembers controller
  communityMemberMcpRouter.push(require("./list-communitymembers")(headers));
  return communityMemberMcpRouter;
};

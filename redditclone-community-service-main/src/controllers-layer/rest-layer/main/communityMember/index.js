const express = require("express");

// CommunityMember Db Object Rest Api Router
const communityMemberRouter = express.Router();

// add CommunityMember controllers

// getCommunityMember controller
communityMemberRouter.get(
  "/communitymembers/:communityMemberId",
  require("./get-communitymember"),
);
// createCommunityMember controller
communityMemberRouter.post(
  "/communitymembers",
  require("./create-communitymember"),
);
// updateCommunityMember controller
communityMemberRouter.patch(
  "/communitymembers/:communityMemberId",
  require("./update-communitymember"),
);
// deleteCommunityMember controller
communityMemberRouter.delete(
  "/communitymembers/:communityMemberId",
  require("./delete-communitymember"),
);
// listCommunityMembers controller
communityMemberRouter.get(
  "/communitymembers",
  require("./list-communitymembers"),
);

module.exports = communityMemberRouter;

const express = require("express");

// CommunityRule Db Object Rest Api Router
const communityRuleRouter = express.Router();

// add CommunityRule controllers

// getCommunityRule controller
communityRuleRouter.get(
  "/communityrules/:communityRuleId",
  require("./get-communityrule"),
);
// createCommunityRule controller
communityRuleRouter.post("/communityrules", require("./create-communityrule"));
// updateCommunityRule controller
communityRuleRouter.patch(
  "/communityrules/:communityRuleId",
  require("./update-communityrule"),
);
// deleteCommunityRule controller
communityRuleRouter.delete(
  "/communityrules/:communityRuleId",
  require("./delete-communityrule"),
);
// listCommunityRules controller
communityRuleRouter.get("/communityrules", require("./list-communityrules"));

module.exports = communityRuleRouter;

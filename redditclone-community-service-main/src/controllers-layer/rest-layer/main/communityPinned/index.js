const express = require("express");

// CommunityPinned Db Object Rest Api Router
const communityPinnedRouter = express.Router();

// add CommunityPinned controllers

// getCommunityPinned controller
communityPinnedRouter.get(
  "/communitypinneds/:communityPinnedId",
  require("./get-communitypinned"),
);
// createCommunityPinned controller
communityPinnedRouter.post(
  "/communitypinneds",
  require("./create-communitypinned"),
);
// updateCommunityPinned controller
communityPinnedRouter.patch(
  "/communitypinneds/:communityPinnedId",
  require("./update-communitypinned"),
);
// deleteCommunityPinned controller
communityPinnedRouter.delete(
  "/communitypinneds/:communityPinnedId",
  require("./delete-communitypinned"),
);
// listCommunityPinned controller
communityPinnedRouter.get(
  "/communitypinned",
  require("./list-communitypinned"),
);

module.exports = communityPinnedRouter;

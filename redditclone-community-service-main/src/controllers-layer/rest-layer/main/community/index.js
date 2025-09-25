const express = require("express");

// Community Db Object Rest Api Router
const communityRouter = express.Router();

// add Community controllers

// getCommunity controller
communityRouter.get("/communities/:communityId", require("./get-community"));
// createCommunity controller
communityRouter.post("/communities", require("./create-community"));
// updateCommunity controller
communityRouter.patch(
  "/communities/:communityId",
  require("./update-community"),
);
// deleteCommunity controller
communityRouter.delete(
  "/communities/:communityId",
  require("./delete-community"),
);
// listCommunities controller
communityRouter.get("/communities", require("./list-communities"));

module.exports = communityRouter;

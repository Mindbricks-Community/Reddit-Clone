const express = require("express");

// Vote Db Object Rest Api Router
const voteRouter = express.Router();

// add Vote controllers

// getVote controller
voteRouter.get("/votes/:voteId", require("./get-vote"));
// createVote controller
voteRouter.post("/votes", require("./create-vote"));
// updateVote controller
voteRouter.patch("/votes/:voteId", require("./update-vote"));
// deleteVote controller
voteRouter.delete("/votes/:voteId", require("./delete-vote"));
// listVotes controller
voteRouter.get("/votes", require("./list-votes"));

module.exports = voteRouter;

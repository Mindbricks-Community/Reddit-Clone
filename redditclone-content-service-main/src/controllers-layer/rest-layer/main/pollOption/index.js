const express = require("express");

// PollOption Db Object Rest Api Router
const pollOptionRouter = express.Router();

// add PollOption controllers

// getPollOption controller
pollOptionRouter.get("/polloptions/:pollOptionId", require("./get-polloption"));
// createPollOption controller
pollOptionRouter.post("/polloptions", require("./create-polloption"));
// updatePollOption controller
pollOptionRouter.patch(
  "/polloptions/:pollOptionId",
  require("./update-polloption"),
);
// deletePollOption controller
pollOptionRouter.delete(
  "/polloptions/:pollOptionId",
  require("./delete-polloption"),
);
// listPollOptions controller
pollOptionRouter.get("/polloptions", require("./list-polloptions"));

module.exports = pollOptionRouter;

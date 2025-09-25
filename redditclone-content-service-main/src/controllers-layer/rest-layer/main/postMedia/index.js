const express = require("express");

// PostMedia Db Object Rest Api Router
const postMediaRouter = express.Router();

// add PostMedia controllers

// getPostMedia controller
postMediaRouter.get("/postmedias/:postMediaId", require("./get-postmedia"));
// addPostMedia controller
postMediaRouter.post("/addpostmedia", require("./add-postmedia"));
// updatePostMedia controller
postMediaRouter.patch(
  "/postmedias/:postMediaId",
  require("./update-postmedia"),
);
// deletePostMedia controller
postMediaRouter.delete(
  "/postmedias/:postMediaId",
  require("./delete-postmedia"),
);
// listPostMedia controller
postMediaRouter.get("/postmedia", require("./list-postmedia"));

module.exports = postMediaRouter;

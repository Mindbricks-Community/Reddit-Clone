const express = require("express");

// Comment Db Object Rest Api Router
const commentRouter = express.Router();

// add Comment controllers

// getComment controller
commentRouter.get("/comments/:commentId", require("./get-comment"));
// createComment controller
commentRouter.post("/comments", require("./create-comment"));
// updateComment controller
commentRouter.patch("/comments/:commentId", require("./update-comment"));
// deleteComment controller
commentRouter.delete("/comments/:commentId", require("./delete-comment"));
// listComments controller
commentRouter.get("/comments", require("./list-comments"));

module.exports = commentRouter;

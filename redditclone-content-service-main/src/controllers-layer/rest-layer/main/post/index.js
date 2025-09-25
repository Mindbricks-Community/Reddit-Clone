const express = require("express");

// Post Db Object Rest Api Router
const postRouter = express.Router();

// add Post controllers

// getPost controller
postRouter.get("/posts/:postId", require("./get-post"));
// createPost controller
postRouter.post("/posts", require("./create-post"));
// updatePost controller
postRouter.patch("/posts/:postId", require("./update-post"));
// deletePost controller
postRouter.delete("/posts/:postId", require("./delete-post"));
// listPosts controller
postRouter.get("/posts", require("./list-posts"));

module.exports = postRouter;

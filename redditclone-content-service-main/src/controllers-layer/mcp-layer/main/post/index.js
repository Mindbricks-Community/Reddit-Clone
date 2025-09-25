module.exports = (headers) => {
  // Post Db Object Rest Api Router
  const postMcpRouter = [];
  // getPost controller
  postMcpRouter.push(require("./get-post")(headers));
  // createPost controller
  postMcpRouter.push(require("./create-post")(headers));
  // updatePost controller
  postMcpRouter.push(require("./update-post")(headers));
  // deletePost controller
  postMcpRouter.push(require("./delete-post")(headers));
  // listPosts controller
  postMcpRouter.push(require("./list-posts")(headers));
  return postMcpRouter;
};

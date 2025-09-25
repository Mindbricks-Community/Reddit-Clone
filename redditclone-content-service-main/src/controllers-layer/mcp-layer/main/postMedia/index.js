module.exports = (headers) => {
  // PostMedia Db Object Rest Api Router
  const postMediaMcpRouter = [];
  // getPostMedia controller
  postMediaMcpRouter.push(require("./get-postmedia")(headers));
  // addPostMedia controller
  postMediaMcpRouter.push(require("./add-postmedia")(headers));
  // updatePostMedia controller
  postMediaMcpRouter.push(require("./update-postmedia")(headers));
  // deletePostMedia controller
  postMediaMcpRouter.push(require("./delete-postmedia")(headers));
  // listPostMedia controller
  postMediaMcpRouter.push(require("./list-postmedia")(headers));
  return postMediaMcpRouter;
};

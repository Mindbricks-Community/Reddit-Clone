module.exports = (headers) => {
  // Comment Db Object Rest Api Router
  const commentMcpRouter = [];
  // getComment controller
  commentMcpRouter.push(require("./get-comment")(headers));
  // createComment controller
  commentMcpRouter.push(require("./create-comment")(headers));
  // updateComment controller
  commentMcpRouter.push(require("./update-comment")(headers));
  // deleteComment controller
  commentMcpRouter.push(require("./delete-comment")(headers));
  // listComments controller
  commentMcpRouter.push(require("./list-comments")(headers));
  return commentMcpRouter;
};

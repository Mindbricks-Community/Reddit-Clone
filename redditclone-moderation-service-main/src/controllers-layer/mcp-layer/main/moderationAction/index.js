module.exports = (headers) => {
  // ModerationAction Db Object Rest Api Router
  const moderationActionMcpRouter = [];
  // getModerationAction controller
  moderationActionMcpRouter.push(require("./get-moderationaction")(headers));
  // createModerationAction controller
  moderationActionMcpRouter.push(require("./create-moderationaction")(headers));
  // updateModerationAction controller
  moderationActionMcpRouter.push(require("./update-moderationaction")(headers));
  // deleteModerationAction controller
  moderationActionMcpRouter.push(require("./delete-moderationaction")(headers));
  // listModerationActions controller
  moderationActionMcpRouter.push(require("./list-moderationactions")(headers));
  return moderationActionMcpRouter;
};

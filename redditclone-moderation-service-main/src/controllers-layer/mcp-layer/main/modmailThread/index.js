module.exports = (headers) => {
  // ModmailThread Db Object Rest Api Router
  const modmailThreadMcpRouter = [];
  // getModmailThread controller
  modmailThreadMcpRouter.push(require("./get-modmailthread")(headers));
  // createModmailThread controller
  modmailThreadMcpRouter.push(require("./create-modmailthread")(headers));
  // updateModmailThread controller
  modmailThreadMcpRouter.push(require("./update-modmailthread")(headers));
  // deleteModmailThread controller
  modmailThreadMcpRouter.push(require("./delete-modmailthread")(headers));
  // listModmailThreads controller
  modmailThreadMcpRouter.push(require("./list-modmailthreads")(headers));
  return modmailThreadMcpRouter;
};

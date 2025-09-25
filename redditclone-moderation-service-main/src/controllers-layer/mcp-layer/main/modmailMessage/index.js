module.exports = (headers) => {
  // ModmailMessage Db Object Rest Api Router
  const modmailMessageMcpRouter = [];
  // getModmailMessage controller
  modmailMessageMcpRouter.push(require("./get-modmailmessage")(headers));
  // createModmailMessage controller
  modmailMessageMcpRouter.push(require("./create-modmailmessage")(headers));
  // updateModmailMessage controller
  modmailMessageMcpRouter.push(require("./update-modmailmessage")(headers));
  // deleteModmailMessage controller
  modmailMessageMcpRouter.push(require("./delete-modmailmessage")(headers));
  // listModmailMessages controller
  modmailMessageMcpRouter.push(require("./list-modmailmessages")(headers));
  return modmailMessageMcpRouter;
};

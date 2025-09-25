module.exports = (headers) => {
  // AutomodEvent Db Object Rest Api Router
  const automodEventMcpRouter = [];
  // getAutomodEvent controller
  automodEventMcpRouter.push(require("./get-automodevent")(headers));
  // createAutomodEvent controller
  automodEventMcpRouter.push(require("./create-automodevent")(headers));
  // updateAutomodEvent controller
  automodEventMcpRouter.push(require("./update-automodevent")(headers));
  // deleteAutomodEvent controller
  automodEventMcpRouter.push(require("./delete-automodevent")(headers));
  // listAutomodEvents controller
  automodEventMcpRouter.push(require("./list-automodevents")(headers));
  return automodEventMcpRouter;
};

module.exports = (headers) => {
  // PollOption Db Object Rest Api Router
  const pollOptionMcpRouter = [];
  // getPollOption controller
  pollOptionMcpRouter.push(require("./get-polloption")(headers));
  // createPollOption controller
  pollOptionMcpRouter.push(require("./create-polloption")(headers));
  // updatePollOption controller
  pollOptionMcpRouter.push(require("./update-polloption")(headers));
  // deletePollOption controller
  pollOptionMcpRouter.push(require("./delete-polloption")(headers));
  // listPollOptions controller
  pollOptionMcpRouter.push(require("./list-polloptions")(headers));
  return pollOptionMcpRouter;
};

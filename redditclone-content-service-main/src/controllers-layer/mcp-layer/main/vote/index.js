module.exports = (headers) => {
  // Vote Db Object Rest Api Router
  const voteMcpRouter = [];
  // getVote controller
  voteMcpRouter.push(require("./get-vote")(headers));
  // createVote controller
  voteMcpRouter.push(require("./create-vote")(headers));
  // updateVote controller
  voteMcpRouter.push(require("./update-vote")(headers));
  // deleteVote controller
  voteMcpRouter.push(require("./delete-vote")(headers));
  // listVotes controller
  voteMcpRouter.push(require("./list-votes")(headers));
  return voteMcpRouter;
};

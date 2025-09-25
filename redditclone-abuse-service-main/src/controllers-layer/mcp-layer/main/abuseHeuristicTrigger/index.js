module.exports = (headers) => {
  // AbuseHeuristicTrigger Db Object Rest Api Router
  const abuseHeuristicTriggerMcpRouter = [];
  // getAbuseHeuristicTrigger controller
  abuseHeuristicTriggerMcpRouter.push(
    require("./get-abuseheuristictrigger")(headers),
  );
  // createAbuseHeuristicTrigger controller
  abuseHeuristicTriggerMcpRouter.push(
    require("./create-abuseheuristictrigger")(headers),
  );
  // updateAbuseHeuristicTrigger controller
  abuseHeuristicTriggerMcpRouter.push(
    require("./update-abuseheuristictrigger")(headers),
  );
  // deleteAbuseHeuristicTrigger controller
  abuseHeuristicTriggerMcpRouter.push(
    require("./delete-abuseheuristictrigger")(headers),
  );
  // listAbuseHeuristicTriggers controller
  abuseHeuristicTriggerMcpRouter.push(
    require("./list-abuseheuristictriggers")(headers),
  );
  return abuseHeuristicTriggerMcpRouter;
};

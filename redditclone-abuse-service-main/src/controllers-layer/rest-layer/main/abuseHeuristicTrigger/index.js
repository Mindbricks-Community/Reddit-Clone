const express = require("express");

// AbuseHeuristicTrigger Db Object Rest Api Router
const abuseHeuristicTriggerRouter = express.Router();

// add AbuseHeuristicTrigger controllers

// getAbuseHeuristicTrigger controller
abuseHeuristicTriggerRouter.get(
  "/abuseheuristictriggers/:abuseHeuristicTriggerId",
  require("./get-abuseheuristictrigger"),
);
// createAbuseHeuristicTrigger controller
abuseHeuristicTriggerRouter.post(
  "/abuseheuristictriggers",
  require("./create-abuseheuristictrigger"),
);
// updateAbuseHeuristicTrigger controller
abuseHeuristicTriggerRouter.patch(
  "/abuseheuristictriggers/:abuseHeuristicTriggerId",
  require("./update-abuseheuristictrigger"),
);
// deleteAbuseHeuristicTrigger controller
abuseHeuristicTriggerRouter.delete(
  "/abuseheuristictriggers/:abuseHeuristicTriggerId",
  require("./delete-abuseheuristictrigger"),
);
// listAbuseHeuristicTriggers controller
abuseHeuristicTriggerRouter.get(
  "/abuseheuristictriggers",
  require("./list-abuseheuristictriggers"),
);

module.exports = abuseHeuristicTriggerRouter;

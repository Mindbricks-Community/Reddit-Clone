const express = require("express");

// AbuseInvestigation Db Object Rest Api Router
const abuseInvestigationRouter = express.Router();

// add AbuseInvestigation controllers

// getAbuseInvestigation controller
abuseInvestigationRouter.get(
  "/abuseinvestigations/:abuseInvestigationId",
  require("./get-abuseinvestigation"),
);
// createAbuseInvestigation controller
abuseInvestigationRouter.post(
  "/abuseinvestigations",
  require("./create-abuseinvestigation"),
);
// updateAbuseInvestigation controller
abuseInvestigationRouter.patch(
  "/abuseinvestigations/:abuseInvestigationId",
  require("./update-abuseinvestigation"),
);
// deleteAbuseInvestigation controller
abuseInvestigationRouter.delete(
  "/abuseinvestigations/:abuseInvestigationId",
  require("./delete-abuseinvestigation"),
);
// listAbuseInvestigations controller
abuseInvestigationRouter.get(
  "/abuseinvestigations",
  require("./list-abuseinvestigations"),
);

module.exports = abuseInvestigationRouter;

const express = require("express");

// AbuseReport Db Object Rest Api Router
const abuseReportRouter = express.Router();

// add AbuseReport controllers

// getAbuseReport controller
abuseReportRouter.get(
  "/abusereports/:abuseReportId",
  require("./get-abusereport"),
);
// createAbuseReport controller
abuseReportRouter.post("/abusereports", require("./create-abusereport"));
// updateAbuseReport controller
abuseReportRouter.patch(
  "/abusereports/:abuseReportId",
  require("./update-abusereport"),
);
// deleteAbuseReport controller
abuseReportRouter.delete(
  "/abusereports/:abuseReportId",
  require("./delete-abusereport"),
);
// listAbuseReports controller
abuseReportRouter.get("/abusereports", require("./list-abusereports"));

module.exports = abuseReportRouter;

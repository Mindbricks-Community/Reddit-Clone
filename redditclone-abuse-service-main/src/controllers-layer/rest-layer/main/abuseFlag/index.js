const express = require("express");

// AbuseFlag Db Object Rest Api Router
const abuseFlagRouter = express.Router();

// add AbuseFlag controllers

// getAbuseFlag controller
abuseFlagRouter.get("/abuseflags/:abuseFlagId", require("./get-abuseflag"));
// createAbuseFlag controller
abuseFlagRouter.post("/abuseflags", require("./create-abuseflag"));
// updateAbuseFlag controller
abuseFlagRouter.patch(
  "/abuseflags/:abuseFlagId",
  require("./update-abuseflag"),
);
// deleteAbuseFlag controller
abuseFlagRouter.delete(
  "/abuseflags/:abuseFlagId",
  require("./delete-abuseflag"),
);
// listAbuseFlags controller
abuseFlagRouter.get("/abuseflags", require("./list-abuseflags"));

module.exports = abuseFlagRouter;

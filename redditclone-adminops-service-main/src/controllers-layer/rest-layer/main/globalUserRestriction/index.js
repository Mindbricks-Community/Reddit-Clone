const express = require("express");

// GlobalUserRestriction Db Object Rest Api Router
const globalUserRestrictionRouter = express.Router();

// add GlobalUserRestriction controllers

// getGlobalUserRestriction controller
globalUserRestrictionRouter.get(
  "/globaluserrestrictions/:globalUserRestrictionId",
  require("./get-globaluserrestriction"),
);
// createGlobalUserRestriction controller
globalUserRestrictionRouter.post(
  "/globaluserrestrictions",
  require("./create-globaluserrestriction"),
);
// updateGlobalUserRestriction controller
globalUserRestrictionRouter.patch(
  "/globaluserrestrictions/:globalUserRestrictionId",
  require("./update-globaluserrestriction"),
);
// deleteGlobalUserRestriction controller
globalUserRestrictionRouter.delete(
  "/globaluserrestrictions/:globalUserRestrictionId",
  require("./delete-globaluserrestriction"),
);
// listGlobalUserRestrictions controller
globalUserRestrictionRouter.get(
  "/globaluserrestrictions",
  require("./list-globaluserrestrictions"),
);

module.exports = globalUserRestrictionRouter;

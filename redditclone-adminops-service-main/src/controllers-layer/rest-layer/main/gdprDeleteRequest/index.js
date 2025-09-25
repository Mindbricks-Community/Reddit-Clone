const express = require("express");

// GdprDeleteRequest Db Object Rest Api Router
const gdprDeleteRequestRouter = express.Router();

// add GdprDeleteRequest controllers

// getGdprDeleteRequest controller
gdprDeleteRequestRouter.get(
  "/gdprdeleterequests/:gdprDeleteRequestId",
  require("./get-gdprdeleterequest"),
);
// createGdprDeleteRequest controller
gdprDeleteRequestRouter.post(
  "/gdprdeleterequests",
  require("./create-gdprdeleterequest"),
);
// updateGdprDeleteRequest controller
gdprDeleteRequestRouter.patch(
  "/gdprdeleterequests/:gdprDeleteRequestId",
  require("./update-gdprdeleterequest"),
);
// deleteGdprDeleteRequest controller
gdprDeleteRequestRouter.delete(
  "/gdprdeleterequests/:gdprDeleteRequestId",
  require("./delete-gdprdeleterequest"),
);
// listGdprDeleteRequests controller
gdprDeleteRequestRouter.get(
  "/gdprdeleterequests",
  require("./list-gdprdeleterequests"),
);

module.exports = gdprDeleteRequestRouter;

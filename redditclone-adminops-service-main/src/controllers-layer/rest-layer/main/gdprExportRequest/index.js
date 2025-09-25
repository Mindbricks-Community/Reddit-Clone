const express = require("express");

// GdprExportRequest Db Object Rest Api Router
const gdprExportRequestRouter = express.Router();

// add GdprExportRequest controllers

// getGdprExportRequest controller
gdprExportRequestRouter.get(
  "/gdprexportrequests/:gdprExportRequestId",
  require("./get-gdprexportrequest"),
);
// createGdprExportRequest controller
gdprExportRequestRouter.post(
  "/gdprexportrequests",
  require("./create-gdprexportrequest"),
);
// updateGdprExportRequest controller
gdprExportRequestRouter.patch(
  "/gdprexportrequests/:gdprExportRequestId",
  require("./update-gdprexportrequest"),
);
// deleteGdprExportRequest controller
gdprExportRequestRouter.delete(
  "/gdprexportrequests/:gdprExportRequestId",
  require("./delete-gdprexportrequest"),
);
// listGdprExportRequests controller
gdprExportRequestRouter.get(
  "/gdprexportrequests",
  require("./list-gdprexportrequests"),
);

module.exports = gdprExportRequestRouter;

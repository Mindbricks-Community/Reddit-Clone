const express = require("express");

// MediaScan Db Object Rest Api Router
const mediaScanRouter = express.Router();

// add MediaScan controllers

// getMediaScan controller
mediaScanRouter.get("/mediascans/:mediaScanId", require("./get-mediascan"));
// createMediaScan controller
mediaScanRouter.post("/mediascans", require("./create-mediascan"));
// updateMediaScan controller
mediaScanRouter.patch(
  "/mediascans/:mediaScanId",
  require("./update-mediascan"),
);
// deleteMediaScan controller
mediaScanRouter.delete(
  "/mediascans/:mediaScanId",
  require("./delete-mediascan"),
);
// listMediaScans controller
mediaScanRouter.get("/mediascans", require("./list-mediascans"));

module.exports = mediaScanRouter;

const express = require("express");

// MediaObject Db Object Rest Api Router
const mediaObjectRouter = express.Router();

// add MediaObject controllers

// getMediaObject controller
mediaObjectRouter.get(
  "/mediaobjects/:mediaObjectId",
  require("./get-mediaobject"),
);
// createMediaObject controller
mediaObjectRouter.post("/mediaobjects", require("./create-mediaobject"));
// updateMediaObject controller
mediaObjectRouter.patch(
  "/mediaobjects/:mediaObjectId",
  require("./update-mediaobject"),
);
// deleteMediaObject controller
mediaObjectRouter.delete(
  "/mediaobjects/:mediaObjectId",
  require("./delete-mediaobject"),
);
// listMediaObjects controller
mediaObjectRouter.get("/mediaobjects", require("./list-mediaobjects"));

module.exports = mediaObjectRouter;

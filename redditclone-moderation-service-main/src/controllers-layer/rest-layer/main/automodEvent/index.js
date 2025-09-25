const express = require("express");

// AutomodEvent Db Object Rest Api Router
const automodEventRouter = express.Router();

// add AutomodEvent controllers

// getAutomodEvent controller
automodEventRouter.get(
  "/automodevents/:automodEventId",
  require("./get-automodevent"),
);
// createAutomodEvent controller
automodEventRouter.post("/automodevents", require("./create-automodevent"));
// updateAutomodEvent controller
automodEventRouter.patch(
  "/automodevents/:automodEventId",
  require("./update-automodevent"),
);
// deleteAutomodEvent controller
automodEventRouter.delete(
  "/automodevents/:automodEventId",
  require("./delete-automodevent"),
);
// listAutomodEvents controller
automodEventRouter.get("/automodevents", require("./list-automodevents"));

module.exports = automodEventRouter;

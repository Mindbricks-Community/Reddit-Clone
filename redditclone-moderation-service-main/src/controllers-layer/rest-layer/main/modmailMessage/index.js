const express = require("express");

// ModmailMessage Db Object Rest Api Router
const modmailMessageRouter = express.Router();

// add ModmailMessage controllers

// getModmailMessage controller
modmailMessageRouter.get(
  "/modmailmessages/:modmailMessageId",
  require("./get-modmailmessage"),
);
// createModmailMessage controller
modmailMessageRouter.post(
  "/modmailmessages",
  require("./create-modmailmessage"),
);
// updateModmailMessage controller
modmailMessageRouter.patch(
  "/modmailmessages/:modmailMessageId",
  require("./update-modmailmessage"),
);
// deleteModmailMessage controller
modmailMessageRouter.delete(
  "/modmailmessages/:modmailMessageId",
  require("./delete-modmailmessage"),
);
// listModmailMessages controller
modmailMessageRouter.get("/modmailmessages", require("./list-modmailmessages"));

module.exports = modmailMessageRouter;

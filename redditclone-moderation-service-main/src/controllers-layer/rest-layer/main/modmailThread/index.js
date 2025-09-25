const express = require("express");

// ModmailThread Db Object Rest Api Router
const modmailThreadRouter = express.Router();

// add ModmailThread controllers

// getModmailThread controller
modmailThreadRouter.get(
  "/modmailthreads/:modmailThreadId",
  require("./get-modmailthread"),
);
// createModmailThread controller
modmailThreadRouter.post("/modmailthreads", require("./create-modmailthread"));
// updateModmailThread controller
modmailThreadRouter.patch(
  "/modmailthreads/:modmailThreadId",
  require("./update-modmailthread"),
);
// deleteModmailThread controller
modmailThreadRouter.delete(
  "/modmailthreads/:modmailThreadId",
  require("./delete-modmailthread"),
);
// listModmailThreads controller
modmailThreadRouter.get("/modmailthreads", require("./list-modmailthreads"));

module.exports = modmailThreadRouter;

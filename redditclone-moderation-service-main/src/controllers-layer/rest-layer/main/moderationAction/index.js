const express = require("express");

// ModerationAction Db Object Rest Api Router
const moderationActionRouter = express.Router();

// add ModerationAction controllers

// getModerationAction controller
moderationActionRouter.get(
  "/moderationactions/:moderationActionId",
  require("./get-moderationaction"),
);
// createModerationAction controller
moderationActionRouter.post(
  "/moderationactions",
  require("./create-moderationaction"),
);
// updateModerationAction controller
moderationActionRouter.patch(
  "/moderationactions/:moderationActionId",
  require("./update-moderationaction"),
);
// deleteModerationAction controller
moderationActionRouter.delete(
  "/moderationactions/:moderationActionId",
  require("./delete-moderationaction"),
);
// listModerationActions controller
moderationActionRouter.get(
  "/moderationactions",
  require("./list-moderationactions"),
);

module.exports = moderationActionRouter;

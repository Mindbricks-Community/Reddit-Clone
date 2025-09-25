const express = require("express");

// CommunityAutomodSetting Db Object Rest Api Router
const communityAutomodSettingRouter = express.Router();

// add CommunityAutomodSetting controllers

// getCommunityAutomodSetting controller
communityAutomodSettingRouter.get(
  "/communityautomodsettings/:communityAutomodSettingId",
  require("./get-communityautomodsetting"),
);
// createCommunityAutomodSetting controller
communityAutomodSettingRouter.post(
  "/communityautomodsettings",
  require("./create-communityautomodsetting"),
);
// updateCommunityAutomodSetting controller
communityAutomodSettingRouter.patch(
  "/communityautomodsettings/:communityAutomodSettingId",
  require("./update-communityautomodsetting"),
);
// deleteCommunityAutomodSetting controller
communityAutomodSettingRouter.delete(
  "/communityautomodsettings/:communityAutomodSettingId",
  require("./delete-communityautomodsetting"),
);
// listCommunityAutomodSettings controller
communityAutomodSettingRouter.get(
  "/communityautomodsettings",
  require("./list-communityautomodsettings"),
);

module.exports = communityAutomodSettingRouter;

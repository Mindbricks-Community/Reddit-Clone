module.exports = (headers) => {
  // CommunityAutomodSetting Db Object Rest Api Router
  const communityAutomodSettingMcpRouter = [];
  // getCommunityAutomodSetting controller
  communityAutomodSettingMcpRouter.push(
    require("./get-communityautomodsetting")(headers),
  );
  // createCommunityAutomodSetting controller
  communityAutomodSettingMcpRouter.push(
    require("./create-communityautomodsetting")(headers),
  );
  // updateCommunityAutomodSetting controller
  communityAutomodSettingMcpRouter.push(
    require("./update-communityautomodsetting")(headers),
  );
  // deleteCommunityAutomodSetting controller
  communityAutomodSettingMcpRouter.push(
    require("./delete-communityautomodsetting")(headers),
  );
  // listCommunityAutomodSettings controller
  communityAutomodSettingMcpRouter.push(
    require("./list-communityautomodsettings")(headers),
  );
  return communityAutomodSettingMcpRouter;
};

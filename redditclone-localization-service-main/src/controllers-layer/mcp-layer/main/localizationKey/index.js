module.exports = (headers) => {
  // LocalizationKey Db Object Rest Api Router
  const localizationKeyMcpRouter = [];
  // getLocalizationKey controller
  localizationKeyMcpRouter.push(require("./get-localizationkey")(headers));
  // createLocalizationKey controller
  localizationKeyMcpRouter.push(require("./create-localizationkey")(headers));
  // updateLocalizationKey controller
  localizationKeyMcpRouter.push(require("./update-localizationkey")(headers));
  // deleteLocalizationKey controller
  localizationKeyMcpRouter.push(require("./delete-localizationkey")(headers));
  // listLocalizationKeys controller
  localizationKeyMcpRouter.push(require("./list-localizationkeys")(headers));
  return localizationKeyMcpRouter;
};

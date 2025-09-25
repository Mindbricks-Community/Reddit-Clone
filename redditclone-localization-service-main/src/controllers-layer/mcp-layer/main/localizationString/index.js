module.exports = (headers) => {
  // LocalizationString Db Object Rest Api Router
  const localizationStringMcpRouter = [];
  // getLocalizationString controller
  localizationStringMcpRouter.push(
    require("./get-localizationstring")(headers),
  );
  // createLocalizationString controller
  localizationStringMcpRouter.push(
    require("./create-localizationstring")(headers),
  );
  // updateLocalizationString controller
  localizationStringMcpRouter.push(
    require("./update-localizationstring")(headers),
  );
  // deleteLocalizationString controller
  localizationStringMcpRouter.push(
    require("./delete-localizationstring")(headers),
  );
  // listLocalizationStrings controller
  localizationStringMcpRouter.push(
    require("./list-localizationstrings")(headers),
  );
  return localizationStringMcpRouter;
};

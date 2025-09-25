const express = require("express");

// LocalizationString Db Object Rest Api Router
const localizationStringRouter = express.Router();

// add LocalizationString controllers

// getLocalizationString controller
localizationStringRouter.get(
  "/localizationstrings/:localizationStringId",
  require("./get-localizationstring"),
);
// createLocalizationString controller
localizationStringRouter.post(
  "/localizationstrings",
  require("./create-localizationstring"),
);
// updateLocalizationString controller
localizationStringRouter.patch(
  "/localizationstrings/:localizationStringId",
  require("./update-localizationstring"),
);
// deleteLocalizationString controller
localizationStringRouter.delete(
  "/localizationstrings/:localizationStringId",
  require("./delete-localizationstring"),
);
// listLocalizationStrings controller
localizationStringRouter.get(
  "/localizationstrings",
  require("./list-localizationstrings"),
);

module.exports = localizationStringRouter;

const express = require("express");

// LocalizationKey Db Object Rest Api Router
const localizationKeyRouter = express.Router();

// add LocalizationKey controllers

// getLocalizationKey controller
localizationKeyRouter.get(
  "/localizationkeys/:localizationKeyId",
  require("./get-localizationkey"),
);
// createLocalizationKey controller
localizationKeyRouter.post(
  "/localizationkeys",
  require("./create-localizationkey"),
);
// updateLocalizationKey controller
localizationKeyRouter.patch(
  "/localizationkeys/:localizationKeyId",
  require("./update-localizationkey"),
);
// deleteLocalizationKey controller
localizationKeyRouter.delete(
  "/localizationkeys/:localizationKeyId",
  require("./delete-localizationkey"),
);
// listLocalizationKeys controller
localizationKeyRouter.get(
  "/localizationkeys",
  require("./list-localizationkeys"),
);

module.exports = localizationKeyRouter;

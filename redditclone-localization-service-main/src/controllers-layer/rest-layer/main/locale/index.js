const express = require("express");

// Locale Db Object Rest Api Router
const localeRouter = express.Router();

// add Locale controllers

// getLocale controller
localeRouter.get("/locales/:localeId", require("./get-locale"));
// createLocale controller
localeRouter.post("/locales", require("./create-locale"));
// updateLocale controller
localeRouter.patch("/locales/:localeId", require("./update-locale"));
// deleteLocale controller
localeRouter.delete("/locales/:localeId", require("./delete-locale"));
// listLocales controller
localeRouter.get("/locales", require("./list-locales"));

module.exports = localeRouter;

module.exports = (headers) => {
  // Locale Db Object Rest Api Router
  const localeMcpRouter = [];
  // getLocale controller
  localeMcpRouter.push(require("./get-locale")(headers));
  // createLocale controller
  localeMcpRouter.push(require("./create-locale")(headers));
  // updateLocale controller
  localeMcpRouter.push(require("./update-locale")(headers));
  // deleteLocale controller
  localeMcpRouter.push(require("./delete-locale")(headers));
  // listLocales controller
  localeMcpRouter.push(require("./list-locales")(headers));
  return localeMcpRouter;
};

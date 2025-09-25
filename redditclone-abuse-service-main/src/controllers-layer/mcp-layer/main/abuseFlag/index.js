module.exports = (headers) => {
  // AbuseFlag Db Object Rest Api Router
  const abuseFlagMcpRouter = [];
  // getAbuseFlag controller
  abuseFlagMcpRouter.push(require("./get-abuseflag")(headers));
  // createAbuseFlag controller
  abuseFlagMcpRouter.push(require("./create-abuseflag")(headers));
  // updateAbuseFlag controller
  abuseFlagMcpRouter.push(require("./update-abuseflag")(headers));
  // deleteAbuseFlag controller
  abuseFlagMcpRouter.push(require("./delete-abuseflag")(headers));
  // listAbuseFlags controller
  abuseFlagMcpRouter.push(require("./list-abuseflags")(headers));
  return abuseFlagMcpRouter;
};

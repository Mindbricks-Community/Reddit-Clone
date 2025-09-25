module.exports = (headers) => {
  // GlobalUserRestriction Db Object Rest Api Router
  const globalUserRestrictionMcpRouter = [];
  // getGlobalUserRestriction controller
  globalUserRestrictionMcpRouter.push(
    require("./get-globaluserrestriction")(headers),
  );
  // createGlobalUserRestriction controller
  globalUserRestrictionMcpRouter.push(
    require("./create-globaluserrestriction")(headers),
  );
  // updateGlobalUserRestriction controller
  globalUserRestrictionMcpRouter.push(
    require("./update-globaluserrestriction")(headers),
  );
  // deleteGlobalUserRestriction controller
  globalUserRestrictionMcpRouter.push(
    require("./delete-globaluserrestriction")(headers),
  );
  // listGlobalUserRestrictions controller
  globalUserRestrictionMcpRouter.push(
    require("./list-globaluserrestrictions")(headers),
  );
  return globalUserRestrictionMcpRouter;
};

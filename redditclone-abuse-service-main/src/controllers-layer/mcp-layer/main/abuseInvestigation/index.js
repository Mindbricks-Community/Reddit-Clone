module.exports = (headers) => {
  // AbuseInvestigation Db Object Rest Api Router
  const abuseInvestigationMcpRouter = [];
  // getAbuseInvestigation controller
  abuseInvestigationMcpRouter.push(
    require("./get-abuseinvestigation")(headers),
  );
  // createAbuseInvestigation controller
  abuseInvestigationMcpRouter.push(
    require("./create-abuseinvestigation")(headers),
  );
  // updateAbuseInvestigation controller
  abuseInvestigationMcpRouter.push(
    require("./update-abuseinvestigation")(headers),
  );
  // deleteAbuseInvestigation controller
  abuseInvestigationMcpRouter.push(
    require("./delete-abuseinvestigation")(headers),
  );
  // listAbuseInvestigations controller
  abuseInvestigationMcpRouter.push(
    require("./list-abuseinvestigations")(headers),
  );
  return abuseInvestigationMcpRouter;
};

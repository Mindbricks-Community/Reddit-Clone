module.exports = (headers) => {
  // AbuseReport Db Object Rest Api Router
  const abuseReportMcpRouter = [];
  // getAbuseReport controller
  abuseReportMcpRouter.push(require("./get-abusereport")(headers));
  // createAbuseReport controller
  abuseReportMcpRouter.push(require("./create-abusereport")(headers));
  // updateAbuseReport controller
  abuseReportMcpRouter.push(require("./update-abusereport")(headers));
  // deleteAbuseReport controller
  abuseReportMcpRouter.push(require("./delete-abusereport")(headers));
  // listAbuseReports controller
  abuseReportMcpRouter.push(require("./list-abusereports")(headers));
  return abuseReportMcpRouter;
};

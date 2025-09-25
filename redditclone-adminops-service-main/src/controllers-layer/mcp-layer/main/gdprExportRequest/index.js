module.exports = (headers) => {
  // GdprExportRequest Db Object Rest Api Router
  const gdprExportRequestMcpRouter = [];
  // getGdprExportRequest controller
  gdprExportRequestMcpRouter.push(require("./get-gdprexportrequest")(headers));
  // createGdprExportRequest controller
  gdprExportRequestMcpRouter.push(
    require("./create-gdprexportrequest")(headers),
  );
  // updateGdprExportRequest controller
  gdprExportRequestMcpRouter.push(
    require("./update-gdprexportrequest")(headers),
  );
  // deleteGdprExportRequest controller
  gdprExportRequestMcpRouter.push(
    require("./delete-gdprexportrequest")(headers),
  );
  // listGdprExportRequests controller
  gdprExportRequestMcpRouter.push(
    require("./list-gdprexportrequests")(headers),
  );
  return gdprExportRequestMcpRouter;
};

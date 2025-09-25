module.exports = (headers) => {
  // GdprDeleteRequest Db Object Rest Api Router
  const gdprDeleteRequestMcpRouter = [];
  // getGdprDeleteRequest controller
  gdprDeleteRequestMcpRouter.push(require("./get-gdprdeleterequest")(headers));
  // createGdprDeleteRequest controller
  gdprDeleteRequestMcpRouter.push(
    require("./create-gdprdeleterequest")(headers),
  );
  // updateGdprDeleteRequest controller
  gdprDeleteRequestMcpRouter.push(
    require("./update-gdprdeleterequest")(headers),
  );
  // deleteGdprDeleteRequest controller
  gdprDeleteRequestMcpRouter.push(
    require("./delete-gdprdeleterequest")(headers),
  );
  // listGdprDeleteRequests controller
  gdprDeleteRequestMcpRouter.push(
    require("./list-gdprdeleterequests")(headers),
  );
  return gdprDeleteRequestMcpRouter;
};

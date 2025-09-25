module.exports = (headers) => {
  // MediaScan Db Object Rest Api Router
  const mediaScanMcpRouter = [];
  // getMediaScan controller
  mediaScanMcpRouter.push(require("./get-mediascan")(headers));
  // createMediaScan controller
  mediaScanMcpRouter.push(require("./create-mediascan")(headers));
  // updateMediaScan controller
  mediaScanMcpRouter.push(require("./update-mediascan")(headers));
  // deleteMediaScan controller
  mediaScanMcpRouter.push(require("./delete-mediascan")(headers));
  // listMediaScans controller
  mediaScanMcpRouter.push(require("./list-mediascans")(headers));
  return mediaScanMcpRouter;
};

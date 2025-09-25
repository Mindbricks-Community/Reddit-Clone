module.exports = (headers) => {
  // MediaObject Db Object Rest Api Router
  const mediaObjectMcpRouter = [];
  // getMediaObject controller
  mediaObjectMcpRouter.push(require("./get-mediaobject")(headers));
  // createMediaObject controller
  mediaObjectMcpRouter.push(require("./create-mediaobject")(headers));
  // updateMediaObject controller
  mediaObjectMcpRouter.push(require("./update-mediaobject")(headers));
  // deleteMediaObject controller
  mediaObjectMcpRouter.push(require("./delete-mediaobject")(headers));
  // listMediaObjects controller
  mediaObjectMcpRouter.push(require("./list-mediaobjects")(headers));
  return mediaObjectMcpRouter;
};

module.exports = {
  MediaServiceManager: require("./service-manager/MediaServiceManager"),
  // main Database Crud Object Routes Manager Layer Classes
  // MediaObject Db Object
  GetMediaObjectManager: require("./main/mediaObject/get-mediaobject"),
  CreateMediaObjectManager: require("./main/mediaObject/create-mediaobject"),
  UpdateMediaObjectManager: require("./main/mediaObject/update-mediaobject"),
  DeleteMediaObjectManager: require("./main/mediaObject/delete-mediaobject"),
  ListMediaObjectsManager: require("./main/mediaObject/list-mediaobjects"),
  // MediaScan Db Object
  GetMediaScanManager: require("./main/mediaScan/get-mediascan"),
  CreateMediaScanManager: require("./main/mediaScan/create-mediascan"),
  UpdateMediaScanManager: require("./main/mediaScan/update-mediascan"),
  DeleteMediaScanManager: require("./main/mediaScan/delete-mediascan"),
  ListMediaScansManager: require("./main/mediaScan/list-mediascans"),
};

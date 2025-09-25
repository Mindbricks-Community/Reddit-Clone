module.exports = {
  // main Database Crud Object Routes Manager Layer Classes
  // MediaObject Db Object
  GetMediaObjectManager: require("./mediaObject/get-mediaobject"),
  CreateMediaObjectManager: require("./mediaObject/create-mediaobject"),
  UpdateMediaObjectManager: require("./mediaObject/update-mediaobject"),
  DeleteMediaObjectManager: require("./mediaObject/delete-mediaobject"),
  ListMediaObjectsManager: require("./mediaObject/list-mediaobjects"),
  // MediaScan Db Object
  GetMediaScanManager: require("./mediaScan/get-mediascan"),
  CreateMediaScanManager: require("./mediaScan/create-mediascan"),
  UpdateMediaScanManager: require("./mediaScan/update-mediascan"),
  DeleteMediaScanManager: require("./mediaScan/delete-mediascan"),
  ListMediaScansManager: require("./mediaScan/list-mediascans"),
};

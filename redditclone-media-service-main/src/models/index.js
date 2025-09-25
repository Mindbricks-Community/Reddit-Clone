const { DataTypes } = require("sequelize");
const { getEnumValue } = require("serviceCommon");
const { ElasticIndexer } = require("serviceCommon");
const updateElasticIndexMappings = require("./elastic-index");
const { hexaLogger } = require("common");

const MediaObject = require("./mediaObject");
const MediaScan = require("./mediaScan");

MediaObject.prototype.getData = function () {
  const data = this.dataValues;

  for (const key of Object.keys(data)) {
    if (key.startsWith("json_")) {
      data[key] = JSON.parse(data[key]);
      const newKey = key.slice(5);
      data[newKey] = data[key];
      delete data[key];
    }
  }

  // set enum Index and enum value
  const mediaTypeOptions = [
    "image",
    "video",
    "gif",
    "document",
    "audio",
    "other",
  ];
  const dataTypemediaTypeMediaObject = typeof data.mediaType;
  const enumIndexmediaTypeMediaObject =
    dataTypemediaTypeMediaObject === "string"
      ? mediaTypeOptions.indexOf(data.mediaType)
      : data.mediaType;
  data.mediaType_idx = enumIndexmediaTypeMediaObject;
  data.mediaType =
    enumIndexmediaTypeMediaObject > -1
      ? mediaTypeOptions[enumIndexmediaTypeMediaObject]
      : undefined;
  // set enum Index and enum value
  const statusOptions = [
    "pending",
    "ready",
    "failed",
    "quarantined",
    "deleted",
  ];
  const dataTypestatusMediaObject = typeof data.status;
  const enumIndexstatusMediaObject =
    dataTypestatusMediaObject === "string"
      ? statusOptions.indexOf(data.status)
      : data.status;
  data.status_idx = enumIndexstatusMediaObject;
  data.status =
    enumIndexstatusMediaObject > -1
      ? statusOptions[enumIndexstatusMediaObject]
      : undefined;
  // set enum Index and enum value
  const malwareStatusOptions = ["unknown", "clean", "flagged", "infected"];
  const dataTypemalwareStatusMediaObject = typeof data.malwareStatus;
  const enumIndexmalwareStatusMediaObject =
    dataTypemalwareStatusMediaObject === "string"
      ? malwareStatusOptions.indexOf(data.malwareStatus)
      : data.malwareStatus;
  data.malwareStatus_idx = enumIndexmalwareStatusMediaObject;
  data.malwareStatus =
    enumIndexmalwareStatusMediaObject > -1
      ? malwareStatusOptions[enumIndexmalwareStatusMediaObject]
      : undefined;

  data._owner = data.ownerUserId ?? undefined;
  return data;
};

MediaScan.prototype.getData = function () {
  const data = this.dataValues;

  data.mediaObject = this.mediaObject ? this.mediaObject.getData() : undefined;

  for (const key of Object.keys(data)) {
    if (key.startsWith("json_")) {
      data[key] = JSON.parse(data[key]);
      const newKey = key.slice(5);
      data[newKey] = data[key];
      delete data[key];
    }
  }

  // set enum Index and enum value
  const scanTypeOptions = ["nsfw", "malware", "other", "combined"];
  const dataTypescanTypeMediaScan = typeof data.scanType;
  const enumIndexscanTypeMediaScan =
    dataTypescanTypeMediaScan === "string"
      ? scanTypeOptions.indexOf(data.scanType)
      : data.scanType;
  data.scanType_idx = enumIndexscanTypeMediaScan;
  data.scanType =
    enumIndexscanTypeMediaScan > -1
      ? scanTypeOptions[enumIndexscanTypeMediaScan]
      : undefined;
  // set enum Index and enum value
  const scanStatusOptions = ["pending", "success", "failed"];
  const dataTypescanStatusMediaScan = typeof data.scanStatus;
  const enumIndexscanStatusMediaScan =
    dataTypescanStatusMediaScan === "string"
      ? scanStatusOptions.indexOf(data.scanStatus)
      : data.scanStatus;
  data.scanStatus_idx = enumIndexscanStatusMediaScan;
  data.scanStatus =
    enumIndexscanStatusMediaScan > -1
      ? scanStatusOptions[enumIndexscanStatusMediaScan]
      : undefined;

  return data;
};

MediaScan.belongsTo(MediaObject, {
  as: "mediaObject",
  foreignKey: "mediaObjectId",
  targetKey: "id",
  constraints: false,
});

module.exports = {
  MediaObject,
  MediaScan,
  updateElasticIndexMappings,
};

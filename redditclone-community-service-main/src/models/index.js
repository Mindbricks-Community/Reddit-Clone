const { DataTypes } = require("sequelize");
const { getEnumValue } = require("serviceCommon");
const { ElasticIndexer } = require("serviceCommon");
const updateElasticIndexMappings = require("./elastic-index");
const { hexaLogger } = require("common");

const Community = require("./community");
const CommunityMember = require("./communityMember");
const CommunityRule = require("./communityRule");
const CommunityPinned = require("./communityPinned");
const CommunityAutomodSetting = require("./communityAutomodSetting");

Community.prototype.getData = function () {
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
  const privacyLevelOptions = ["public", "restricted", "private"];
  const dataTypeprivacyLevelCommunity = typeof data.privacyLevel;
  const enumIndexprivacyLevelCommunity =
    dataTypeprivacyLevelCommunity === "string"
      ? privacyLevelOptions.indexOf(data.privacyLevel)
      : data.privacyLevel;
  data.privacyLevel_idx = enumIndexprivacyLevelCommunity;
  data.privacyLevel =
    enumIndexprivacyLevelCommunity > -1
      ? privacyLevelOptions[enumIndexprivacyLevelCommunity]
      : undefined;
  // set enum Index and enum value
  const allowedPostTypesOptions = [
    "text",
    "link",
    "image",
    "video",
    "gallery",
    "poll",
  ];
  const dataTypeallowedPostTypesCommunity = typeof data.allowedPostTypes;
  const enumIndexallowedPostTypesCommunity =
    dataTypeallowedPostTypesCommunity === "string"
      ? allowedPostTypesOptions.indexOf(data.allowedPostTypes)
      : data.allowedPostTypes;
  data.allowedPostTypes_idx = enumIndexallowedPostTypesCommunity;
  data.allowedPostTypes =
    enumIndexallowedPostTypesCommunity > -1
      ? allowedPostTypesOptions[enumIndexallowedPostTypesCommunity]
      : undefined;

  data._owner = data.creatorId ?? undefined;
  return data;
};

CommunityMember.prototype.getData = function () {
  const data = this.dataValues;

  data.community = this.community ? this.community.getData() : undefined;

  for (const key of Object.keys(data)) {
    if (key.startsWith("json_")) {
      data[key] = JSON.parse(data[key]);
      const newKey = key.slice(5);
      data[newKey] = data[key];
      delete data[key];
    }
  }

  // set enum Index and enum value
  const roleOptions = ["member", "moderator", "admin"];
  const dataTyperoleCommunityMember = typeof data.role;
  const enumIndexroleCommunityMember =
    dataTyperoleCommunityMember === "string"
      ? roleOptions.indexOf(data.role)
      : data.role;
  data.role_idx = enumIndexroleCommunityMember;
  data.role =
    enumIndexroleCommunityMember > -1
      ? roleOptions[enumIndexroleCommunityMember]
      : undefined;
  // set enum Index and enum value
  const statusOptions = [
    "active",
    "pending",
    "banned",
    "invite_sent",
    "removed",
  ];
  const dataTypestatusCommunityMember = typeof data.status;
  const enumIndexstatusCommunityMember =
    dataTypestatusCommunityMember === "string"
      ? statusOptions.indexOf(data.status)
      : data.status;
  data.status_idx = enumIndexstatusCommunityMember;
  data.status =
    enumIndexstatusCommunityMember > -1
      ? statusOptions[enumIndexstatusCommunityMember]
      : undefined;

  data._owner = data.userId ?? undefined;
  return data;
};

CommunityMember.belongsTo(Community, {
  as: "community",
  foreignKey: "communityId",
  targetKey: "id",
  constraints: false,
});

CommunityRule.prototype.getData = function () {
  const data = this.dataValues;

  data.community = this.community ? this.community.getData() : undefined;

  for (const key of Object.keys(data)) {
    if (key.startsWith("json_")) {
      data[key] = JSON.parse(data[key]);
      const newKey = key.slice(5);
      data[newKey] = data[key];
      delete data[key];
    }
  }

  return data;
};

CommunityRule.belongsTo(Community, {
  as: "community",
  foreignKey: "communityId",
  targetKey: "id",
  constraints: false,
});

CommunityPinned.prototype.getData = function () {
  const data = this.dataValues;

  data.community = this.community ? this.community.getData() : undefined;

  for (const key of Object.keys(data)) {
    if (key.startsWith("json_")) {
      data[key] = JSON.parse(data[key]);
      const newKey = key.slice(5);
      data[newKey] = data[key];
      delete data[key];
    }
  }

  // set enum Index and enum value
  const targetTypeOptions = ["post", "rule", "announcement"];
  const dataTypetargetTypeCommunityPinned = typeof data.targetType;
  const enumIndextargetTypeCommunityPinned =
    dataTypetargetTypeCommunityPinned === "string"
      ? targetTypeOptions.indexOf(data.targetType)
      : data.targetType;
  data.targetType_idx = enumIndextargetTypeCommunityPinned;
  data.targetType =
    enumIndextargetTypeCommunityPinned > -1
      ? targetTypeOptions[enumIndextargetTypeCommunityPinned]
      : undefined;

  return data;
};

CommunityPinned.belongsTo(Community, {
  as: "community",
  foreignKey: "communityId",
  targetKey: "id",
  constraints: false,
});

CommunityAutomodSetting.prototype.getData = function () {
  const data = this.dataValues;

  data.community = this.community ? this.community.getData() : undefined;

  for (const key of Object.keys(data)) {
    if (key.startsWith("json_")) {
      data[key] = JSON.parse(data[key]);
      const newKey = key.slice(5);
      data[newKey] = data[key];
      delete data[key];
    }
  }

  return data;
};

CommunityAutomodSetting.belongsTo(Community, {
  as: "community",
  foreignKey: "communityId",
  targetKey: "id",
  constraints: false,
});

module.exports = {
  Community,
  CommunityMember,
  CommunityRule,
  CommunityPinned,
  CommunityAutomodSetting,
  updateElasticIndexMappings,
};

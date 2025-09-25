const { DataTypes } = require("sequelize");
const { getEnumValue } = require("serviceCommon");
const { ElasticIndexer } = require("serviceCommon");
const updateElasticIndexMappings = require("./elastic-index");
const { hexaLogger } = require("common");

const Locale = require("./locale");
const LocalizationKey = require("./localizationKey");
const LocalizationString = require("./localizationString");

Locale.prototype.getData = function () {
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
  const directionOptions = ["ltr", "rtl"];
  const dataTypedirectionLocale = typeof data.direction;
  const enumIndexdirectionLocale =
    dataTypedirectionLocale === "string"
      ? directionOptions.indexOf(data.direction)
      : data.direction;
  data.direction_idx = enumIndexdirectionLocale;
  data.direction =
    enumIndexdirectionLocale > -1
      ? directionOptions[enumIndexdirectionLocale]
      : undefined;

  return data;
};

LocalizationKey.prototype.getData = function () {
  const data = this.dataValues;

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

LocalizationString.prototype.getData = function () {
  const data = this.dataValues;

  data.key = this.key ? this.key.getData() : undefined;
  data.locale = this.locale ? this.locale.getData() : undefined;

  for (const key of Object.keys(data)) {
    if (key.startsWith("json_")) {
      data[key] = JSON.parse(data[key]);
      const newKey = key.slice(5);
      data[newKey] = data[key];
      delete data[key];
    }
  }

  // set enum Index and enum value
  const statusOptions = ["pending", "inReview", "approved"];
  const dataTypestatusLocalizationString = typeof data.status;
  const enumIndexstatusLocalizationString =
    dataTypestatusLocalizationString === "string"
      ? statusOptions.indexOf(data.status)
      : data.status;
  data.status_idx = enumIndexstatusLocalizationString;
  data.status =
    enumIndexstatusLocalizationString > -1
      ? statusOptions[enumIndexstatusLocalizationString]
      : undefined;

  return data;
};

LocalizationString.belongsTo(LocalizationKey, {
  as: "key",
  foreignKey: "keyId",
  targetKey: "id",
  constraints: false,
});

LocalizationString.belongsTo(Locale, {
  as: "locale",
  foreignKey: "localeId",
  targetKey: "id",
  constraints: false,
});

module.exports = {
  Locale,
  LocalizationKey,
  LocalizationString,
  updateElasticIndexMappings,
};

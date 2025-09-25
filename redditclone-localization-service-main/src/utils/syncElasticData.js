const { getLocaleById, getIdListOfLocaleByField } = require("dbLayer");
const {
  getLocalizationKeyById,
  getIdListOfLocalizationKeyByField,
} = require("dbLayer");
const {
  getLocalizationStringById,
  getIdListOfLocalizationStringByField,
} = require("dbLayer");
const path = require("path");
const fs = require("fs");
const { ElasticIndexer } = require("serviceCommon");

const indexLocaleData = async () => {
  const localeIndexer = new ElasticIndexer("locale", { isSilent: true });
  console.log("Starting to update indexes for Locale");

  const idList = (await getIdListOfLocaleByField("isActive", true)) ?? [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getLocaleById(chunk);
    if (dataList.length) {
      await localeIndexer.indexBulkData(dataList);
      await localeIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const indexLocalizationKeyData = async () => {
  const localizationKeyIndexer = new ElasticIndexer("localizationKey", {
    isSilent: true,
  });
  console.log("Starting to update indexes for LocalizationKey");

  const idList =
    (await getIdListOfLocalizationKeyByField("isActive", true)) ?? [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getLocalizationKeyById(chunk);
    if (dataList.length) {
      await localizationKeyIndexer.indexBulkData(dataList);
      await localizationKeyIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const indexLocalizationStringData = async () => {
  const localizationStringIndexer = new ElasticIndexer("localizationString", {
    isSilent: true,
  });
  console.log("Starting to update indexes for LocalizationString");

  const idList =
    (await getIdListOfLocalizationStringByField("isActive", true)) ?? [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getLocalizationStringById(chunk);
    if (dataList.length) {
      await localizationStringIndexer.indexBulkData(dataList);
      await localizationStringIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const syncElasticIndexData = async () => {
  const startTime = new Date();
  console.log("syncElasticIndexData started", startTime);

  try {
    const dataCount = await indexLocaleData();
    console.log("Locale agregated data is indexed, total locales:", dataCount);
  } catch (err) {
    console.log("Elastic Index Error When Syncing Locale data", err.toString());
  }

  try {
    const dataCount = await indexLocalizationKeyData();
    console.log(
      "LocalizationKey agregated data is indexed, total localizationKeys:",
      dataCount,
    );
  } catch (err) {
    console.log(
      "Elastic Index Error When Syncing LocalizationKey data",
      err.toString(),
    );
  }

  try {
    const dataCount = await indexLocalizationStringData();
    console.log(
      "LocalizationString agregated data is indexed, total localizationStrings:",
      dataCount,
    );
  } catch (err) {
    console.log(
      "Elastic Index Error When Syncing LocalizationString data",
      err.toString(),
    );
  }

  const elapsedTime = new Date() - startTime;
  console.log("initElasticIndexData ended -> elapsedTime:", elapsedTime);
};

module.exports = syncElasticIndexData;

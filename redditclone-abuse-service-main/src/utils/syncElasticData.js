const {
  getAbuseReportById,
  getIdListOfAbuseReportByField,
} = require("dbLayer");
const { getAbuseFlagById, getIdListOfAbuseFlagByField } = require("dbLayer");
const {
  getAbuseHeuristicTriggerById,
  getIdListOfAbuseHeuristicTriggerByField,
} = require("dbLayer");
const {
  getAbuseInvestigationById,
  getIdListOfAbuseInvestigationByField,
} = require("dbLayer");
const path = require("path");
const fs = require("fs");
const { ElasticIndexer } = require("serviceCommon");

const indexAbuseReportData = async () => {
  const abuseReportIndexer = new ElasticIndexer("abuseReport", {
    isSilent: true,
  });
  console.log("Starting to update indexes for AbuseReport");

  const idList = (await getIdListOfAbuseReportByField("isActive", true)) ?? [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getAbuseReportById(chunk);
    if (dataList.length) {
      await abuseReportIndexer.indexBulkData(dataList);
      await abuseReportIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const indexAbuseFlagData = async () => {
  const abuseFlagIndexer = new ElasticIndexer("abuseFlag", { isSilent: true });
  console.log("Starting to update indexes for AbuseFlag");

  const idList = (await getIdListOfAbuseFlagByField("isActive", true)) ?? [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getAbuseFlagById(chunk);
    if (dataList.length) {
      await abuseFlagIndexer.indexBulkData(dataList);
      await abuseFlagIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const indexAbuseHeuristicTriggerData = async () => {
  const abuseHeuristicTriggerIndexer = new ElasticIndexer(
    "abuseHeuristicTrigger",
    { isSilent: true },
  );
  console.log("Starting to update indexes for AbuseHeuristicTrigger");

  const idList =
    (await getIdListOfAbuseHeuristicTriggerByField("isActive", true)) ?? [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getAbuseHeuristicTriggerById(chunk);
    if (dataList.length) {
      await abuseHeuristicTriggerIndexer.indexBulkData(dataList);
      await abuseHeuristicTriggerIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const indexAbuseInvestigationData = async () => {
  const abuseInvestigationIndexer = new ElasticIndexer("abuseInvestigation", {
    isSilent: true,
  });
  console.log("Starting to update indexes for AbuseInvestigation");

  const idList =
    (await getIdListOfAbuseInvestigationByField("isActive", true)) ?? [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getAbuseInvestigationById(chunk);
    if (dataList.length) {
      await abuseInvestigationIndexer.indexBulkData(dataList);
      await abuseInvestigationIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const syncElasticIndexData = async () => {
  const startTime = new Date();
  console.log("syncElasticIndexData started", startTime);

  try {
    const dataCount = await indexAbuseReportData();
    console.log(
      "AbuseReport agregated data is indexed, total abuseReports:",
      dataCount,
    );
  } catch (err) {
    console.log(
      "Elastic Index Error When Syncing AbuseReport data",
      err.toString(),
    );
  }

  try {
    const dataCount = await indexAbuseFlagData();
    console.log(
      "AbuseFlag agregated data is indexed, total abuseFlags:",
      dataCount,
    );
  } catch (err) {
    console.log(
      "Elastic Index Error When Syncing AbuseFlag data",
      err.toString(),
    );
  }

  try {
    const dataCount = await indexAbuseHeuristicTriggerData();
    console.log(
      "AbuseHeuristicTrigger agregated data is indexed, total abuseHeuristicTriggers:",
      dataCount,
    );
  } catch (err) {
    console.log(
      "Elastic Index Error When Syncing AbuseHeuristicTrigger data",
      err.toString(),
    );
  }

  try {
    const dataCount = await indexAbuseInvestigationData();
    console.log(
      "AbuseInvestigation agregated data is indexed, total abuseInvestigations:",
      dataCount,
    );
  } catch (err) {
    console.log(
      "Elastic Index Error When Syncing AbuseInvestigation data",
      err.toString(),
    );
  }

  const elapsedTime = new Date() - startTime;
  console.log("initElasticIndexData ended -> elapsedTime:", elapsedTime);
};

module.exports = syncElasticIndexData;

const {
  getSystemMetricById,
  getIdListOfSystemMetricByField,
} = require("dbLayer");
const { getErrorLogById, getIdListOfErrorLogByField } = require("dbLayer");
const { getSloEventById, getIdListOfSloEventByField } = require("dbLayer");
const { getAuditLogById, getIdListOfAuditLogByField } = require("dbLayer");
const { getAlertById, getIdListOfAlertByField } = require("dbLayer");
const path = require("path");
const fs = require("fs");
const { ElasticIndexer } = require("serviceCommon");

const indexSystemMetricData = async () => {
  const systemMetricIndexer = new ElasticIndexer("systemMetric", {
    isSilent: true,
  });
  console.log("Starting to update indexes for SystemMetric");

  const idList = (await getIdListOfSystemMetricByField("isActive", true)) ?? [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getSystemMetricById(chunk);
    if (dataList.length) {
      await systemMetricIndexer.indexBulkData(dataList);
      await systemMetricIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const indexErrorLogData = async () => {
  const errorLogIndexer = new ElasticIndexer("errorLog", { isSilent: true });
  console.log("Starting to update indexes for ErrorLog");

  const idList = (await getIdListOfErrorLogByField("isActive", true)) ?? [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getErrorLogById(chunk);
    if (dataList.length) {
      await errorLogIndexer.indexBulkData(dataList);
      await errorLogIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const indexSloEventData = async () => {
  const sloEventIndexer = new ElasticIndexer("sloEvent", { isSilent: true });
  console.log("Starting to update indexes for SloEvent");

  const idList = (await getIdListOfSloEventByField("isActive", true)) ?? [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getSloEventById(chunk);
    if (dataList.length) {
      await sloEventIndexer.indexBulkData(dataList);
      await sloEventIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const indexAuditLogData = async () => {
  const auditLogIndexer = new ElasticIndexer("auditLog", { isSilent: true });
  console.log("Starting to update indexes for AuditLog");

  const idList = (await getIdListOfAuditLogByField("isActive", true)) ?? [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getAuditLogById(chunk);
    if (dataList.length) {
      await auditLogIndexer.indexBulkData(dataList);
      await auditLogIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const indexAlertData = async () => {
  const alertIndexer = new ElasticIndexer("alert", { isSilent: true });
  console.log("Starting to update indexes for Alert");

  const idList = (await getIdListOfAlertByField("isActive", true)) ?? [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getAlertById(chunk);
    if (dataList.length) {
      await alertIndexer.indexBulkData(dataList);
      await alertIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const syncElasticIndexData = async () => {
  const startTime = new Date();
  console.log("syncElasticIndexData started", startTime);

  try {
    const dataCount = await indexSystemMetricData();
    console.log(
      "SystemMetric agregated data is indexed, total systemMetrics:",
      dataCount,
    );
  } catch (err) {
    console.log(
      "Elastic Index Error When Syncing SystemMetric data",
      err.toString(),
    );
  }

  try {
    const dataCount = await indexErrorLogData();
    console.log(
      "ErrorLog agregated data is indexed, total errorLogs:",
      dataCount,
    );
  } catch (err) {
    console.log(
      "Elastic Index Error When Syncing ErrorLog data",
      err.toString(),
    );
  }

  try {
    const dataCount = await indexSloEventData();
    console.log(
      "SloEvent agregated data is indexed, total sloEvents:",
      dataCount,
    );
  } catch (err) {
    console.log(
      "Elastic Index Error When Syncing SloEvent data",
      err.toString(),
    );
  }

  try {
    const dataCount = await indexAuditLogData();
    console.log(
      "AuditLog agregated data is indexed, total auditLogs:",
      dataCount,
    );
  } catch (err) {
    console.log(
      "Elastic Index Error When Syncing AuditLog data",
      err.toString(),
    );
  }

  try {
    const dataCount = await indexAlertData();
    console.log("Alert agregated data is indexed, total alerts:", dataCount);
  } catch (err) {
    console.log("Elastic Index Error When Syncing Alert data", err.toString());
  }

  const elapsedTime = new Date() - startTime;
  console.log("initElasticIndexData ended -> elapsedTime:", elapsedTime);
};

module.exports = syncElasticIndexData;

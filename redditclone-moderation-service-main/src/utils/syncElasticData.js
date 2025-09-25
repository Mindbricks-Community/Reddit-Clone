const {
  getModerationActionById,
  getIdListOfModerationActionByField,
} = require("dbLayer");
const {
  getAutomodEventById,
  getIdListOfAutomodEventByField,
} = require("dbLayer");
const {
  getModerationAuditLogById,
  getIdListOfModerationAuditLogByField,
} = require("dbLayer");
const {
  getModmailThreadById,
  getIdListOfModmailThreadByField,
} = require("dbLayer");
const {
  getModmailMessageById,
  getIdListOfModmailMessageByField,
} = require("dbLayer");
const path = require("path");
const fs = require("fs");
const { ElasticIndexer } = require("serviceCommon");

const indexModerationActionData = async () => {
  const moderationActionIndexer = new ElasticIndexer("moderationAction", {
    isSilent: true,
  });
  console.log("Starting to update indexes for ModerationAction");

  const idList =
    (await getIdListOfModerationActionByField("isActive", true)) ?? [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getModerationActionById(chunk);
    if (dataList.length) {
      await moderationActionIndexer.indexBulkData(dataList);
      await moderationActionIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const indexAutomodEventData = async () => {
  const automodEventIndexer = new ElasticIndexer("automodEvent", {
    isSilent: true,
  });
  console.log("Starting to update indexes for AutomodEvent");

  const idList = (await getIdListOfAutomodEventByField("isActive", true)) ?? [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getAutomodEventById(chunk);
    if (dataList.length) {
      await automodEventIndexer.indexBulkData(dataList);
      await automodEventIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const indexModerationAuditLogData = async () => {
  const moderationAuditLogIndexer = new ElasticIndexer("moderationAuditLog", {
    isSilent: true,
  });
  console.log("Starting to update indexes for ModerationAuditLog");

  const idList =
    (await getIdListOfModerationAuditLogByField("isActive", true)) ?? [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getModerationAuditLogById(chunk);
    if (dataList.length) {
      await moderationAuditLogIndexer.indexBulkData(dataList);
      await moderationAuditLogIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const indexModmailThreadData = async () => {
  const modmailThreadIndexer = new ElasticIndexer("modmailThread", {
    isSilent: true,
  });
  console.log("Starting to update indexes for ModmailThread");

  const idList =
    (await getIdListOfModmailThreadByField("isActive", true)) ?? [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getModmailThreadById(chunk);
    if (dataList.length) {
      await modmailThreadIndexer.indexBulkData(dataList);
      await modmailThreadIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const indexModmailMessageData = async () => {
  const modmailMessageIndexer = new ElasticIndexer("modmailMessage", {
    isSilent: true,
  });
  console.log("Starting to update indexes for ModmailMessage");

  const idList =
    (await getIdListOfModmailMessageByField("isActive", true)) ?? [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getModmailMessageById(chunk);
    if (dataList.length) {
      await modmailMessageIndexer.indexBulkData(dataList);
      await modmailMessageIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const syncElasticIndexData = async () => {
  const startTime = new Date();
  console.log("syncElasticIndexData started", startTime);

  try {
    const dataCount = await indexModerationActionData();
    console.log(
      "ModerationAction agregated data is indexed, total moderationActions:",
      dataCount,
    );
  } catch (err) {
    console.log(
      "Elastic Index Error When Syncing ModerationAction data",
      err.toString(),
    );
  }

  try {
    const dataCount = await indexAutomodEventData();
    console.log(
      "AutomodEvent agregated data is indexed, total automodEvents:",
      dataCount,
    );
  } catch (err) {
    console.log(
      "Elastic Index Error When Syncing AutomodEvent data",
      err.toString(),
    );
  }

  try {
    const dataCount = await indexModerationAuditLogData();
    console.log(
      "ModerationAuditLog agregated data is indexed, total moderationAuditLogs:",
      dataCount,
    );
  } catch (err) {
    console.log(
      "Elastic Index Error When Syncing ModerationAuditLog data",
      err.toString(),
    );
  }

  try {
    const dataCount = await indexModmailThreadData();
    console.log(
      "ModmailThread agregated data is indexed, total modmailThreads:",
      dataCount,
    );
  } catch (err) {
    console.log(
      "Elastic Index Error When Syncing ModmailThread data",
      err.toString(),
    );
  }

  try {
    const dataCount = await indexModmailMessageData();
    console.log(
      "ModmailMessage agregated data is indexed, total modmailMessages:",
      dataCount,
    );
  } catch (err) {
    console.log(
      "Elastic Index Error When Syncing ModmailMessage data",
      err.toString(),
    );
  }

  const elapsedTime = new Date() - startTime;
  console.log("initElasticIndexData ended -> elapsedTime:", elapsedTime);
};

module.exports = syncElasticIndexData;

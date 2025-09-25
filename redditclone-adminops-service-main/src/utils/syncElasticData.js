const {
  getAdminUserActionById,
  getIdListOfAdminUserActionByField,
} = require("dbLayer");
const {
  getGdprExportRequestById,
  getIdListOfGdprExportRequestByField,
} = require("dbLayer");
const {
  getGdprDeleteRequestById,
  getIdListOfGdprDeleteRequestByField,
} = require("dbLayer");
const {
  getCompliancePolicyById,
  getIdListOfCompliancePolicyByField,
} = require("dbLayer");
const {
  getGlobalUserRestrictionById,
  getIdListOfGlobalUserRestrictionByField,
} = require("dbLayer");
const path = require("path");
const fs = require("fs");
const { ElasticIndexer } = require("serviceCommon");

const indexAdminUserActionData = async () => {
  const adminUserActionIndexer = new ElasticIndexer("adminUserAction", {
    isSilent: true,
  });
  console.log("Starting to update indexes for AdminUserAction");

  const idList =
    (await getIdListOfAdminUserActionByField("isActive", true)) ?? [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getAdminUserActionById(chunk);
    if (dataList.length) {
      await adminUserActionIndexer.indexBulkData(dataList);
      await adminUserActionIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const indexGdprExportRequestData = async () => {
  const gdprExportRequestIndexer = new ElasticIndexer("gdprExportRequest", {
    isSilent: true,
  });
  console.log("Starting to update indexes for GdprExportRequest");

  const idList =
    (await getIdListOfGdprExportRequestByField("isActive", true)) ?? [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getGdprExportRequestById(chunk);
    if (dataList.length) {
      await gdprExportRequestIndexer.indexBulkData(dataList);
      await gdprExportRequestIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const indexGdprDeleteRequestData = async () => {
  const gdprDeleteRequestIndexer = new ElasticIndexer("gdprDeleteRequest", {
    isSilent: true,
  });
  console.log("Starting to update indexes for GdprDeleteRequest");

  const idList =
    (await getIdListOfGdprDeleteRequestByField("isActive", true)) ?? [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getGdprDeleteRequestById(chunk);
    if (dataList.length) {
      await gdprDeleteRequestIndexer.indexBulkData(dataList);
      await gdprDeleteRequestIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const indexCompliancePolicyData = async () => {
  const compliancePolicyIndexer = new ElasticIndexer("compliancePolicy", {
    isSilent: true,
  });
  console.log("Starting to update indexes for CompliancePolicy");

  const idList =
    (await getIdListOfCompliancePolicyByField("isActive", true)) ?? [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getCompliancePolicyById(chunk);
    if (dataList.length) {
      await compliancePolicyIndexer.indexBulkData(dataList);
      await compliancePolicyIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const indexGlobalUserRestrictionData = async () => {
  const globalUserRestrictionIndexer = new ElasticIndexer(
    "globalUserRestriction",
    { isSilent: true },
  );
  console.log("Starting to update indexes for GlobalUserRestriction");

  const idList =
    (await getIdListOfGlobalUserRestrictionByField("isActive", true)) ?? [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getGlobalUserRestrictionById(chunk);
    if (dataList.length) {
      await globalUserRestrictionIndexer.indexBulkData(dataList);
      await globalUserRestrictionIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const syncElasticIndexData = async () => {
  const startTime = new Date();
  console.log("syncElasticIndexData started", startTime);

  try {
    const dataCount = await indexAdminUserActionData();
    console.log(
      "AdminUserAction agregated data is indexed, total adminUserActions:",
      dataCount,
    );
  } catch (err) {
    console.log(
      "Elastic Index Error When Syncing AdminUserAction data",
      err.toString(),
    );
  }

  try {
    const dataCount = await indexGdprExportRequestData();
    console.log(
      "GdprExportRequest agregated data is indexed, total gdprExportRequests:",
      dataCount,
    );
  } catch (err) {
    console.log(
      "Elastic Index Error When Syncing GdprExportRequest data",
      err.toString(),
    );
  }

  try {
    const dataCount = await indexGdprDeleteRequestData();
    console.log(
      "GdprDeleteRequest agregated data is indexed, total gdprDeleteRequests:",
      dataCount,
    );
  } catch (err) {
    console.log(
      "Elastic Index Error When Syncing GdprDeleteRequest data",
      err.toString(),
    );
  }

  try {
    const dataCount = await indexCompliancePolicyData();
    console.log(
      "CompliancePolicy agregated data is indexed, total compliancePolicies:",
      dataCount,
    );
  } catch (err) {
    console.log(
      "Elastic Index Error When Syncing CompliancePolicy data",
      err.toString(),
    );
  }

  try {
    const dataCount = await indexGlobalUserRestrictionData();
    console.log(
      "GlobalUserRestriction agregated data is indexed, total globalUserRestrictions:",
      dataCount,
    );
  } catch (err) {
    console.log(
      "Elastic Index Error When Syncing GlobalUserRestriction data",
      err.toString(),
    );
  }

  const elapsedTime = new Date() - startTime;
  console.log("initElasticIndexData ended -> elapsedTime:", elapsedTime);
};

module.exports = syncElasticIndexData;

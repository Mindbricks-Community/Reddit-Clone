const { getCommunityById, getIdListOfCommunityByField } = require("dbLayer");
const {
  getCommunityMemberById,
  getIdListOfCommunityMemberByField,
} = require("dbLayer");
const {
  getCommunityRuleById,
  getIdListOfCommunityRuleByField,
} = require("dbLayer");
const {
  getCommunityPinnedById,
  getIdListOfCommunityPinnedByField,
} = require("dbLayer");
const {
  getCommunityAutomodSettingById,
  getIdListOfCommunityAutomodSettingByField,
} = require("dbLayer");
const path = require("path");
const fs = require("fs");
const { ElasticIndexer } = require("serviceCommon");

const indexCommunityData = async () => {
  const communityIndexer = new ElasticIndexer("community", { isSilent: true });
  console.log("Starting to update indexes for Community");

  const idList = (await getIdListOfCommunityByField("isActive", true)) ?? [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getCommunityById(chunk);
    if (dataList.length) {
      await communityIndexer.indexBulkData(dataList);
      await communityIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const indexCommunityMemberData = async () => {
  const communityMemberIndexer = new ElasticIndexer("communityMember", {
    isSilent: true,
  });
  console.log("Starting to update indexes for CommunityMember");

  const idList =
    (await getIdListOfCommunityMemberByField("isActive", true)) ?? [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getCommunityMemberById(chunk);
    if (dataList.length) {
      await communityMemberIndexer.indexBulkData(dataList);
      await communityMemberIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const indexCommunityRuleData = async () => {
  const communityRuleIndexer = new ElasticIndexer("communityRule", {
    isSilent: true,
  });
  console.log("Starting to update indexes for CommunityRule");

  const idList =
    (await getIdListOfCommunityRuleByField("isActive", true)) ?? [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getCommunityRuleById(chunk);
    if (dataList.length) {
      await communityRuleIndexer.indexBulkData(dataList);
      await communityRuleIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const indexCommunityPinnedData = async () => {
  const communityPinnedIndexer = new ElasticIndexer("communityPinned", {
    isSilent: true,
  });
  console.log("Starting to update indexes for CommunityPinned");

  const idList =
    (await getIdListOfCommunityPinnedByField("isActive", true)) ?? [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getCommunityPinnedById(chunk);
    if (dataList.length) {
      await communityPinnedIndexer.indexBulkData(dataList);
      await communityPinnedIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const indexCommunityAutomodSettingData = async () => {
  const communityAutomodSettingIndexer = new ElasticIndexer(
    "communityAutomodSetting",
    { isSilent: true },
  );
  console.log("Starting to update indexes for CommunityAutomodSetting");

  const idList =
    (await getIdListOfCommunityAutomodSettingByField("isActive", true)) ?? [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getCommunityAutomodSettingById(chunk);
    if (dataList.length) {
      await communityAutomodSettingIndexer.indexBulkData(dataList);
      await communityAutomodSettingIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const syncElasticIndexData = async () => {
  const startTime = new Date();
  console.log("syncElasticIndexData started", startTime);

  try {
    const dataCount = await indexCommunityData();
    console.log(
      "Community agregated data is indexed, total communities:",
      dataCount,
    );
  } catch (err) {
    console.log(
      "Elastic Index Error When Syncing Community data",
      err.toString(),
    );
  }

  try {
    const dataCount = await indexCommunityMemberData();
    console.log(
      "CommunityMember agregated data is indexed, total communityMembers:",
      dataCount,
    );
  } catch (err) {
    console.log(
      "Elastic Index Error When Syncing CommunityMember data",
      err.toString(),
    );
  }

  try {
    const dataCount = await indexCommunityRuleData();
    console.log(
      "CommunityRule agregated data is indexed, total communityRules:",
      dataCount,
    );
  } catch (err) {
    console.log(
      "Elastic Index Error When Syncing CommunityRule data",
      err.toString(),
    );
  }

  try {
    const dataCount = await indexCommunityPinnedData();
    console.log(
      "CommunityPinned agregated data is indexed, total communityPinneds:",
      dataCount,
    );
  } catch (err) {
    console.log(
      "Elastic Index Error When Syncing CommunityPinned data",
      err.toString(),
    );
  }

  try {
    const dataCount = await indexCommunityAutomodSettingData();
    console.log(
      "CommunityAutomodSetting agregated data is indexed, total communityAutomodSettings:",
      dataCount,
    );
  } catch (err) {
    console.log(
      "Elastic Index Error When Syncing CommunityAutomodSetting data",
      err.toString(),
    );
  }

  const elapsedTime = new Date() - startTime;
  console.log("initElasticIndexData ended -> elapsedTime:", elapsedTime);
};

module.exports = syncElasticIndexData;

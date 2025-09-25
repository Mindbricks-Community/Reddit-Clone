const {
  getMediaObjectById,
  getIdListOfMediaObjectByField,
} = require("dbLayer");
const { getMediaScanById, getIdListOfMediaScanByField } = require("dbLayer");
const path = require("path");
const fs = require("fs");
const { ElasticIndexer } = require("serviceCommon");

const indexMediaObjectData = async () => {
  const mediaObjectIndexer = new ElasticIndexer("mediaObject", {
    isSilent: true,
  });
  console.log("Starting to update indexes for MediaObject");

  const idList = (await getIdListOfMediaObjectByField("isActive", true)) ?? [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getMediaObjectById(chunk);
    if (dataList.length) {
      await mediaObjectIndexer.indexBulkData(dataList);
      await mediaObjectIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const indexMediaScanData = async () => {
  const mediaScanIndexer = new ElasticIndexer("mediaScan", { isSilent: true });
  console.log("Starting to update indexes for MediaScan");

  const idList = (await getIdListOfMediaScanByField("isActive", true)) ?? [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getMediaScanById(chunk);
    if (dataList.length) {
      await mediaScanIndexer.indexBulkData(dataList);
      await mediaScanIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const syncElasticIndexData = async () => {
  const startTime = new Date();
  console.log("syncElasticIndexData started", startTime);

  try {
    const dataCount = await indexMediaObjectData();
    console.log(
      "MediaObject agregated data is indexed, total mediaObjects:",
      dataCount,
    );
  } catch (err) {
    console.log(
      "Elastic Index Error When Syncing MediaObject data",
      err.toString(),
    );
  }

  try {
    const dataCount = await indexMediaScanData();
    console.log(
      "MediaScan agregated data is indexed, total mediaScans:",
      dataCount,
    );
  } catch (err) {
    console.log(
      "Elastic Index Error When Syncing MediaScan data",
      err.toString(),
    );
  }

  const elapsedTime = new Date() - startTime;
  console.log("initElasticIndexData ended -> elapsedTime:", elapsedTime);
};

module.exports = syncElasticIndexData;

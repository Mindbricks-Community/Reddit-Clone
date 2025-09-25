const { getPostById, getIdListOfPostByField } = require("dbLayer");
const { getCommentById, getIdListOfCommentByField } = require("dbLayer");
const { getVoteById, getIdListOfVoteByField } = require("dbLayer");
const { getPollOptionById, getIdListOfPollOptionByField } = require("dbLayer");
const { getPostMediaById, getIdListOfPostMediaByField } = require("dbLayer");
const path = require("path");
const fs = require("fs");
const { ElasticIndexer } = require("serviceCommon");

const indexPostData = async () => {
  const postIndexer = new ElasticIndexer("post", { isSilent: true });
  console.log("Starting to update indexes for Post");

  const idList = (await getIdListOfPostByField("isActive", true)) ?? [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getPostById(chunk);
    if (dataList.length) {
      await postIndexer.indexBulkData(dataList);
      await postIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const indexCommentData = async () => {
  const commentIndexer = new ElasticIndexer("comment", { isSilent: true });
  console.log("Starting to update indexes for Comment");

  const idList = (await getIdListOfCommentByField("isActive", true)) ?? [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getCommentById(chunk);
    if (dataList.length) {
      await commentIndexer.indexBulkData(dataList);
      await commentIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const indexVoteData = async () => {
  const voteIndexer = new ElasticIndexer("vote", { isSilent: true });
  console.log("Starting to update indexes for Vote");

  const idList = (await getIdListOfVoteByField("isActive", true)) ?? [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getVoteById(chunk);
    if (dataList.length) {
      await voteIndexer.indexBulkData(dataList);
      await voteIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const indexPollOptionData = async () => {
  const pollOptionIndexer = new ElasticIndexer("pollOption", {
    isSilent: true,
  });
  console.log("Starting to update indexes for PollOption");

  const idList = (await getIdListOfPollOptionByField("isActive", true)) ?? [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getPollOptionById(chunk);
    if (dataList.length) {
      await pollOptionIndexer.indexBulkData(dataList);
      await pollOptionIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const indexPostMediaData = async () => {
  const postMediaIndexer = new ElasticIndexer("postMedia", { isSilent: true });
  console.log("Starting to update indexes for PostMedia");

  const idList = (await getIdListOfPostMediaByField("isActive", true)) ?? [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getPostMediaById(chunk);
    if (dataList.length) {
      await postMediaIndexer.indexBulkData(dataList);
      await postMediaIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const syncElasticIndexData = async () => {
  const startTime = new Date();
  console.log("syncElasticIndexData started", startTime);

  try {
    const dataCount = await indexPostData();
    console.log("Post agregated data is indexed, total posts:", dataCount);
  } catch (err) {
    console.log("Elastic Index Error When Syncing Post data", err.toString());
  }

  try {
    const dataCount = await indexCommentData();
    console.log(
      "Comment agregated data is indexed, total comments:",
      dataCount,
    );
  } catch (err) {
    console.log(
      "Elastic Index Error When Syncing Comment data",
      err.toString(),
    );
  }

  try {
    const dataCount = await indexVoteData();
    console.log("Vote agregated data is indexed, total votes:", dataCount);
  } catch (err) {
    console.log("Elastic Index Error When Syncing Vote data", err.toString());
  }

  try {
    const dataCount = await indexPollOptionData();
    console.log(
      "PollOption agregated data is indexed, total pollOptions:",
      dataCount,
    );
  } catch (err) {
    console.log(
      "Elastic Index Error When Syncing PollOption data",
      err.toString(),
    );
  }

  try {
    const dataCount = await indexPostMediaData();
    console.log(
      "PostMedia agregated data is indexed, total postMedias:",
      dataCount,
    );
  } catch (err) {
    console.log(
      "Elastic Index Error When Syncing PostMedia data",
      err.toString(),
    );
  }

  const elapsedTime = new Date() - startTime;
  console.log("initElasticIndexData ended -> elapsedTime:", elapsedTime);
};

module.exports = syncElasticIndexData;

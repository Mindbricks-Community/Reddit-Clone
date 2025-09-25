const { HttpServerError, BadRequestError } = require("common");

const { ElasticIndexer } = require("serviceCommon");

const { CommunityAutomodSetting } = require("models");
const { hexaLogger, newUUID } = require("common");

const indexDataToElastic = async (data) => {
  const elasticIndexer = new ElasticIndexer(
    "communityAutomodSetting",
    this.session,
    this.requestId,
  );
  await elasticIndexer.indexData(data);
};

const validateData = (data) => {
  const requiredFields = ["communityId", "rulesData"];

  requiredFields.forEach((field) => {
    if (data[field] === null || data[field] === undefined) {
      throw new BadRequestError(
        `Field "${field}" is required and cannot be null or undefined.`,
      );
    }
  });

  if (!data.id) {
    data.id = newUUID();
  }
};

const createCommunityAutomodSetting = async (data) => {
  try {
    validateData(data);

    const newcommunityAutomodSetting =
      await CommunityAutomodSetting.create(data);
    const _data = newcommunityAutomodSetting.getData();
    await indexDataToElastic(_data);
    return _data;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenCreatingCommunityAutomodSetting",
      err,
    );
  }
};

module.exports = createCommunityAutomodSetting;

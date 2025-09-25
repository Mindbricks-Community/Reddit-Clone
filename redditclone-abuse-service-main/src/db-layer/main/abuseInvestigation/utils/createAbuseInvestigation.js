const { HttpServerError, BadRequestError } = require("common");

const { ElasticIndexer } = require("serviceCommon");

const { AbuseInvestigation } = require("models");
const { hexaLogger, newUUID } = require("common");

const indexDataToElastic = async (data) => {
  const elasticIndexer = new ElasticIndexer(
    "abuseInvestigation",
    this.session,
    this.requestId,
  );
  await elasticIndexer.indexData(data);
};

const validateData = (data) => {
  const requiredFields = ["investigationStatus", "title", "openedByUserId"];

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

const createAbuseInvestigation = async (data) => {
  try {
    validateData(data);

    const newabuseInvestigation = await AbuseInvestigation.create(data);
    const _data = newabuseInvestigation.getData();
    await indexDataToElastic(_data);
    return _data;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenCreatingAbuseInvestigation",
      err,
    );
  }
};

module.exports = createAbuseInvestigation;

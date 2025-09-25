const { HttpServerError, BadRequestError } = require("common");

const { ElasticIndexer } = require("serviceCommon");

const { GdprDeleteRequest } = require("models");
const { hexaLogger, newUUID } = require("common");

const indexDataToElastic = async (data) => {
  const elasticIndexer = new ElasticIndexer(
    "gdprDeleteRequest",
    this.session,
    this.requestId,
  );
  await elasticIndexer.indexData(data);
};

const validateData = (data) => {
  const requiredFields = ["userId", "status"];

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

const createGdprDeleteRequest = async (data) => {
  try {
    validateData(data);

    const newgdprDeleteRequest = await GdprDeleteRequest.create(data);
    const _data = newgdprDeleteRequest.getData();
    await indexDataToElastic(_data);
    return _data;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenCreatingGdprDeleteRequest",
      err,
    );
  }
};

module.exports = createGdprDeleteRequest;

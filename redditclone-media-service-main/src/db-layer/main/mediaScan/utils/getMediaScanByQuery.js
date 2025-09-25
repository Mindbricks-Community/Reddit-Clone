const { HttpServerError, BadRequestError } = require("common");

const { MediaScan } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getMediaScanByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const mediaScan = await MediaScan.findOne({
      where: { ...query, isActive: true },
    });

    if (!mediaScan) return null;
    return mediaScan.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingMediaScanByQuery",
      err,
    );
  }
};

module.exports = getMediaScanByQuery;

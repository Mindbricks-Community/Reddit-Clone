const { HttpServerError, BadRequestError } = require("common");

const { MediaScan } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getMediaScanListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const mediaScan = await MediaScan.findAll({
      where: { ...query, isActive: true },
    });

    //should i add not found error or only return empty array?
    if (!mediaScan || mediaScan.length === 0) return [];

    //      if (!mediaScan || mediaScan.length === 0) {
    //      throw new NotFoundError(
    //      `MediaScan with the specified criteria not found`
    //  );
    //}

    return mediaScan.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingMediaScanListByQuery",
      err,
    );
  }
};

module.exports = getMediaScanListByQuery;

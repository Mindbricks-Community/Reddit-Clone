const { HttpServerError, BadRequestError } = require("common");

const { MediaObject } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getMediaObjectListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const mediaObject = await MediaObject.findAll({
      where: { ...query, isActive: true },
    });

    //should i add not found error or only return empty array?
    if (!mediaObject || mediaObject.length === 0) return [];

    //      if (!mediaObject || mediaObject.length === 0) {
    //      throw new NotFoundError(
    //      `MediaObject with the specified criteria not found`
    //  );
    //}

    return mediaObject.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingMediaObjectListByQuery",
      err,
    );
  }
};

module.exports = getMediaObjectListByQuery;

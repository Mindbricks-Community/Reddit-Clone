const { HttpServerError, BadRequestError } = require("common");

const { MediaObject } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getMediaObjectByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const mediaObject = await MediaObject.findOne({
      where: { ...query, isActive: true },
    });

    if (!mediaObject) return null;
    return mediaObject.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingMediaObjectByQuery",
      err,
    );
  }
};

module.exports = getMediaObjectByQuery;

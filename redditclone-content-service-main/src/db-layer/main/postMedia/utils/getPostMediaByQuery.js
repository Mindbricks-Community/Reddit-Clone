const { HttpServerError, BadRequestError } = require("common");

const { PostMedia } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getPostMediaByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const postMedia = await PostMedia.findOne({
      where: { ...query, isActive: true },
    });

    if (!postMedia) return null;
    return postMedia.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingPostMediaByQuery",
      err,
    );
  }
};

module.exports = getPostMediaByQuery;

const { HttpServerError, BadRequestError } = require("common");

const { PostMedia } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getPostMediaListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const postMedia = await PostMedia.findAll({
      where: { ...query, isActive: true },
    });

    //should i add not found error or only return empty array?
    if (!postMedia || postMedia.length === 0) return [];

    //      if (!postMedia || postMedia.length === 0) {
    //      throw new NotFoundError(
    //      `PostMedia with the specified criteria not found`
    //  );
    //}

    return postMedia.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingPostMediaListByQuery",
      err,
    );
  }
};

module.exports = getPostMediaListByQuery;

const { HttpServerError, BadRequestError } = require("common");

const { Post } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getPostListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const post = await Post.findAll({
      where: { ...query, isActive: true },
    });

    //should i add not found error or only return empty array?
    if (!post || post.length === 0) return [];

    //      if (!post || post.length === 0) {
    //      throw new NotFoundError(
    //      `Post with the specified criteria not found`
    //  );
    //}

    return post.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingPostListByQuery",
      err,
    );
  }
};

module.exports = getPostListByQuery;

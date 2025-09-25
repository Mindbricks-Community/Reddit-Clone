const { HttpServerError, BadRequestError } = require("common");

const { Post } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getPostByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const post = await Post.findOne({
      where: { ...query, isActive: true },
    });

    if (!post) return null;
    return post.getData();
  } catch (err) {
    throw new HttpServerError("errMsg_dbErrorWhenRequestingPostByQuery", err);
  }
};

module.exports = getPostByQuery;

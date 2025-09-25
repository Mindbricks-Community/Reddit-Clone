const { HttpServerError, NotFoundError } = require("common");
const { hexaLogger } = require("common");

const { Post, Comment, Vote, PollOption, PostMedia } = require("models");
const { Op } = require("sequelize");

const getPostMediaAggById = async (postMediaId) => {
  try {
    const forWhereClause = false;
    const includes = [];

    const postMedia = Array.isArray(postMediaId)
      ? await PostMedia.findAll({
          where: {
            id: { [Op.in]: postMediaId },
            isActive: true,
          },
          include: includes,
        })
      : await PostMedia.findOne({
          where: {
            id: postMediaId,
            isActive: true,
          },
          include: includes,
        });

    if (!postMedia) {
      return null;
    }

    const postMediaData =
      Array.isArray(postMediaId) && postMediaId.length > 0
        ? postMedia.map((item) => item.getData())
        : postMedia.getData();
    await PostMedia.getCqrsJoins(postMediaData);
    return postMediaData;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingPostMediaAggById",
      err,
    );
  }
};

module.exports = getPostMediaAggById;

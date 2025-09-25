const { HttpServerError, NotFoundError } = require("common");
const { hexaLogger } = require("common");

const { Post, Comment, Vote, PollOption, PostMedia } = require("models");
const { Op } = require("sequelize");

const getPostAggById = async (postId) => {
  try {
    const forWhereClause = false;
    const includes = [];

    const post = Array.isArray(postId)
      ? await Post.findAll({
          where: {
            id: { [Op.in]: postId },
            isActive: true,
          },
          include: includes,
        })
      : await Post.findOne({
          where: {
            id: postId,
            isActive: true,
          },
          include: includes,
        });

    if (!post) {
      return null;
    }

    const postData =
      Array.isArray(postId) && postId.length > 0
        ? post.map((item) => item.getData())
        : post.getData();
    await Post.getCqrsJoins(postData);
    return postData;
  } catch (err) {
    throw new HttpServerError("errMsg_dbErrorWhenRequestingPostAggById", err);
  }
};

module.exports = getPostAggById;

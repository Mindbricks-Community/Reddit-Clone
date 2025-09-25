const { HttpServerError } = require("common");

let { Post } = require("models");
const { hexaLogger } = require("common");
const { Op } = require("sequelize");

const getPostById = async (postId) => {
  try {
    const post = Array.isArray(postId)
      ? await Post.findAll({
          where: {
            id: { [Op.in]: postId },
            isActive: true,
          },
        })
      : await Post.findOne({
          where: {
            id: postId,
            isActive: true,
          },
        });

    if (!post) {
      return null;
    }
    return Array.isArray(postId)
      ? post.map((item) => item.getData())
      : post.getData();
  } catch (err) {
    console.log(err);
    throw new HttpServerError("errMsg_dbErrorWhenRequestingPostById", err);
  }
};

module.exports = getPostById;

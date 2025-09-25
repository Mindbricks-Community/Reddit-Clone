const { HttpServerError } = require("common");

let { PostMedia } = require("models");
const { hexaLogger } = require("common");
const { Op } = require("sequelize");

const getPostMediaById = async (postMediaId) => {
  try {
    const postMedia = Array.isArray(postMediaId)
      ? await PostMedia.findAll({
          where: {
            id: { [Op.in]: postMediaId },
            isActive: true,
          },
        })
      : await PostMedia.findOne({
          where: {
            id: postMediaId,
            isActive: true,
          },
        });

    if (!postMedia) {
      return null;
    }
    return Array.isArray(postMediaId)
      ? postMedia.map((item) => item.getData())
      : postMedia.getData();
  } catch (err) {
    console.log(err);
    throw new HttpServerError("errMsg_dbErrorWhenRequestingPostMediaById", err);
  }
};

module.exports = getPostMediaById;

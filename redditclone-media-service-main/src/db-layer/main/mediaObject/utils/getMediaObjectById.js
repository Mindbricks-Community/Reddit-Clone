const { HttpServerError } = require("common");

let { MediaObject } = require("models");
const { hexaLogger } = require("common");
const { Op } = require("sequelize");

const getMediaObjectById = async (mediaObjectId) => {
  try {
    const mediaObject = Array.isArray(mediaObjectId)
      ? await MediaObject.findAll({
          where: {
            id: { [Op.in]: mediaObjectId },
            isActive: true,
          },
        })
      : await MediaObject.findOne({
          where: {
            id: mediaObjectId,
            isActive: true,
          },
        });

    if (!mediaObject) {
      return null;
    }
    return Array.isArray(mediaObjectId)
      ? mediaObject.map((item) => item.getData())
      : mediaObject.getData();
  } catch (err) {
    console.log(err);
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingMediaObjectById",
      err,
    );
  }
};

module.exports = getMediaObjectById;

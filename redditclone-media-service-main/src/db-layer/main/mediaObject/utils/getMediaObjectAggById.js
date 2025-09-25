const { HttpServerError, NotFoundError } = require("common");
const { hexaLogger } = require("common");

const { MediaObject, MediaScan } = require("models");
const { Op } = require("sequelize");

const getMediaObjectAggById = async (mediaObjectId) => {
  try {
    const forWhereClause = false;
    const includes = [];

    const mediaObject = Array.isArray(mediaObjectId)
      ? await MediaObject.findAll({
          where: {
            id: { [Op.in]: mediaObjectId },
            isActive: true,
          },
          include: includes,
        })
      : await MediaObject.findOne({
          where: {
            id: mediaObjectId,
            isActive: true,
          },
          include: includes,
        });

    if (!mediaObject) {
      return null;
    }

    const mediaObjectData =
      Array.isArray(mediaObjectId) && mediaObjectId.length > 0
        ? mediaObject.map((item) => item.getData())
        : mediaObject.getData();
    await MediaObject.getCqrsJoins(mediaObjectData);
    return mediaObjectData;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingMediaObjectAggById",
      err,
    );
  }
};

module.exports = getMediaObjectAggById;

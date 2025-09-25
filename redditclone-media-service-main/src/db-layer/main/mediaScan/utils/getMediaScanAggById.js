const { HttpServerError, NotFoundError } = require("common");
const { hexaLogger } = require("common");

const { MediaObject, MediaScan } = require("models");
const { Op } = require("sequelize");

const getMediaScanAggById = async (mediaScanId) => {
  try {
    const forWhereClause = false;
    const includes = [];

    const mediaScan = Array.isArray(mediaScanId)
      ? await MediaScan.findAll({
          where: {
            id: { [Op.in]: mediaScanId },
            isActive: true,
          },
          include: includes,
        })
      : await MediaScan.findOne({
          where: {
            id: mediaScanId,
            isActive: true,
          },
          include: includes,
        });

    if (!mediaScan) {
      return null;
    }

    const mediaScanData =
      Array.isArray(mediaScanId) && mediaScanId.length > 0
        ? mediaScan.map((item) => item.getData())
        : mediaScan.getData();
    await MediaScan.getCqrsJoins(mediaScanData);
    return mediaScanData;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingMediaScanAggById",
      err,
    );
  }
};

module.exports = getMediaScanAggById;

const { HttpServerError } = require("common");

let { MediaScan } = require("models");
const { hexaLogger } = require("common");
const { Op } = require("sequelize");

const getMediaScanById = async (mediaScanId) => {
  try {
    const mediaScan = Array.isArray(mediaScanId)
      ? await MediaScan.findAll({
          where: {
            id: { [Op.in]: mediaScanId },
            isActive: true,
          },
        })
      : await MediaScan.findOne({
          where: {
            id: mediaScanId,
            isActive: true,
          },
        });

    if (!mediaScan) {
      return null;
    }
    return Array.isArray(mediaScanId)
      ? mediaScan.map((item) => item.getData())
      : mediaScan.getData();
  } catch (err) {
    console.log(err);
    throw new HttpServerError("errMsg_dbErrorWhenRequestingMediaScanById", err);
  }
};

module.exports = getMediaScanById;

const { HttpServerError } = require("common");

let { GdprDeleteRequest } = require("models");
const { hexaLogger } = require("common");
const { Op } = require("sequelize");

const getGdprDeleteRequestById = async (gdprDeleteRequestId) => {
  try {
    const gdprDeleteRequest = Array.isArray(gdprDeleteRequestId)
      ? await GdprDeleteRequest.findAll({
          where: {
            id: { [Op.in]: gdprDeleteRequestId },
            isActive: true,
          },
        })
      : await GdprDeleteRequest.findOne({
          where: {
            id: gdprDeleteRequestId,
            isActive: true,
          },
        });

    if (!gdprDeleteRequest) {
      return null;
    }
    return Array.isArray(gdprDeleteRequestId)
      ? gdprDeleteRequest.map((item) => item.getData())
      : gdprDeleteRequest.getData();
  } catch (err) {
    console.log(err);
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingGdprDeleteRequestById",
      err,
    );
  }
};

module.exports = getGdprDeleteRequestById;

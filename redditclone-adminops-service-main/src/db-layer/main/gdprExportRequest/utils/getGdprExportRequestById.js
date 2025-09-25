const { HttpServerError } = require("common");

let { GdprExportRequest } = require("models");
const { hexaLogger } = require("common");
const { Op } = require("sequelize");

const getGdprExportRequestById = async (gdprExportRequestId) => {
  try {
    const gdprExportRequest = Array.isArray(gdprExportRequestId)
      ? await GdprExportRequest.findAll({
          where: {
            id: { [Op.in]: gdprExportRequestId },
            isActive: true,
          },
        })
      : await GdprExportRequest.findOne({
          where: {
            id: gdprExportRequestId,
            isActive: true,
          },
        });

    if (!gdprExportRequest) {
      return null;
    }
    return Array.isArray(gdprExportRequestId)
      ? gdprExportRequest.map((item) => item.getData())
      : gdprExportRequest.getData();
  } catch (err) {
    console.log(err);
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingGdprExportRequestById",
      err,
    );
  }
};

module.exports = getGdprExportRequestById;

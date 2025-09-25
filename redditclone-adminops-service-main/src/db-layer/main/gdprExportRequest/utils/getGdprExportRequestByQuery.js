const { HttpServerError, BadRequestError } = require("common");

const { GdprExportRequest } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getGdprExportRequestByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const gdprExportRequest = await GdprExportRequest.findOne({
      where: { ...query, isActive: true },
    });

    if (!gdprExportRequest) return null;
    return gdprExportRequest.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingGdprExportRequestByQuery",
      err,
    );
  }
};

module.exports = getGdprExportRequestByQuery;

const { HttpServerError, BadRequestError } = require("common");

const { GdprExportRequest } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getGdprExportRequestListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const gdprExportRequest = await GdprExportRequest.findAll({
      where: { ...query, isActive: true },
    });

    //should i add not found error or only return empty array?
    if (!gdprExportRequest || gdprExportRequest.length === 0) return [];

    //      if (!gdprExportRequest || gdprExportRequest.length === 0) {
    //      throw new NotFoundError(
    //      `GdprExportRequest with the specified criteria not found`
    //  );
    //}

    return gdprExportRequest.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingGdprExportRequestListByQuery",
      err,
    );
  }
};

module.exports = getGdprExportRequestListByQuery;

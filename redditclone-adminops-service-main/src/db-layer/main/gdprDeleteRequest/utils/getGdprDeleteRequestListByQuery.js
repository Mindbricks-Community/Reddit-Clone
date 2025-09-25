const { HttpServerError, BadRequestError } = require("common");

const { GdprDeleteRequest } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getGdprDeleteRequestListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const gdprDeleteRequest = await GdprDeleteRequest.findAll({
      where: { ...query, isActive: true },
    });

    //should i add not found error or only return empty array?
    if (!gdprDeleteRequest || gdprDeleteRequest.length === 0) return [];

    //      if (!gdprDeleteRequest || gdprDeleteRequest.length === 0) {
    //      throw new NotFoundError(
    //      `GdprDeleteRequest with the specified criteria not found`
    //  );
    //}

    return gdprDeleteRequest.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingGdprDeleteRequestListByQuery",
      err,
    );
  }
};

module.exports = getGdprDeleteRequestListByQuery;

const { HttpServerError, BadRequestError } = require("common");

const { GdprDeleteRequest } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getGdprDeleteRequestByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const gdprDeleteRequest = await GdprDeleteRequest.findOne({
      where: { ...query, isActive: true },
    });

    if (!gdprDeleteRequest) return null;
    return gdprDeleteRequest.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingGdprDeleteRequestByQuery",
      err,
    );
  }
};

module.exports = getGdprDeleteRequestByQuery;

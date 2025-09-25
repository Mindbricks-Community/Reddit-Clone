const { HttpServerError, BadRequestError } = require("common");

const { GlobalUserRestriction } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getGlobalUserRestrictionByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const globalUserRestriction = await GlobalUserRestriction.findOne({
      where: { ...query, isActive: true },
    });

    if (!globalUserRestriction) return null;
    return globalUserRestriction.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingGlobalUserRestrictionByQuery",
      err,
    );
  }
};

module.exports = getGlobalUserRestrictionByQuery;

const { HttpServerError, BadRequestError } = require("common");

const { GlobalUserRestriction } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getGlobalUserRestrictionListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const globalUserRestriction = await GlobalUserRestriction.findAll({
      where: { ...query, isActive: true },
    });

    //should i add not found error or only return empty array?
    if (!globalUserRestriction || globalUserRestriction.length === 0) return [];

    //      if (!globalUserRestriction || globalUserRestriction.length === 0) {
    //      throw new NotFoundError(
    //      `GlobalUserRestriction with the specified criteria not found`
    //  );
    //}

    return globalUserRestriction.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingGlobalUserRestrictionListByQuery",
      err,
    );
  }
};

module.exports = getGlobalUserRestrictionListByQuery;

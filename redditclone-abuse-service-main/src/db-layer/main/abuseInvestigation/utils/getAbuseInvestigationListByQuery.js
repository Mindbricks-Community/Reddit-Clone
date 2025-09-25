const { HttpServerError, BadRequestError } = require("common");

const { AbuseInvestigation } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getAbuseInvestigationListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const abuseInvestigation = await AbuseInvestigation.findAll({
      where: { ...query, isActive: true },
    });

    //should i add not found error or only return empty array?
    if (!abuseInvestigation || abuseInvestigation.length === 0) return [];

    //      if (!abuseInvestigation || abuseInvestigation.length === 0) {
    //      throw new NotFoundError(
    //      `AbuseInvestigation with the specified criteria not found`
    //  );
    //}

    return abuseInvestigation.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingAbuseInvestigationListByQuery",
      err,
    );
  }
};

module.exports = getAbuseInvestigationListByQuery;

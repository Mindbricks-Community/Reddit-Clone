const { HttpServerError, BadRequestError } = require("common");

const { AbuseInvestigation } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getAbuseInvestigationByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const abuseInvestigation = await AbuseInvestigation.findOne({
      where: { ...query, isActive: true },
    });

    if (!abuseInvestigation) return null;
    return abuseInvestigation.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingAbuseInvestigationByQuery",
      err,
    );
  }
};

module.exports = getAbuseInvestigationByQuery;

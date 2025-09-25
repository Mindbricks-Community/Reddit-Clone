const { HttpServerError, BadRequestError } = require("common");

const { AbuseHeuristicTrigger } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getAbuseHeuristicTriggerByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const abuseHeuristicTrigger = await AbuseHeuristicTrigger.findOne({
      where: { ...query, isActive: true },
    });

    if (!abuseHeuristicTrigger) return null;
    return abuseHeuristicTrigger.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingAbuseHeuristicTriggerByQuery",
      err,
    );
  }
};

module.exports = getAbuseHeuristicTriggerByQuery;

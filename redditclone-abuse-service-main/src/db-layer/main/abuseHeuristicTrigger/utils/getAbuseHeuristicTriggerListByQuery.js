const { HttpServerError, BadRequestError } = require("common");

const { AbuseHeuristicTrigger } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getAbuseHeuristicTriggerListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const abuseHeuristicTrigger = await AbuseHeuristicTrigger.findAll({
      where: { ...query, isActive: true },
    });

    //should i add not found error or only return empty array?
    if (!abuseHeuristicTrigger || abuseHeuristicTrigger.length === 0) return [];

    //      if (!abuseHeuristicTrigger || abuseHeuristicTrigger.length === 0) {
    //      throw new NotFoundError(
    //      `AbuseHeuristicTrigger with the specified criteria not found`
    //  );
    //}

    return abuseHeuristicTrigger.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingAbuseHeuristicTriggerListByQuery",
      err,
    );
  }
};

module.exports = getAbuseHeuristicTriggerListByQuery;

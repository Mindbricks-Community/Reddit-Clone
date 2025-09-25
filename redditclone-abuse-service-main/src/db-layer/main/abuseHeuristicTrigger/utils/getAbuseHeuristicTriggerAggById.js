const { HttpServerError, NotFoundError } = require("common");
const { hexaLogger } = require("common");

const {
  AbuseReport,
  AbuseFlag,
  AbuseHeuristicTrigger,
  AbuseInvestigation,
} = require("models");
const { Op } = require("sequelize");

const getAbuseHeuristicTriggerAggById = async (abuseHeuristicTriggerId) => {
  try {
    const forWhereClause = false;
    const includes = [];

    const abuseHeuristicTrigger = Array.isArray(abuseHeuristicTriggerId)
      ? await AbuseHeuristicTrigger.findAll({
          where: {
            id: { [Op.in]: abuseHeuristicTriggerId },
            isActive: true,
          },
          include: includes,
        })
      : await AbuseHeuristicTrigger.findOne({
          where: {
            id: abuseHeuristicTriggerId,
            isActive: true,
          },
          include: includes,
        });

    if (!abuseHeuristicTrigger) {
      return null;
    }

    const abuseHeuristicTriggerData =
      Array.isArray(abuseHeuristicTriggerId) &&
      abuseHeuristicTriggerId.length > 0
        ? abuseHeuristicTrigger.map((item) => item.getData())
        : abuseHeuristicTrigger.getData();
    await AbuseHeuristicTrigger.getCqrsJoins(abuseHeuristicTriggerData);
    return abuseHeuristicTriggerData;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingAbuseHeuristicTriggerAggById",
      err,
    );
  }
};

module.exports = getAbuseHeuristicTriggerAggById;

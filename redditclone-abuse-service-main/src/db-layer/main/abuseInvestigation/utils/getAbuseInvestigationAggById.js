const { HttpServerError, NotFoundError } = require("common");
const { hexaLogger } = require("common");

const {
  AbuseReport,
  AbuseFlag,
  AbuseHeuristicTrigger,
  AbuseInvestigation,
} = require("models");
const { Op } = require("sequelize");

const getAbuseInvestigationAggById = async (abuseInvestigationId) => {
  try {
    const forWhereClause = false;
    const includes = [];

    const abuseInvestigation = Array.isArray(abuseInvestigationId)
      ? await AbuseInvestigation.findAll({
          where: {
            id: { [Op.in]: abuseInvestigationId },
            isActive: true,
          },
          include: includes,
        })
      : await AbuseInvestigation.findOne({
          where: {
            id: abuseInvestigationId,
            isActive: true,
          },
          include: includes,
        });

    if (!abuseInvestigation) {
      return null;
    }

    const abuseInvestigationData =
      Array.isArray(abuseInvestigationId) && abuseInvestigationId.length > 0
        ? abuseInvestigation.map((item) => item.getData())
        : abuseInvestigation.getData();
    await AbuseInvestigation.getCqrsJoins(abuseInvestigationData);
    return abuseInvestigationData;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingAbuseInvestigationAggById",
      err,
    );
  }
};

module.exports = getAbuseInvestigationAggById;

const { HttpServerError, NotFoundError } = require("common");
const { hexaLogger } = require("common");

const {
  AbuseReport,
  AbuseFlag,
  AbuseHeuristicTrigger,
  AbuseInvestigation,
} = require("models");
const { Op } = require("sequelize");

const getAbuseReportAggById = async (abuseReportId) => {
  try {
    const forWhereClause = false;
    const includes = [];

    const abuseReport = Array.isArray(abuseReportId)
      ? await AbuseReport.findAll({
          where: {
            id: { [Op.in]: abuseReportId },
            isActive: true,
          },
          include: includes,
        })
      : await AbuseReport.findOne({
          where: {
            id: abuseReportId,
            isActive: true,
          },
          include: includes,
        });

    if (!abuseReport) {
      return null;
    }

    const abuseReportData =
      Array.isArray(abuseReportId) && abuseReportId.length > 0
        ? abuseReport.map((item) => item.getData())
        : abuseReport.getData();
    await AbuseReport.getCqrsJoins(abuseReportData);
    return abuseReportData;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingAbuseReportAggById",
      err,
    );
  }
};

module.exports = getAbuseReportAggById;

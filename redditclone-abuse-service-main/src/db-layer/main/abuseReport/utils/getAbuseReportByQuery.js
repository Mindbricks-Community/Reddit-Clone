const { HttpServerError, BadRequestError } = require("common");

const { AbuseReport } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getAbuseReportByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const abuseReport = await AbuseReport.findOne({
      where: { ...query, isActive: true },
    });

    if (!abuseReport) return null;
    return abuseReport.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingAbuseReportByQuery",
      err,
    );
  }
};

module.exports = getAbuseReportByQuery;

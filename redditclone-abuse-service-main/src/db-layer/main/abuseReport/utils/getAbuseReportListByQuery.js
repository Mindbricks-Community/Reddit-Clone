const { HttpServerError, BadRequestError } = require("common");

const { AbuseReport } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getAbuseReportListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const abuseReport = await AbuseReport.findAll({
      where: { ...query, isActive: true },
    });

    //should i add not found error or only return empty array?
    if (!abuseReport || abuseReport.length === 0) return [];

    //      if (!abuseReport || abuseReport.length === 0) {
    //      throw new NotFoundError(
    //      `AbuseReport with the specified criteria not found`
    //  );
    //}

    return abuseReport.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingAbuseReportListByQuery",
      err,
    );
  }
};

module.exports = getAbuseReportListByQuery;

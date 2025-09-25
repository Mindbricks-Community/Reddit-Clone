const { HttpServerError } = require("common");

let { AbuseReport } = require("models");
const { hexaLogger } = require("common");
const { Op } = require("sequelize");

const getAbuseReportById = async (abuseReportId) => {
  try {
    const abuseReport = Array.isArray(abuseReportId)
      ? await AbuseReport.findAll({
          where: {
            id: { [Op.in]: abuseReportId },
            isActive: true,
          },
        })
      : await AbuseReport.findOne({
          where: {
            id: abuseReportId,
            isActive: true,
          },
        });

    if (!abuseReport) {
      return null;
    }
    return Array.isArray(abuseReportId)
      ? abuseReport.map((item) => item.getData())
      : abuseReport.getData();
  } catch (err) {
    console.log(err);
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingAbuseReportById",
      err,
    );
  }
};

module.exports = getAbuseReportById;

const { HttpServerError } = require("common");

const { AbuseReport } = require("models");
const { Op } = require("sequelize");

const updateAbuseReportByIdList = async (idList, dataClause) => {
  try {
    let rowsCount = null;
    let rows = null;

    const options = {
      where: { id: { [Op.in]: idList }, isActive: true },
      returning: true,
    };

    [rowsCount, rows] = await AbuseReport.update(dataClause, options);
    const abuseReportIdList = rows.map((item) => item.id);
    return abuseReportIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingAbuseReportByIdList",
      err,
    );
  }
};

module.exports = updateAbuseReportByIdList;

const { HttpServerError } = require("common");

const { AbuseInvestigation } = require("models");
const { Op } = require("sequelize");

const updateAbuseInvestigationByIdList = async (idList, dataClause) => {
  try {
    let rowsCount = null;
    let rows = null;

    const options = {
      where: { id: { [Op.in]: idList }, isActive: true },
      returning: true,
    };

    [rowsCount, rows] = await AbuseInvestigation.update(dataClause, options);
    const abuseInvestigationIdList = rows.map((item) => item.id);
    return abuseInvestigationIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingAbuseInvestigationByIdList",
      err,
    );
  }
};

module.exports = updateAbuseInvestigationByIdList;

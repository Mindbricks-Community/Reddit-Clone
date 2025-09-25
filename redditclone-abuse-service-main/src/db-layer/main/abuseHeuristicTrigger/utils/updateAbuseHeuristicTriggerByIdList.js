const { HttpServerError } = require("common");

const { AbuseHeuristicTrigger } = require("models");
const { Op } = require("sequelize");

const updateAbuseHeuristicTriggerByIdList = async (idList, dataClause) => {
  try {
    let rowsCount = null;
    let rows = null;

    const options = {
      where: { id: { [Op.in]: idList }, isActive: true },
      returning: true,
    };

    [rowsCount, rows] = await AbuseHeuristicTrigger.update(dataClause, options);
    const abuseHeuristicTriggerIdList = rows.map((item) => item.id);
    return abuseHeuristicTriggerIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingAbuseHeuristicTriggerByIdList",
      err,
    );
  }
};

module.exports = updateAbuseHeuristicTriggerByIdList;

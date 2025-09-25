const { HttpServerError } = require("common");

const { GlobalUserRestriction } = require("models");
const { Op } = require("sequelize");

const updateGlobalUserRestrictionByIdList = async (idList, dataClause) => {
  try {
    let rowsCount = null;
    let rows = null;

    const options = {
      where: { id: { [Op.in]: idList }, isActive: true },
      returning: true,
    };

    [rowsCount, rows] = await GlobalUserRestriction.update(dataClause, options);
    const globalUserRestrictionIdList = rows.map((item) => item.id);
    return globalUserRestrictionIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingGlobalUserRestrictionByIdList",
      err,
    );
  }
};

module.exports = updateGlobalUserRestrictionByIdList;

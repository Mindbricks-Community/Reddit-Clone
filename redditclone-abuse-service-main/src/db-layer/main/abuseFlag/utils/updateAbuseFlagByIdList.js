const { HttpServerError } = require("common");

const { AbuseFlag } = require("models");
const { Op } = require("sequelize");

const updateAbuseFlagByIdList = async (idList, dataClause) => {
  try {
    let rowsCount = null;
    let rows = null;

    const options = {
      where: { id: { [Op.in]: idList }, isActive: true },
      returning: true,
    };

    [rowsCount, rows] = await AbuseFlag.update(dataClause, options);
    const abuseFlagIdList = rows.map((item) => item.id);
    return abuseFlagIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingAbuseFlagByIdList",
      err,
    );
  }
};

module.exports = updateAbuseFlagByIdList;

const { HttpServerError } = require("common");

const { ErrorLog } = require("models");
const { Op } = require("sequelize");

const updateErrorLogByIdList = async (idList, dataClause) => {
  try {
    let rowsCount = null;
    let rows = null;

    const options = {
      where: { id: { [Op.in]: idList }, isActive: true },
      returning: true,
    };

    [rowsCount, rows] = await ErrorLog.update(dataClause, options);
    const errorLogIdList = rows.map((item) => item.id);
    return errorLogIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingErrorLogByIdList",
      err,
    );
  }
};

module.exports = updateErrorLogByIdList;

const { HttpServerError } = require("common");

const { Alert } = require("models");
const { Op } = require("sequelize");

const updateAlertByIdList = async (idList, dataClause) => {
  try {
    let rowsCount = null;
    let rows = null;

    const options = {
      where: { id: { [Op.in]: idList }, isActive: true },
      returning: true,
    };

    [rowsCount, rows] = await Alert.update(dataClause, options);
    const alertIdList = rows.map((item) => item.id);
    return alertIdList;
  } catch (err) {
    throw new HttpServerError("errMsg_dbErrorWhenUpdatingAlertByIdList", err);
  }
};

module.exports = updateAlertByIdList;

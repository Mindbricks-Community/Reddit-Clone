const { HttpServerError } = require("common");

const { SystemMetric } = require("models");
const { Op } = require("sequelize");

const updateSystemMetricByIdList = async (idList, dataClause) => {
  try {
    let rowsCount = null;
    let rows = null;

    const options = {
      where: { id: { [Op.in]: idList }, isActive: true },
      returning: true,
    };

    [rowsCount, rows] = await SystemMetric.update(dataClause, options);
    const systemMetricIdList = rows.map((item) => item.id);
    return systemMetricIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingSystemMetricByIdList",
      err,
    );
  }
};

module.exports = updateSystemMetricByIdList;

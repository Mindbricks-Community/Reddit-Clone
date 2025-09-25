const { HttpServerError, NotFoundError } = require("common");
const { hexaLogger } = require("common");

const { SystemMetric, ErrorLog, SloEvent, AuditLog, Alert } = require("models");
const { Op } = require("sequelize");

const getSystemMetricAggById = async (systemMetricId) => {
  try {
    const forWhereClause = false;
    const includes = [];

    const systemMetric = Array.isArray(systemMetricId)
      ? await SystemMetric.findAll({
          where: {
            id: { [Op.in]: systemMetricId },
            isActive: true,
          },
          include: includes,
        })
      : await SystemMetric.findOne({
          where: {
            id: systemMetricId,
            isActive: true,
          },
          include: includes,
        });

    if (!systemMetric) {
      return null;
    }

    const systemMetricData =
      Array.isArray(systemMetricId) && systemMetricId.length > 0
        ? systemMetric.map((item) => item.getData())
        : systemMetric.getData();
    await SystemMetric.getCqrsJoins(systemMetricData);
    return systemMetricData;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingSystemMetricAggById",
      err,
    );
  }
};

module.exports = getSystemMetricAggById;

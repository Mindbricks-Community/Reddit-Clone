const { HttpServerError, NotFoundError } = require("common");
const { hexaLogger } = require("common");

const { SystemMetric, ErrorLog, SloEvent, AuditLog, Alert } = require("models");
const { Op } = require("sequelize");

const getAlertAggById = async (alertId) => {
  try {
    const forWhereClause = false;
    const includes = [];

    const alert = Array.isArray(alertId)
      ? await Alert.findAll({
          where: {
            id: { [Op.in]: alertId },
            isActive: true,
          },
          include: includes,
        })
      : await Alert.findOne({
          where: {
            id: alertId,
            isActive: true,
          },
          include: includes,
        });

    if (!alert) {
      return null;
    }

    const alertData =
      Array.isArray(alertId) && alertId.length > 0
        ? alert.map((item) => item.getData())
        : alert.getData();
    await Alert.getCqrsJoins(alertData);
    return alertData;
  } catch (err) {
    throw new HttpServerError("errMsg_dbErrorWhenRequestingAlertAggById", err);
  }
};

module.exports = getAlertAggById;

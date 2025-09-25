const { HttpServerError } = require("common");

let { Alert } = require("models");
const { hexaLogger } = require("common");
const { Op } = require("sequelize");

const getAlertById = async (alertId) => {
  try {
    const alert = Array.isArray(alertId)
      ? await Alert.findAll({
          where: {
            id: { [Op.in]: alertId },
            isActive: true,
          },
        })
      : await Alert.findOne({
          where: {
            id: alertId,
            isActive: true,
          },
        });

    if (!alert) {
      return null;
    }
    return Array.isArray(alertId)
      ? alert.map((item) => item.getData())
      : alert.getData();
  } catch (err) {
    console.log(err);
    throw new HttpServerError("errMsg_dbErrorWhenRequestingAlertById", err);
  }
};

module.exports = getAlertById;

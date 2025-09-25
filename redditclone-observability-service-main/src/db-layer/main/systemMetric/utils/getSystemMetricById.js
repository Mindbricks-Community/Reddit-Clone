const { HttpServerError } = require("common");

let { SystemMetric } = require("models");
const { hexaLogger } = require("common");
const { Op } = require("sequelize");

const getSystemMetricById = async (systemMetricId) => {
  try {
    const systemMetric = Array.isArray(systemMetricId)
      ? await SystemMetric.findAll({
          where: {
            id: { [Op.in]: systemMetricId },
            isActive: true,
          },
        })
      : await SystemMetric.findOne({
          where: {
            id: systemMetricId,
            isActive: true,
          },
        });

    if (!systemMetric) {
      return null;
    }
    return Array.isArray(systemMetricId)
      ? systemMetric.map((item) => item.getData())
      : systemMetric.getData();
  } catch (err) {
    console.log(err);
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingSystemMetricById",
      err,
    );
  }
};

module.exports = getSystemMetricById;

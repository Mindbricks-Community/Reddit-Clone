const { HttpServerError, BadRequestError } = require("common");

const { SystemMetric } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getSystemMetricByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const systemMetric = await SystemMetric.findOne({
      where: { ...query, isActive: true },
    });

    if (!systemMetric) return null;
    return systemMetric.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingSystemMetricByQuery",
      err,
    );
  }
};

module.exports = getSystemMetricByQuery;

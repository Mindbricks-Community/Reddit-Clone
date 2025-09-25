const { HttpServerError, BadRequestError } = require("common");

const { SystemMetric } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getSystemMetricListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const systemMetric = await SystemMetric.findAll({
      where: { ...query, isActive: true },
    });

    //should i add not found error or only return empty array?
    if (!systemMetric || systemMetric.length === 0) return [];

    //      if (!systemMetric || systemMetric.length === 0) {
    //      throw new NotFoundError(
    //      `SystemMetric with the specified criteria not found`
    //  );
    //}

    return systemMetric.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingSystemMetricListByQuery",
      err,
    );
  }
};

module.exports = getSystemMetricListByQuery;

const { HttpServerError, NotFoundError, BadRequestError } = require("common");

const { SystemMetric } = require("models");
const { Op } = require("sequelize");

const getIdListOfSystemMetricByField = async (
  fieldName,
  fieldValue,
  isArray,
) => {
  try {
    let isValidField = false;

    const systemMetricProperties = [
      "id",
      "timestamp",
      "serviceName",
      "host",
      "metricName",
      "metricValue",
      "unit",
      "tags",
    ];

    isValidField = systemMetricProperties.includes(fieldName);

    if (!isValidField) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    const expectedType = typeof SystemMetric[fieldName];

    if (typeof fieldValue !== expectedType) {
      throw new BadRequestError(
        `Invalid field value type for ${fieldName}. Expected ${expectedType}.`,
      );
    }

    const options = {
      where: isArray
        ? { [fieldName]: { [Op.contains]: [fieldValue] }, isActive: true }
        : { [fieldName]: fieldValue, isActive: true },
      attributes: ["id"],
    };

    let systemMetricIdList = await SystemMetric.findAll(options);

    if (!systemMetricIdList || systemMetricIdList.length === 0) {
      throw new NotFoundError(
        `SystemMetric with the specified criteria not found`,
      );
    }

    systemMetricIdList = systemMetricIdList.map((item) => item.id);
    return systemMetricIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingSystemMetricIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfSystemMetricByField;

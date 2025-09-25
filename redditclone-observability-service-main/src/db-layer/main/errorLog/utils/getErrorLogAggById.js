const { HttpServerError, NotFoundError } = require("common");
const { hexaLogger } = require("common");

const { SystemMetric, ErrorLog, SloEvent, AuditLog, Alert } = require("models");
const { Op } = require("sequelize");

const getErrorLogAggById = async (errorLogId) => {
  try {
    const forWhereClause = false;
    const includes = [];

    const errorLog = Array.isArray(errorLogId)
      ? await ErrorLog.findAll({
          where: {
            id: { [Op.in]: errorLogId },
            isActive: true,
          },
          include: includes,
        })
      : await ErrorLog.findOne({
          where: {
            id: errorLogId,
            isActive: true,
          },
          include: includes,
        });

    if (!errorLog) {
      return null;
    }

    const errorLogData =
      Array.isArray(errorLogId) && errorLogId.length > 0
        ? errorLog.map((item) => item.getData())
        : errorLog.getData();
    await ErrorLog.getCqrsJoins(errorLogData);
    return errorLogData;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingErrorLogAggById",
      err,
    );
  }
};

module.exports = getErrorLogAggById;

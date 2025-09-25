const { HttpServerError, NotFoundError } = require("common");
const { hexaLogger } = require("common");

const { SystemMetric, ErrorLog, SloEvent, AuditLog, Alert } = require("models");
const { Op } = require("sequelize");

const getSloEventAggById = async (sloEventId) => {
  try {
    const forWhereClause = false;
    const includes = [];

    const sloEvent = Array.isArray(sloEventId)
      ? await SloEvent.findAll({
          where: {
            id: { [Op.in]: sloEventId },
            isActive: true,
          },
          include: includes,
        })
      : await SloEvent.findOne({
          where: {
            id: sloEventId,
            isActive: true,
          },
          include: includes,
        });

    if (!sloEvent) {
      return null;
    }

    const sloEventData =
      Array.isArray(sloEventId) && sloEventId.length > 0
        ? sloEvent.map((item) => item.getData())
        : sloEvent.getData();
    await SloEvent.getCqrsJoins(sloEventData);
    return sloEventData;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingSloEventAggById",
      err,
    );
  }
};

module.exports = getSloEventAggById;

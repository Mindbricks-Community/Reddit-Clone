const { HttpServerError } = require("common");

const { ModerationAuditLog } = require("models");
const { Op } = require("sequelize");

const updateModerationAuditLogByIdList = async (idList, dataClause) => {
  try {
    let rowsCount = null;
    let rows = null;

    const options = {
      where: { id: { [Op.in]: idList }, isActive: true },
      returning: true,
    };

    [rowsCount, rows] = await ModerationAuditLog.update(dataClause, options);
    const moderationAuditLogIdList = rows.map((item) => item.id);
    return moderationAuditLogIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingModerationAuditLogByIdList",
      err,
    );
  }
};

module.exports = updateModerationAuditLogByIdList;

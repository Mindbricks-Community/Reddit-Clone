const { HttpServerError } = require("common");

const { ModerationAction } = require("models");
const { Op } = require("sequelize");

const updateModerationActionByIdList = async (idList, dataClause) => {
  try {
    let rowsCount = null;
    let rows = null;

    const options = {
      where: { id: { [Op.in]: idList }, isActive: true },
      returning: true,
    };

    [rowsCount, rows] = await ModerationAction.update(dataClause, options);
    const moderationActionIdList = rows.map((item) => item.id);
    return moderationActionIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingModerationActionByIdList",
      err,
    );
  }
};

module.exports = updateModerationActionByIdList;

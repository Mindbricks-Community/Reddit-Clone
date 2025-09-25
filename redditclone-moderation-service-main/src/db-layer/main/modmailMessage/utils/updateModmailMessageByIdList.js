const { HttpServerError } = require("common");

const { ModmailMessage } = require("models");
const { Op } = require("sequelize");

const updateModmailMessageByIdList = async (idList, dataClause) => {
  try {
    let rowsCount = null;
    let rows = null;

    const options = {
      where: { id: { [Op.in]: idList }, isActive: true },
      returning: true,
    };

    [rowsCount, rows] = await ModmailMessage.update(dataClause, options);
    const modmailMessageIdList = rows.map((item) => item.id);
    return modmailMessageIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingModmailMessageByIdList",
      err,
    );
  }
};

module.exports = updateModmailMessageByIdList;

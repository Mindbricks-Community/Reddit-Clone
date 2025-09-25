const { HttpServerError } = require("common");

const { ModmailThread } = require("models");
const { Op } = require("sequelize");

const updateModmailThreadByIdList = async (idList, dataClause) => {
  try {
    let rowsCount = null;
    let rows = null;

    const options = {
      where: { id: { [Op.in]: idList }, isActive: true },
      returning: true,
    };

    [rowsCount, rows] = await ModmailThread.update(dataClause, options);
    const modmailThreadIdList = rows.map((item) => item.id);
    return modmailThreadIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingModmailThreadByIdList",
      err,
    );
  }
};

module.exports = updateModmailThreadByIdList;

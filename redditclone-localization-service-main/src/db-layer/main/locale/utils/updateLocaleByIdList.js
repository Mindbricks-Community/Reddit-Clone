const { HttpServerError } = require("common");

const { Locale } = require("models");
const { Op } = require("sequelize");

const updateLocaleByIdList = async (idList, dataClause) => {
  try {
    let rowsCount = null;
    let rows = null;

    const options = {
      where: { id: { [Op.in]: idList }, isActive: true },
      returning: true,
    };

    [rowsCount, rows] = await Locale.update(dataClause, options);
    const localeIdList = rows.map((item) => item.id);
    return localeIdList;
  } catch (err) {
    throw new HttpServerError("errMsg_dbErrorWhenUpdatingLocaleByIdList", err);
  }
};

module.exports = updateLocaleByIdList;

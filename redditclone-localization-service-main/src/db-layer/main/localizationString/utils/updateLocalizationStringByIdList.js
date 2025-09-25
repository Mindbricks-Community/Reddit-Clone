const { HttpServerError } = require("common");

const { LocalizationString } = require("models");
const { Op } = require("sequelize");

const updateLocalizationStringByIdList = async (idList, dataClause) => {
  try {
    let rowsCount = null;
    let rows = null;

    const options = {
      where: { id: { [Op.in]: idList }, isActive: true },
      returning: true,
    };

    [rowsCount, rows] = await LocalizationString.update(dataClause, options);
    const localizationStringIdList = rows.map((item) => item.id);
    return localizationStringIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingLocalizationStringByIdList",
      err,
    );
  }
};

module.exports = updateLocalizationStringByIdList;

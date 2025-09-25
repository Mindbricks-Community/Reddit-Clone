const { HttpServerError } = require("common");

const { LocalizationKey } = require("models");
const { Op } = require("sequelize");

const updateLocalizationKeyByIdList = async (idList, dataClause) => {
  try {
    let rowsCount = null;
    let rows = null;

    const options = {
      where: { id: { [Op.in]: idList }, isActive: true },
      returning: true,
    };

    [rowsCount, rows] = await LocalizationKey.update(dataClause, options);
    const localizationKeyIdList = rows.map((item) => item.id);
    return localizationKeyIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingLocalizationKeyByIdList",
      err,
    );
  }
};

module.exports = updateLocalizationKeyByIdList;

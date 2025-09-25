const { HttpServerError } = require("common");

const { MediaObject } = require("models");
const { Op } = require("sequelize");

const updateMediaObjectByIdList = async (idList, dataClause) => {
  try {
    let rowsCount = null;
    let rows = null;

    const options = {
      where: { id: { [Op.in]: idList }, isActive: true },
      returning: true,
    };

    [rowsCount, rows] = await MediaObject.update(dataClause, options);
    const mediaObjectIdList = rows.map((item) => item.id);
    return mediaObjectIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingMediaObjectByIdList",
      err,
    );
  }
};

module.exports = updateMediaObjectByIdList;

const { HttpServerError } = require("common");

const { GdprDeleteRequest } = require("models");
const { Op } = require("sequelize");

const updateGdprDeleteRequestByIdList = async (idList, dataClause) => {
  try {
    let rowsCount = null;
    let rows = null;

    const options = {
      where: { id: { [Op.in]: idList }, isActive: true },
      returning: true,
    };

    [rowsCount, rows] = await GdprDeleteRequest.update(dataClause, options);
    const gdprDeleteRequestIdList = rows.map((item) => item.id);
    return gdprDeleteRequestIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingGdprDeleteRequestByIdList",
      err,
    );
  }
};

module.exports = updateGdprDeleteRequestByIdList;

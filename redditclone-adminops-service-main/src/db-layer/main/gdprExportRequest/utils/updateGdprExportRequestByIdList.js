const { HttpServerError } = require("common");

const { GdprExportRequest } = require("models");
const { Op } = require("sequelize");

const updateGdprExportRequestByIdList = async (idList, dataClause) => {
  try {
    let rowsCount = null;
    let rows = null;

    const options = {
      where: { id: { [Op.in]: idList }, isActive: true },
      returning: true,
    };

    [rowsCount, rows] = await GdprExportRequest.update(dataClause, options);
    const gdprExportRequestIdList = rows.map((item) => item.id);
    return gdprExportRequestIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingGdprExportRequestByIdList",
      err,
    );
  }
};

module.exports = updateGdprExportRequestByIdList;

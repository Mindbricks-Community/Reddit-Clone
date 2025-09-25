const { HttpServerError } = require("common");

const { MediaScan } = require("models");
const { Op } = require("sequelize");

const updateMediaScanByIdList = async (idList, dataClause) => {
  try {
    let rowsCount = null;
    let rows = null;

    const options = {
      where: { id: { [Op.in]: idList }, isActive: true },
      returning: true,
    };

    [rowsCount, rows] = await MediaScan.update(dataClause, options);
    const mediaScanIdList = rows.map((item) => item.id);
    return mediaScanIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingMediaScanByIdList",
      err,
    );
  }
};

module.exports = updateMediaScanByIdList;

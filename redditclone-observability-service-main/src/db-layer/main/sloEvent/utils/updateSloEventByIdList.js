const { HttpServerError } = require("common");

const { SloEvent } = require("models");
const { Op } = require("sequelize");

const updateSloEventByIdList = async (idList, dataClause) => {
  try {
    let rowsCount = null;
    let rows = null;

    const options = {
      where: { id: { [Op.in]: idList }, isActive: true },
      returning: true,
    };

    [rowsCount, rows] = await SloEvent.update(dataClause, options);
    const sloEventIdList = rows.map((item) => item.id);
    return sloEventIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingSloEventByIdList",
      err,
    );
  }
};

module.exports = updateSloEventByIdList;

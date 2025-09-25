const { HttpServerError } = require("common");

const { AutomodEvent } = require("models");
const { Op } = require("sequelize");

const updateAutomodEventByIdList = async (idList, dataClause) => {
  try {
    let rowsCount = null;
    let rows = null;

    const options = {
      where: { id: { [Op.in]: idList }, isActive: true },
      returning: true,
    };

    [rowsCount, rows] = await AutomodEvent.update(dataClause, options);
    const automodEventIdList = rows.map((item) => item.id);
    return automodEventIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingAutomodEventByIdList",
      err,
    );
  }
};

module.exports = updateAutomodEventByIdList;

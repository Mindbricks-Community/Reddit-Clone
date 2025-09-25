const { HttpServerError } = require("common");

const { PollOption } = require("models");
const { Op } = require("sequelize");

const updatePollOptionByIdList = async (idList, dataClause) => {
  try {
    let rowsCount = null;
    let rows = null;

    const options = {
      where: { id: { [Op.in]: idList }, isActive: true },
      returning: true,
    };

    [rowsCount, rows] = await PollOption.update(dataClause, options);
    const pollOptionIdList = rows.map((item) => item.id);
    return pollOptionIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingPollOptionByIdList",
      err,
    );
  }
};

module.exports = updatePollOptionByIdList;

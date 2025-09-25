const { HttpServerError } = require("common");

const { Vote } = require("models");
const { Op } = require("sequelize");

const updateVoteByIdList = async (idList, dataClause) => {
  try {
    let rowsCount = null;
    let rows = null;

    const options = {
      where: { id: { [Op.in]: idList }, isActive: true },
      returning: true,
    };

    [rowsCount, rows] = await Vote.update(dataClause, options);
    const voteIdList = rows.map((item) => item.id);
    return voteIdList;
  } catch (err) {
    throw new HttpServerError("errMsg_dbErrorWhenUpdatingVoteByIdList", err);
  }
};

module.exports = updateVoteByIdList;

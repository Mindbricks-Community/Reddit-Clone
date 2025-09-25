const { HttpServerError } = require("common");

const { Community } = require("models");
const { Op } = require("sequelize");

const updateCommunityByIdList = async (idList, dataClause) => {
  try {
    let rowsCount = null;
    let rows = null;

    const options = {
      where: { id: { [Op.in]: idList }, isActive: true },
      returning: true,
    };

    [rowsCount, rows] = await Community.update(dataClause, options);
    const communityIdList = rows.map((item) => item.id);
    return communityIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingCommunityByIdList",
      err,
    );
  }
};

module.exports = updateCommunityByIdList;

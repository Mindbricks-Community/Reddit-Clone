const { HttpServerError } = require("common");

const { CommunityPinned } = require("models");
const { Op } = require("sequelize");

const updateCommunityPinnedByIdList = async (idList, dataClause) => {
  try {
    let rowsCount = null;
    let rows = null;

    const options = {
      where: { id: { [Op.in]: idList }, isActive: true },
      returning: true,
    };

    [rowsCount, rows] = await CommunityPinned.update(dataClause, options);
    const communityPinnedIdList = rows.map((item) => item.id);
    return communityPinnedIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingCommunityPinnedByIdList",
      err,
    );
  }
};

module.exports = updateCommunityPinnedByIdList;

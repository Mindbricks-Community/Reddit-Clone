const { HttpServerError } = require("common");

const { CommunityMember } = require("models");
const { Op } = require("sequelize");

const updateCommunityMemberByIdList = async (idList, dataClause) => {
  try {
    let rowsCount = null;
    let rows = null;

    const options = {
      where: { id: { [Op.in]: idList }, isActive: true },
      returning: true,
    };

    [rowsCount, rows] = await CommunityMember.update(dataClause, options);
    const communityMemberIdList = rows.map((item) => item.id);
    return communityMemberIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingCommunityMemberByIdList",
      err,
    );
  }
};

module.exports = updateCommunityMemberByIdList;

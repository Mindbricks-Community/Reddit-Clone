const { HttpServerError } = require("common");

const { CommunityRule } = require("models");
const { Op } = require("sequelize");

const updateCommunityRuleByIdList = async (idList, dataClause) => {
  try {
    let rowsCount = null;
    let rows = null;

    const options = {
      where: { id: { [Op.in]: idList }, isActive: true },
      returning: true,
    };

    [rowsCount, rows] = await CommunityRule.update(dataClause, options);
    const communityRuleIdList = rows.map((item) => item.id);
    return communityRuleIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingCommunityRuleByIdList",
      err,
    );
  }
};

module.exports = updateCommunityRuleByIdList;

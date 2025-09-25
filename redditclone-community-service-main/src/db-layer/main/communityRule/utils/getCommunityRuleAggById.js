const { HttpServerError, NotFoundError } = require("common");
const { hexaLogger } = require("common");

const {
  Community,
  CommunityMember,
  CommunityRule,
  CommunityPinned,
  CommunityAutomodSetting,
} = require("models");
const { Op } = require("sequelize");

const getCommunityRuleAggById = async (communityRuleId) => {
  try {
    const forWhereClause = false;
    const includes = [];

    const communityRule = Array.isArray(communityRuleId)
      ? await CommunityRule.findAll({
          where: {
            id: { [Op.in]: communityRuleId },
            isActive: true,
          },
          include: includes,
        })
      : await CommunityRule.findOne({
          where: {
            id: communityRuleId,
            isActive: true,
          },
          include: includes,
        });

    if (!communityRule) {
      return null;
    }

    const communityRuleData =
      Array.isArray(communityRuleId) && communityRuleId.length > 0
        ? communityRule.map((item) => item.getData())
        : communityRule.getData();
    await CommunityRule.getCqrsJoins(communityRuleData);
    return communityRuleData;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingCommunityRuleAggById",
      err,
    );
  }
};

module.exports = getCommunityRuleAggById;

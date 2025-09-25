const { HttpServerError } = require("common");

let { CommunityRule } = require("models");
const { hexaLogger } = require("common");
const { Op } = require("sequelize");

const getCommunityRuleById = async (communityRuleId) => {
  try {
    const communityRule = Array.isArray(communityRuleId)
      ? await CommunityRule.findAll({
          where: {
            id: { [Op.in]: communityRuleId },
            isActive: true,
          },
        })
      : await CommunityRule.findOne({
          where: {
            id: communityRuleId,
            isActive: true,
          },
        });

    if (!communityRule) {
      return null;
    }
    return Array.isArray(communityRuleId)
      ? communityRule.map((item) => item.getData())
      : communityRule.getData();
  } catch (err) {
    console.log(err);
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingCommunityRuleById",
      err,
    );
  }
};

module.exports = getCommunityRuleById;

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

const getCommunityMemberAggById = async (communityMemberId) => {
  try {
    const forWhereClause = false;
    const includes = [];

    const communityMember = Array.isArray(communityMemberId)
      ? await CommunityMember.findAll({
          where: {
            id: { [Op.in]: communityMemberId },
            isActive: true,
          },
          include: includes,
        })
      : await CommunityMember.findOne({
          where: {
            id: communityMemberId,
            isActive: true,
          },
          include: includes,
        });

    if (!communityMember) {
      return null;
    }

    const communityMemberData =
      Array.isArray(communityMemberId) && communityMemberId.length > 0
        ? communityMember.map((item) => item.getData())
        : communityMember.getData();
    await CommunityMember.getCqrsJoins(communityMemberData);
    return communityMemberData;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingCommunityMemberAggById",
      err,
    );
  }
};

module.exports = getCommunityMemberAggById;

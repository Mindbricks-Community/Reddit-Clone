const { HttpServerError } = require("common");

let { CommunityMember } = require("models");
const { hexaLogger } = require("common");
const { Op } = require("sequelize");

const getCommunityMemberById = async (communityMemberId) => {
  try {
    const communityMember = Array.isArray(communityMemberId)
      ? await CommunityMember.findAll({
          where: {
            id: { [Op.in]: communityMemberId },
            isActive: true,
          },
        })
      : await CommunityMember.findOne({
          where: {
            id: communityMemberId,
            isActive: true,
          },
        });

    if (!communityMember) {
      return null;
    }
    return Array.isArray(communityMemberId)
      ? communityMember.map((item) => item.getData())
      : communityMember.getData();
  } catch (err) {
    console.log(err);
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingCommunityMemberById",
      err,
    );
  }
};

module.exports = getCommunityMemberById;

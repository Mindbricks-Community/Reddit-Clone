const { HttpServerError } = require("common");

let { Community } = require("models");
const { hexaLogger } = require("common");
const { Op } = require("sequelize");

const getCommunityById = async (communityId) => {
  try {
    const community = Array.isArray(communityId)
      ? await Community.findAll({
          where: {
            id: { [Op.in]: communityId },
            isActive: true,
          },
        })
      : await Community.findOne({
          where: {
            id: communityId,
            isActive: true,
          },
        });

    if (!community) {
      return null;
    }
    return Array.isArray(communityId)
      ? community.map((item) => item.getData())
      : community.getData();
  } catch (err) {
    console.log(err);
    throw new HttpServerError("errMsg_dbErrorWhenRequestingCommunityById", err);
  }
};

module.exports = getCommunityById;

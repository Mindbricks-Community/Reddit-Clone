const { HttpServerError } = require("common");

let { CommunityPinned } = require("models");
const { hexaLogger } = require("common");
const { Op } = require("sequelize");

const getCommunityPinnedById = async (communityPinnedId) => {
  try {
    const communityPinned = Array.isArray(communityPinnedId)
      ? await CommunityPinned.findAll({
          where: {
            id: { [Op.in]: communityPinnedId },
            isActive: true,
          },
        })
      : await CommunityPinned.findOne({
          where: {
            id: communityPinnedId,
            isActive: true,
          },
        });

    if (!communityPinned) {
      return null;
    }
    return Array.isArray(communityPinnedId)
      ? communityPinned.map((item) => item.getData())
      : communityPinned.getData();
  } catch (err) {
    console.log(err);
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingCommunityPinnedById",
      err,
    );
  }
};

module.exports = getCommunityPinnedById;

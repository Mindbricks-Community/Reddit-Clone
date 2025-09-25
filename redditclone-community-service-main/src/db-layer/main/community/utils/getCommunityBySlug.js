const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { hexaLogger } = require("common");
const { Community } = require("models");
const { Op } = require("sequelize");

const getCommunityBySlug = async (slug) => {
  try {
    const community = await Community.findOne({
      where: {
        slug: slug,
        isActive: true,
      },
    });

    if (!community) {
      return null;
    }
    return community.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingCommunityBySlug",
      err,
    );
  }
};

module.exports = getCommunityBySlug;

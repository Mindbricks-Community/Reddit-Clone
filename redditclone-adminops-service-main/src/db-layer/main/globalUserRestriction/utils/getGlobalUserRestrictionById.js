const { HttpServerError } = require("common");

let { GlobalUserRestriction } = require("models");
const { hexaLogger } = require("common");
const { Op } = require("sequelize");

const getGlobalUserRestrictionById = async (globalUserRestrictionId) => {
  try {
    const globalUserRestriction = Array.isArray(globalUserRestrictionId)
      ? await GlobalUserRestriction.findAll({
          where: {
            id: { [Op.in]: globalUserRestrictionId },
            isActive: true,
          },
        })
      : await GlobalUserRestriction.findOne({
          where: {
            id: globalUserRestrictionId,
            isActive: true,
          },
        });

    if (!globalUserRestriction) {
      return null;
    }
    return Array.isArray(globalUserRestrictionId)
      ? globalUserRestriction.map((item) => item.getData())
      : globalUserRestriction.getData();
  } catch (err) {
    console.log(err);
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingGlobalUserRestrictionById",
      err,
    );
  }
};

module.exports = getGlobalUserRestrictionById;

const { HttpServerError, NotFoundError } = require("common");
const { hexaLogger } = require("common");

const {
  AdminUserAction,
  GdprExportRequest,
  GdprDeleteRequest,
  CompliancePolicy,
  GlobalUserRestriction,
} = require("models");
const { Op } = require("sequelize");

const getGlobalUserRestrictionAggById = async (globalUserRestrictionId) => {
  try {
    const forWhereClause = false;
    const includes = [];

    const globalUserRestriction = Array.isArray(globalUserRestrictionId)
      ? await GlobalUserRestriction.findAll({
          where: {
            id: { [Op.in]: globalUserRestrictionId },
            isActive: true,
          },
          include: includes,
        })
      : await GlobalUserRestriction.findOne({
          where: {
            id: globalUserRestrictionId,
            isActive: true,
          },
          include: includes,
        });

    if (!globalUserRestriction) {
      return null;
    }

    const globalUserRestrictionData =
      Array.isArray(globalUserRestrictionId) &&
      globalUserRestrictionId.length > 0
        ? globalUserRestriction.map((item) => item.getData())
        : globalUserRestriction.getData();
    await GlobalUserRestriction.getCqrsJoins(globalUserRestrictionData);
    return globalUserRestrictionData;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingGlobalUserRestrictionAggById",
      err,
    );
  }
};

module.exports = getGlobalUserRestrictionAggById;

const { HttpServerError, NotFoundError } = require("common");
const { hexaLogger } = require("common");

const {
  AbuseReport,
  AbuseFlag,
  AbuseHeuristicTrigger,
  AbuseInvestigation,
} = require("models");
const { Op } = require("sequelize");

const getAbuseFlagAggById = async (abuseFlagId) => {
  try {
    const forWhereClause = false;
    const includes = [];

    const abuseFlag = Array.isArray(abuseFlagId)
      ? await AbuseFlag.findAll({
          where: {
            id: { [Op.in]: abuseFlagId },
            isActive: true,
          },
          include: includes,
        })
      : await AbuseFlag.findOne({
          where: {
            id: abuseFlagId,
            isActive: true,
          },
          include: includes,
        });

    if (!abuseFlag) {
      return null;
    }

    const abuseFlagData =
      Array.isArray(abuseFlagId) && abuseFlagId.length > 0
        ? abuseFlag.map((item) => item.getData())
        : abuseFlag.getData();
    await AbuseFlag.getCqrsJoins(abuseFlagData);
    return abuseFlagData;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingAbuseFlagAggById",
      err,
    );
  }
};

module.exports = getAbuseFlagAggById;

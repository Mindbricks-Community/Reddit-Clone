const { HttpServerError, BadRequestError } = require("common");

const { AbuseFlag } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getAbuseFlagByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const abuseFlag = await AbuseFlag.findOne({
      where: { ...query, isActive: true },
    });

    if (!abuseFlag) return null;
    return abuseFlag.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingAbuseFlagByQuery",
      err,
    );
  }
};

module.exports = getAbuseFlagByQuery;

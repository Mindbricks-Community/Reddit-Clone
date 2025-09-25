const { HttpServerError, BadRequestError } = require("common");

const { AbuseFlag } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getAbuseFlagListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const abuseFlag = await AbuseFlag.findAll({
      where: { ...query, isActive: true },
    });

    //should i add not found error or only return empty array?
    if (!abuseFlag || abuseFlag.length === 0) return [];

    //      if (!abuseFlag || abuseFlag.length === 0) {
    //      throw new NotFoundError(
    //      `AbuseFlag with the specified criteria not found`
    //  );
    //}

    return abuseFlag.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingAbuseFlagListByQuery",
      err,
    );
  }
};

module.exports = getAbuseFlagListByQuery;

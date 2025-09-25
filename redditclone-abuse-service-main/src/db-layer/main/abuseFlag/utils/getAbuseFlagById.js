const { HttpServerError } = require("common");

let { AbuseFlag } = require("models");
const { hexaLogger } = require("common");
const { Op } = require("sequelize");

const getAbuseFlagById = async (abuseFlagId) => {
  try {
    const abuseFlag = Array.isArray(abuseFlagId)
      ? await AbuseFlag.findAll({
          where: {
            id: { [Op.in]: abuseFlagId },
            isActive: true,
          },
        })
      : await AbuseFlag.findOne({
          where: {
            id: abuseFlagId,
            isActive: true,
          },
        });

    if (!abuseFlag) {
      return null;
    }
    return Array.isArray(abuseFlagId)
      ? abuseFlag.map((item) => item.getData())
      : abuseFlag.getData();
  } catch (err) {
    console.log(err);
    throw new HttpServerError("errMsg_dbErrorWhenRequestingAbuseFlagById", err);
  }
};

module.exports = getAbuseFlagById;

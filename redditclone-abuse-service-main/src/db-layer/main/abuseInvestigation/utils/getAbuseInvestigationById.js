const { HttpServerError } = require("common");

let { AbuseInvestigation } = require("models");
const { hexaLogger } = require("common");
const { Op } = require("sequelize");

const getAbuseInvestigationById = async (abuseInvestigationId) => {
  try {
    const abuseInvestigation = Array.isArray(abuseInvestigationId)
      ? await AbuseInvestigation.findAll({
          where: {
            id: { [Op.in]: abuseInvestigationId },
            isActive: true,
          },
        })
      : await AbuseInvestigation.findOne({
          where: {
            id: abuseInvestigationId,
            isActive: true,
          },
        });

    if (!abuseInvestigation) {
      return null;
    }
    return Array.isArray(abuseInvestigationId)
      ? abuseInvestigation.map((item) => item.getData())
      : abuseInvestigation.getData();
  } catch (err) {
    console.log(err);
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingAbuseInvestigationById",
      err,
    );
  }
};

module.exports = getAbuseInvestigationById;

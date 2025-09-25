const { HttpServerError } = require("common");

let { AbuseHeuristicTrigger } = require("models");
const { hexaLogger } = require("common");
const { Op } = require("sequelize");

const getAbuseHeuristicTriggerById = async (abuseHeuristicTriggerId) => {
  try {
    const abuseHeuristicTrigger = Array.isArray(abuseHeuristicTriggerId)
      ? await AbuseHeuristicTrigger.findAll({
          where: {
            id: { [Op.in]: abuseHeuristicTriggerId },
            isActive: true,
          },
        })
      : await AbuseHeuristicTrigger.findOne({
          where: {
            id: abuseHeuristicTriggerId,
            isActive: true,
          },
        });

    if (!abuseHeuristicTrigger) {
      return null;
    }
    return Array.isArray(abuseHeuristicTriggerId)
      ? abuseHeuristicTrigger.map((item) => item.getData())
      : abuseHeuristicTrigger.getData();
  } catch (err) {
    console.log(err);
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingAbuseHeuristicTriggerById",
      err,
    );
  }
};

module.exports = getAbuseHeuristicTriggerById;

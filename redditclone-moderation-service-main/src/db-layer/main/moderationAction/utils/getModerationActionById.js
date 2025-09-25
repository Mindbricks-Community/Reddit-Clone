const { HttpServerError } = require("common");

let { ModerationAction } = require("models");
const { hexaLogger } = require("common");
const { Op } = require("sequelize");

const getModerationActionById = async (moderationActionId) => {
  try {
    const moderationAction = Array.isArray(moderationActionId)
      ? await ModerationAction.findAll({
          where: {
            id: { [Op.in]: moderationActionId },
            isActive: true,
          },
        })
      : await ModerationAction.findOne({
          where: {
            id: moderationActionId,
            isActive: true,
          },
        });

    if (!moderationAction) {
      return null;
    }
    return Array.isArray(moderationActionId)
      ? moderationAction.map((item) => item.getData())
      : moderationAction.getData();
  } catch (err) {
    console.log(err);
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingModerationActionById",
      err,
    );
  }
};

module.exports = getModerationActionById;

const { HttpServerError } = require("common");

let { AutomodEvent } = require("models");
const { hexaLogger } = require("common");
const { Op } = require("sequelize");

const getAutomodEventById = async (automodEventId) => {
  try {
    const automodEvent = Array.isArray(automodEventId)
      ? await AutomodEvent.findAll({
          where: {
            id: { [Op.in]: automodEventId },
            isActive: true,
          },
        })
      : await AutomodEvent.findOne({
          where: {
            id: automodEventId,
            isActive: true,
          },
        });

    if (!automodEvent) {
      return null;
    }
    return Array.isArray(automodEventId)
      ? automodEvent.map((item) => item.getData())
      : automodEvent.getData();
  } catch (err) {
    console.log(err);
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingAutomodEventById",
      err,
    );
  }
};

module.exports = getAutomodEventById;

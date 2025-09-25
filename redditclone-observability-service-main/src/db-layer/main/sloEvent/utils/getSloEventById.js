const { HttpServerError } = require("common");

let { SloEvent } = require("models");
const { hexaLogger } = require("common");
const { Op } = require("sequelize");

const getSloEventById = async (sloEventId) => {
  try {
    const sloEvent = Array.isArray(sloEventId)
      ? await SloEvent.findAll({
          where: {
            id: { [Op.in]: sloEventId },
            isActive: true,
          },
        })
      : await SloEvent.findOne({
          where: {
            id: sloEventId,
            isActive: true,
          },
        });

    if (!sloEvent) {
      return null;
    }
    return Array.isArray(sloEventId)
      ? sloEvent.map((item) => item.getData())
      : sloEvent.getData();
  } catch (err) {
    console.log(err);
    throw new HttpServerError("errMsg_dbErrorWhenRequestingSloEventById", err);
  }
};

module.exports = getSloEventById;

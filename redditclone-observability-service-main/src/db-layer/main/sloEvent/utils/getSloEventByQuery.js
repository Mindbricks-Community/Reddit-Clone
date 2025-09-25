const { HttpServerError, BadRequestError } = require("common");

const { SloEvent } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getSloEventByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const sloEvent = await SloEvent.findOne({
      where: { ...query, isActive: true },
    });

    if (!sloEvent) return null;
    return sloEvent.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingSloEventByQuery",
      err,
    );
  }
};

module.exports = getSloEventByQuery;

const { HttpServerError, BadRequestError } = require("common");

const { SloEvent } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getSloEventListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const sloEvent = await SloEvent.findAll({
      where: { ...query, isActive: true },
    });

    //should i add not found error or only return empty array?
    if (!sloEvent || sloEvent.length === 0) return [];

    //      if (!sloEvent || sloEvent.length === 0) {
    //      throw new NotFoundError(
    //      `SloEvent with the specified criteria not found`
    //  );
    //}

    return sloEvent.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingSloEventListByQuery",
      err,
    );
  }
};

module.exports = getSloEventListByQuery;

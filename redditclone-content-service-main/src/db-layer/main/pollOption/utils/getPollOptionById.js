const { HttpServerError } = require("common");

let { PollOption } = require("models");
const { hexaLogger } = require("common");
const { Op } = require("sequelize");

const getPollOptionById = async (pollOptionId) => {
  try {
    const pollOption = Array.isArray(pollOptionId)
      ? await PollOption.findAll({
          where: {
            id: { [Op.in]: pollOptionId },
            isActive: true,
          },
        })
      : await PollOption.findOne({
          where: {
            id: pollOptionId,
            isActive: true,
          },
        });

    if (!pollOption) {
      return null;
    }
    return Array.isArray(pollOptionId)
      ? pollOption.map((item) => item.getData())
      : pollOption.getData();
  } catch (err) {
    console.log(err);
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingPollOptionById",
      err,
    );
  }
};

module.exports = getPollOptionById;

const { HttpServerError } = require("common");

let { ErrorLog } = require("models");
const { hexaLogger } = require("common");
const { Op } = require("sequelize");

const getErrorLogById = async (errorLogId) => {
  try {
    const errorLog = Array.isArray(errorLogId)
      ? await ErrorLog.findAll({
          where: {
            id: { [Op.in]: errorLogId },
            isActive: true,
          },
        })
      : await ErrorLog.findOne({
          where: {
            id: errorLogId,
            isActive: true,
          },
        });

    if (!errorLog) {
      return null;
    }
    return Array.isArray(errorLogId)
      ? errorLog.map((item) => item.getData())
      : errorLog.getData();
  } catch (err) {
    console.log(err);
    throw new HttpServerError("errMsg_dbErrorWhenRequestingErrorLogById", err);
  }
};

module.exports = getErrorLogById;

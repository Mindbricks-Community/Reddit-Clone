const { sequelize } = require("common");
const { Op } = require("sequelize");
const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { hexaLogger } = require("common");

const { Locale, LocalizationKey, LocalizationString } = require("models");

const { DBGetSequelizeCommand } = require("dbCommand");

class DbGetLocalizationstringCommand extends DBGetSequelizeCommand {
  constructor(input) {
    super(input, LocalizationString);
    this.commandName = "dbGetLocalizationstring";
    this.nullResult = false;
    this.objectName = "localizationString";
    this.serviceLabel = "redditclone-localization-service";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async getCqrsJoins(data) {
    if (LocalizationString.getCqrsJoins)
      await LocalizationString.getCqrsJoins(data);
  }

  initOwnership(input) {
    super.initOwnership(input);
  }

  async checkEntityOwnership(entity) {
    return true;
  }

  async transposeResult() {
    // transpose dbData
  }

  buildIncludes(forWhereClause) {
    if (!this.input.getJoins) forWhereClause = true;
    const includes = [];
    return includes;
  }
}

const dbGetLocalizationstring = (input) => {
  input.id = input.localizationStringId;
  const dbGetCommand = new DbGetLocalizationstringCommand(input);
  return dbGetCommand.execute();
};

module.exports = dbGetLocalizationstring;

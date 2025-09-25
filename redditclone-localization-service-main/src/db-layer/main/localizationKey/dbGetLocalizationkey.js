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

class DbGetLocalizationkeyCommand extends DBGetSequelizeCommand {
  constructor(input) {
    super(input, LocalizationKey);
    this.commandName = "dbGetLocalizationkey";
    this.nullResult = false;
    this.objectName = "localizationKey";
    this.serviceLabel = "redditclone-localization-service";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async getCqrsJoins(data) {
    if (LocalizationKey.getCqrsJoins) await LocalizationKey.getCqrsJoins(data);
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

const dbGetLocalizationkey = (input) => {
  input.id = input.localizationKeyId;
  const dbGetCommand = new DbGetLocalizationkeyCommand(input);
  return dbGetCommand.execute();
};

module.exports = dbGetLocalizationkey;

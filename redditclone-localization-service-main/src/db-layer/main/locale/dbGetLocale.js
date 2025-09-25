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

class DbGetLocaleCommand extends DBGetSequelizeCommand {
  constructor(input) {
    super(input, Locale);
    this.commandName = "dbGetLocale";
    this.nullResult = false;
    this.objectName = "locale";
    this.serviceLabel = "redditclone-localization-service";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async getCqrsJoins(data) {
    if (Locale.getCqrsJoins) await Locale.getCqrsJoins(data);
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

const dbGetLocale = (input) => {
  input.id = input.localeId;
  const dbGetCommand = new DbGetLocaleCommand(input);
  return dbGetCommand.execute();
};

module.exports = dbGetLocale;

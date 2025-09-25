const { DBGetListSequelizeCommand } = require("dbCommand");
const { sequelize, hexaLogger } = require("common");
const { Op } = require("sequelize");
const { Locale, LocalizationKey, LocalizationString } = require("models");

class DbListLocalizationkeysCommand extends DBGetListSequelizeCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbListLocalizationkeys";
    this.emptyResult = true;
    this.objectName = "localizationKeys";
    this.serviceLabel = "redditclone-localization-service";
    this.input.pagination = null;
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  initOwnership(input) {
    super.initOwnership(input);
  }

  // should i add this here?

  // ask about this should i rename the whereClause to dataClause???

  async transposeResult() {
    for (const localizationKey of this.dbData.items) {
      // tarnspose dbData item
    }
  }

  buildIncludes(forWhereClause) {
    if (!this.input.getJoins) forWhereClause = true;
    const includes = [];
    return includes;
  }

  async getCqrsJoins(item) {
    if (LocalizationKey.getCqrsJoins) {
      await LocalizationKey.getCqrsJoins(item);
    }
  }

  async executeQuery() {
    const input = this.input;
    let options = { where: this.whereClause };
    if (input.sortBy) options.order = input.sortBy ?? [["id", "ASC"]];

    options.include = this.buildIncludes();
    if (options.include && options.include.length == 0) options.include = null;

    if (!input.getJoins) {
      options.include = null;
    }

    let localizationKeys = null;

    const selectList = this.getSelectList();
    if (selectList && selectList.length) {
      options.attributes = selectList;
    }

    localizationKeys = await LocalizationKey.findAll(options);

    return localizationKeys;
  }
}

const dbListLocalizationkeys = (input) => {
  const dbGetListCommand = new DbListLocalizationkeysCommand(input);
  return dbGetListCommand.execute();
};

module.exports = dbListLocalizationkeys;

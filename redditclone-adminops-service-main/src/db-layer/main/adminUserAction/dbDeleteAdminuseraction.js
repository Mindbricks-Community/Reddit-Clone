const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { AdminUserAction } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const {
  AdminUserActionQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");

const { DBSoftDeleteSequelizeCommand } = require("dbCommand");

class DbDeleteAdminuseractionCommand extends DBSoftDeleteSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    super(input, AdminUserAction, instanceMode);
    this.commandName = "dbDeleteAdminuseraction";
    this.nullResult = false;
    this.objectName = "adminUserAction";
    this.serviceLabel = "redditclone-adminops-service";
    this.dbEvent =
      "redditclone-adminops-service-dbevent-adminuseraction-deleted";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  initOwnership(input) {
    super.initOwnership(input);
  }

  async createQueryCacheInvalidator() {
    this.queryCacheInvalidator = new AdminUserActionQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "adminUserAction",
      this.session,
      this.requestId,
    );
    await elasticIndexer.deleteData(this.dbData.id);
  }

  //should i add this here?

  // ask about this should i rename the whereClause to dataClause???

  async transposeResult() {
    // transpose dbData
  }
}

const dbDeleteAdminuseraction = async (input) => {
  input.id = input.adminUserActionId;
  const dbDeleteCommand = new DbDeleteAdminuseractionCommand(input);
  return dbDeleteCommand.execute();
};

module.exports = dbDeleteAdminuseraction;

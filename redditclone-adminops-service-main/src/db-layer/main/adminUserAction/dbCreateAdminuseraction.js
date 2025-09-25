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

const { DBCreateSequelizeCommand } = require("dbCommand");

const {
  AdminUserActionQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getAdminUserActionById = require("./utils/getAdminUserActionById");

class DbCreateAdminuseractionCommand extends DBCreateSequelizeCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbCreateAdminuseraction";
    this.objectName = "adminUserAction";
    this.serviceLabel = "redditclone-adminops-service";
    this.dbEvent =
      "redditclone-adminops-service-dbevent-adminuseraction-created";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
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
    const dbData = await getAdminUserActionById(this.dbData.id);
    await elasticIndexer.indexData(dbData);
  }

  // should i add hooksDbLayer here?

  // ask about this should i rename the whereClause to dataClause???

  async create_childs() {}

  async transposeResult() {
    // transpose dbData
  }

  async runDbCommand() {
    await super.runDbCommand();

    let adminUserAction = null;
    let whereClause = {};
    let updated = false;
    let exists = false;
    try {
      if (!updated && this.dataClause.id && !exists) {
        adminUserAction =
          adminUserAction ||
          (await AdminUserAction.findByPk(this.dataClause.id));
        if (adminUserAction) {
          delete this.dataClause.id;
          this.dataClause.isActive = true;
          await adminUserAction.update(this.dataClause);
          updated = true;
        }
      }
    } catch (error) {
      const eDetail = {
        whereClause: this.normalizeSequalizeOps(whereClause),
        dataClause: this.dataClause,
        errorStack: error.stack,
        checkoutResult: this.input.checkoutResult,
      };
      throw new HttpServerError(
        "Error in checking unique index when creating AdminUserAction",
        eDetail,
      );
    }

    if (!updated && !exists) {
      adminUserAction = await AdminUserAction.create(this.dataClause);
    }

    this.dbData = adminUserAction.getData();
    this.input.adminUserAction = this.dbData;
    await this.create_childs();
  }
}

const dbCreateAdminuseraction = async (input) => {
  const dbCreateCommand = new DbCreateAdminuseractionCommand(input);
  return await dbCreateCommand.execute();
};

module.exports = dbCreateAdminuseraction;

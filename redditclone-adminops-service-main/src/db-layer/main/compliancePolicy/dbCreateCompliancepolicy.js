const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { CompliancePolicy } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const { DBCreateSequelizeCommand } = require("dbCommand");

const {
  CompliancePolicyQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getCompliancePolicyById = require("./utils/getCompliancePolicyById");

class DbCreateCompliancepolicyCommand extends DBCreateSequelizeCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbCreateCompliancepolicy";
    this.objectName = "compliancePolicy";
    this.serviceLabel = "redditclone-adminops-service";
    this.dbEvent =
      "redditclone-adminops-service-dbevent-compliancepolicy-created";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async createQueryCacheInvalidator() {
    this.queryCacheInvalidator = new CompliancePolicyQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "compliancePolicy",
      this.session,
      this.requestId,
    );
    const dbData = await getCompliancePolicyById(this.dbData.id);
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

    let compliancePolicy = null;
    let whereClause = {};
    let updated = false;
    let exists = false;
    try {
      if (!updated && this.dataClause.id && !exists) {
        compliancePolicy =
          compliancePolicy ||
          (await CompliancePolicy.findByPk(this.dataClause.id));
        if (compliancePolicy) {
          delete this.dataClause.id;
          this.dataClause.isActive = true;
          await compliancePolicy.update(this.dataClause);
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
        "Error in checking unique index when creating CompliancePolicy",
        eDetail,
      );
    }

    if (!updated && !exists) {
      compliancePolicy = await CompliancePolicy.create(this.dataClause);
    }

    this.dbData = compliancePolicy.getData();
    this.input.compliancePolicy = this.dbData;
    await this.create_childs();
  }
}

const dbCreateCompliancepolicy = async (input) => {
  const dbCreateCommand = new DbCreateCompliancepolicyCommand(input);
  return await dbCreateCommand.execute();
};

module.exports = dbCreateCompliancepolicy;

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { PollOption } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const { DBCreateSequelizeCommand } = require("dbCommand");

const { PollOptionQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getPollOptionById = require("./utils/getPollOptionById");

class DbCreatePolloptionCommand extends DBCreateSequelizeCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbCreatePolloption";
    this.objectName = "pollOption";
    this.serviceLabel = "redditclone-content-service";
    this.dbEvent = "redditclone-content-service-dbevent-polloption-created";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async createQueryCacheInvalidator() {
    this.queryCacheInvalidator = new PollOptionQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "pollOption",
      this.session,
      this.requestId,
    );
    const dbData = await getPollOptionById(this.dbData.id);
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

    let pollOption = null;
    let whereClause = {};
    let updated = false;
    let exists = false;
    try {
      whereClause = {
        postId: this.dataClause.postId,
        optionIndex: this.dataClause.optionIndex,
      };

      pollOption =
        pollOption || (await PollOption.findOne({ where: whereClause }));

      if (pollOption) {
        throw new BadRequestError(
          "errMsg_DuplicateIndexErrorWithFields:" + "postId-optionIndex",
        );
      }

      if (!updated && this.dataClause.id && !exists) {
        pollOption =
          pollOption || (await PollOption.findByPk(this.dataClause.id));
        if (pollOption) {
          delete this.dataClause.id;
          this.dataClause.isActive = true;
          await pollOption.update(this.dataClause);
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
        "Error in checking unique index when creating PollOption",
        eDetail,
      );
    }

    if (!updated && !exists) {
      pollOption = await PollOption.create(this.dataClause);
    }

    this.dbData = pollOption.getData();
    this.input.pollOption = this.dbData;
    await this.create_childs();
  }
}

const dbCreatePolloption = async (input) => {
  const dbCreateCommand = new DbCreatePolloptionCommand(input);
  return await dbCreateCommand.execute();
};

module.exports = dbCreatePolloption;

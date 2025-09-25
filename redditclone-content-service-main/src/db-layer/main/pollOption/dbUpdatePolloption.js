const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { Post, Comment, Vote, PollOption, PostMedia } = require("models");
const { Op } = require("sequelize");
const { sequelize } = require("common");

const { DBUpdateSequelizeCommand } = require("dbCommand");

const { PollOptionQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getPollOptionById = require("./utils/getPollOptionById");

//not
//should i ask this here? is &&false intentionally added?

class DbUpdatePolloptionCommand extends DBUpdateSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    input.isBulk = false;
    input.updateEach = false;
    super(input, PollOption, instanceMode);
    this.isBulk = false;
    this.commandName = "dbUpdatePolloption";
    this.nullResult = false;
    this.objectName = "pollOption";
    this.serviceLabel = "redditclone-content-service";
    this.joinedCriteria = false;
    this.dbEvent = "redditclone-content-service-dbevent-polloption-updated";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  initOwnership(input) {
    super.initOwnership(input);
  }

  async transposeResult() {
    // transpose dbData
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

  // ask about this should i rename the whereClause to dataClause???

  async setCalculatedFieldsAfterInstance(data) {
    const input = this.input;
  }

  buildIncludes(forWhereClause) {
    if (!this.input.getJoins) forWhereClause = true;
    const includes = [];
    return includes;
  }
}

const dbUpdatePolloption = async (input) => {
  input.id = input.pollOptionId;
  const dbUpdateCommand = new DbUpdatePolloptionCommand(input);
  return await dbUpdateCommand.execute();
};

module.exports = dbUpdatePolloption;

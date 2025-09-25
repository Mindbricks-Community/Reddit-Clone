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

const { VoteQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getVoteById = require("./utils/getVoteById");

//not
//should i ask this here? is &&false intentionally added?

class DbUpdateVoteCommand extends DBUpdateSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    input.isBulk = false;
    input.updateEach = false;
    super(input, Vote, instanceMode);
    this.isBulk = false;
    this.commandName = "dbUpdateVote";
    this.nullResult = false;
    this.objectName = "vote";
    this.serviceLabel = "redditclone-content-service";
    this.joinedCriteria = false;
    this.dbEvent = "redditclone-content-service-dbevent-vote-updated";
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
    this.queryCacheInvalidator = new VoteQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "vote",
      this.session,
      this.requestId,
    );
    const dbData = await getVoteById(this.dbData.id);
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

const dbUpdateVote = async (input) => {
  input.id = input.voteId;
  const dbUpdateCommand = new DbUpdateVoteCommand(input);
  return await dbUpdateCommand.execute();
};

module.exports = dbUpdateVote;

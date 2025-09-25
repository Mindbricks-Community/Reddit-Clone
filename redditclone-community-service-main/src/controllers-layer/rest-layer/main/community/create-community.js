const { CreateCommunityManager } = require("managers");

const CommunityRestController = require("../../CommunityServiceRestController");

class CreateCommunityRestController extends CommunityRestController {
  constructor(req, res) {
    super("createCommunity", "createcommunity", req, res);
    this.dataName = "community";
    this.crudType = "create";
    this.status = 201;
    this.httpMethod = "POST";
  }

  createApiManager() {
    return new CreateCommunityManager(this._req, "rest");
  }
}

const createCommunity = async (req, res, next) => {
  const createCommunityRestController = new CreateCommunityRestController(
    req,
    res,
  );
  try {
    await createCommunityRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = createCommunity;

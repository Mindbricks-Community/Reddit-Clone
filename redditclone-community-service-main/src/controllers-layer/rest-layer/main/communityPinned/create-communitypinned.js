const { CreateCommunityPinnedManager } = require("managers");

const CommunityRestController = require("../../CommunityServiceRestController");

class CreateCommunityPinnedRestController extends CommunityRestController {
  constructor(req, res) {
    super("createCommunityPinned", "createcommunitypinned", req, res);
    this.dataName = "communityPinned";
    this.crudType = "create";
    this.status = 201;
    this.httpMethod = "POST";
  }

  createApiManager() {
    return new CreateCommunityPinnedManager(this._req, "rest");
  }
}

const createCommunityPinned = async (req, res, next) => {
  const createCommunityPinnedRestController =
    new CreateCommunityPinnedRestController(req, res);
  try {
    await createCommunityPinnedRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = createCommunityPinned;

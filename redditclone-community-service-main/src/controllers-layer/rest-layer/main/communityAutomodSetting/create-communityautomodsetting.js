const { CreateCommunityAutomodSettingManager } = require("managers");

const CommunityRestController = require("../../CommunityServiceRestController");

class CreateCommunityAutomodSettingRestController extends CommunityRestController {
  constructor(req, res) {
    super(
      "createCommunityAutomodSetting",
      "createcommunityautomodsetting",
      req,
      res,
    );
    this.dataName = "communityAutomodSetting";
    this.crudType = "create";
    this.status = 201;
    this.httpMethod = "POST";
  }

  createApiManager() {
    return new CreateCommunityAutomodSettingManager(this._req, "rest");
  }
}

const createCommunityAutomodSetting = async (req, res, next) => {
  const createCommunityAutomodSettingRestController =
    new CreateCommunityAutomodSettingRestController(req, res);
  try {
    await createCommunityAutomodSettingRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = createCommunityAutomodSetting;

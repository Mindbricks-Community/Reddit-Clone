const { DeleteCommunityAutomodSettingManager } = require("managers");

const CommunityRestController = require("../../CommunityServiceRestController");

class DeleteCommunityAutomodSettingRestController extends CommunityRestController {
  constructor(req, res) {
    super(
      "deleteCommunityAutomodSetting",
      "deletecommunityautomodsetting",
      req,
      res,
    );
    this.dataName = "communityAutomodSetting";
    this.crudType = "delete";
    this.status = 200;
    this.httpMethod = "DELETE";
  }

  createApiManager() {
    return new DeleteCommunityAutomodSettingManager(this._req, "rest");
  }
}

const deleteCommunityAutomodSetting = async (req, res, next) => {
  const deleteCommunityAutomodSettingRestController =
    new DeleteCommunityAutomodSettingRestController(req, res);
  try {
    await deleteCommunityAutomodSettingRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = deleteCommunityAutomodSetting;

const { UpdateCommunityAutomodSettingManager } = require("managers");

const CommunityRestController = require("../../CommunityServiceRestController");

class UpdateCommunityAutomodSettingRestController extends CommunityRestController {
  constructor(req, res) {
    super(
      "updateCommunityAutomodSetting",
      "updatecommunityautomodsetting",
      req,
      res,
    );
    this.dataName = "communityAutomodSetting";
    this.crudType = "update";
    this.status = 200;
    this.httpMethod = "PATCH";
  }

  createApiManager() {
    return new UpdateCommunityAutomodSettingManager(this._req, "rest");
  }
}

const updateCommunityAutomodSetting = async (req, res, next) => {
  const updateCommunityAutomodSettingRestController =
    new UpdateCommunityAutomodSettingRestController(req, res);
  try {
    await updateCommunityAutomodSettingRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = updateCommunityAutomodSetting;

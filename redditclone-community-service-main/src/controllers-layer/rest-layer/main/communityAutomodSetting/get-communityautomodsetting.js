const { GetCommunityAutomodSettingManager } = require("managers");

const CommunityRestController = require("../../CommunityServiceRestController");

class GetCommunityAutomodSettingRestController extends CommunityRestController {
  constructor(req, res) {
    super("getCommunityAutomodSetting", "getcommunityautomodsetting", req, res);
    this.dataName = "communityAutomodSetting";
    this.crudType = "get";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new GetCommunityAutomodSettingManager(this._req, "rest");
  }
}

const getCommunityAutomodSetting = async (req, res, next) => {
  const getCommunityAutomodSettingRestController =
    new GetCommunityAutomodSettingRestController(req, res);
  try {
    await getCommunityAutomodSettingRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = getCommunityAutomodSetting;

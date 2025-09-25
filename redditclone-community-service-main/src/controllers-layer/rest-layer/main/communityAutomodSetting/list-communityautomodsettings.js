const { ListCommunityAutomodSettingsManager } = require("managers");

const CommunityRestController = require("../../CommunityServiceRestController");

class ListCommunityAutomodSettingsRestController extends CommunityRestController {
  constructor(req, res) {
    super(
      "listCommunityAutomodSettings",
      "listcommunityautomodsettings",
      req,
      res,
    );
    this.dataName = "communityAutomodSettings";
    this.crudType = "getList";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new ListCommunityAutomodSettingsManager(this._req, "rest");
  }
}

const listCommunityAutomodSettings = async (req, res, next) => {
  const listCommunityAutomodSettingsRestController =
    new ListCommunityAutomodSettingsRestController(req, res);
  try {
    await listCommunityAutomodSettingsRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = listCommunityAutomodSettings;

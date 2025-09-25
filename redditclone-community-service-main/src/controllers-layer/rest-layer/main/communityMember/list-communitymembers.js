const { ListCommunityMembersManager } = require("managers");

const CommunityRestController = require("../../CommunityServiceRestController");

class ListCommunityMembersRestController extends CommunityRestController {
  constructor(req, res) {
    super("listCommunityMembers", "listcommunitymembers", req, res);
    this.dataName = "communityMembers";
    this.crudType = "getList";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new ListCommunityMembersManager(this._req, "rest");
  }
}

const listCommunityMembers = async (req, res, next) => {
  const listCommunityMembersRestController =
    new ListCommunityMembersRestController(req, res);
  try {
    await listCommunityMembersRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = listCommunityMembers;

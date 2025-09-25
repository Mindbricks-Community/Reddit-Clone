const { DeleteCommunityMemberManager } = require("managers");

const CommunityRestController = require("../../CommunityServiceRestController");

class DeleteCommunityMemberRestController extends CommunityRestController {
  constructor(req, res) {
    super("deleteCommunityMember", "deletecommunitymember", req, res);
    this.dataName = "communityMember";
    this.crudType = "delete";
    this.status = 200;
    this.httpMethod = "DELETE";
  }

  createApiManager() {
    return new DeleteCommunityMemberManager(this._req, "rest");
  }
}

const deleteCommunityMember = async (req, res, next) => {
  const deleteCommunityMemberRestController =
    new DeleteCommunityMemberRestController(req, res);
  try {
    await deleteCommunityMemberRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = deleteCommunityMember;

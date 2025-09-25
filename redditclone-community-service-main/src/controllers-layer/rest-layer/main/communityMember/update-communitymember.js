const { UpdateCommunityMemberManager } = require("managers");

const CommunityRestController = require("../../CommunityServiceRestController");

class UpdateCommunityMemberRestController extends CommunityRestController {
  constructor(req, res) {
    super("updateCommunityMember", "updatecommunitymember", req, res);
    this.dataName = "communityMember";
    this.crudType = "update";
    this.status = 200;
    this.httpMethod = "PATCH";
  }

  createApiManager() {
    return new UpdateCommunityMemberManager(this._req, "rest");
  }
}

const updateCommunityMember = async (req, res, next) => {
  const updateCommunityMemberRestController =
    new UpdateCommunityMemberRestController(req, res);
  try {
    await updateCommunityMemberRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = updateCommunityMember;

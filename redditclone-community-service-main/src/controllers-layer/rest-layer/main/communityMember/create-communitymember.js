const { CreateCommunityMemberManager } = require("managers");

const CommunityRestController = require("../../CommunityServiceRestController");

class CreateCommunityMemberRestController extends CommunityRestController {
  constructor(req, res) {
    super("createCommunityMember", "createcommunitymember", req, res);
    this.dataName = "communityMember";
    this.crudType = "create";
    this.status = 201;
    this.httpMethod = "POST";
  }

  createApiManager() {
    return new CreateCommunityMemberManager(this._req, "rest");
  }
}

const createCommunityMember = async (req, res, next) => {
  const createCommunityMemberRestController =
    new CreateCommunityMemberRestController(req, res);
  try {
    await createCommunityMemberRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = createCommunityMember;

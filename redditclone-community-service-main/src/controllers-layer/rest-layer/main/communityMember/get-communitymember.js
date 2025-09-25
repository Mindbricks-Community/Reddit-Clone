const { GetCommunityMemberManager } = require("managers");

const CommunityRestController = require("../../CommunityServiceRestController");

class GetCommunityMemberRestController extends CommunityRestController {
  constructor(req, res) {
    super("getCommunityMember", "getcommunitymember", req, res);
    this.dataName = "communityMember";
    this.crudType = "get";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new GetCommunityMemberManager(this._req, "rest");
  }
}

const getCommunityMember = async (req, res, next) => {
  const getCommunityMemberRestController = new GetCommunityMemberRestController(
    req,
    res,
  );
  try {
    await getCommunityMemberRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = getCommunityMember;

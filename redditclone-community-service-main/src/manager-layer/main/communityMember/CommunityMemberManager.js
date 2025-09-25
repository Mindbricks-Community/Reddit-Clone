const { HttpServerError, HttpError, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");

const CommunityServiceManager = require("../../service-manager/CommunityServiceManager");

/* Base Class For the Crud Routes Of DbObject CommunityMember */
class CommunityMemberManager extends CommunityServiceManager {
  constructor(request, options) {
    super(request, options);
    this.objectName = "communityMember";
    this.modelName = "CommunityMember";
  }

  toJSON() {
    const jsonObj = super.toJSON();

    return jsonObj;
  }
}

module.exports = CommunityMemberManager;

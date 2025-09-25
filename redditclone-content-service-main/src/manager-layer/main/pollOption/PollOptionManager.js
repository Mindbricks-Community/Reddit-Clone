const { HttpServerError, HttpError, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");

const ContentServiceManager = require("../../service-manager/ContentServiceManager");

/* Base Class For the Crud Routes Of DbObject PollOption */
class PollOptionManager extends ContentServiceManager {
  constructor(request, options) {
    super(request, options);
    this.objectName = "pollOption";
    this.modelName = "PollOption";
  }

  toJSON() {
    const jsonObj = super.toJSON();

    return jsonObj;
  }
}

module.exports = PollOptionManager;

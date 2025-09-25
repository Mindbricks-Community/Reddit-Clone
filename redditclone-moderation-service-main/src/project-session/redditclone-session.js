const { NotAuthenticatedError, ForbiddenError } = require("common");
const { hexaLogger } = require("common");
const HexaAuth = require("./hexa-auth");

class RedditcloneSession extends HexaAuth {
  constructor() {
    super();
    this.ROLES = {};

    this.projectName = "redditclone";
    this.projectCodename = "redditclone";
    this.isJWT = true;
    this.isJWTAuthRSA = true;
    this.isRemoteAuth = false;
    this.useRemoteSession = false;
  }
}

module.exports = RedditcloneSession;

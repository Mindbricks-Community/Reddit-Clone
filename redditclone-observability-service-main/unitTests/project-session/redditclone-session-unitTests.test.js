const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { NotAuthorizedError } = require("common");

describe("redditclone-session", () => {
  beforeEach(() => {
    InstanceSession = proxyquire(
      "../../src/project-session/redditclone-session",
      {
        common: {
          hexaLogger: { log: sinon.stub() },
        },
        "../../src/project-session/hexa-auth": class {
          getBearerToken = sinon.stub();
          getCookieToken = sinon.stub();
        },
      },
    );

    instance = new InstanceSession();
    instance.session = {}; // default dummy session
  });
});

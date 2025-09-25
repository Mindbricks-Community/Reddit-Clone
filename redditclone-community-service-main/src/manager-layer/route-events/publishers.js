const { ServicePublisher } = require("serviceCommon");

// Community Event Publisher Classes

// Publisher class for createCommunity route
const { CommunityCreatedTopic } = require("./topics");
class CommunityCreatedPublisher extends ServicePublisher {
  constructor(community, session, requestId) {
    super(CommunityCreatedTopic, community, session, requestId);
  }

  static async Publish(community, session, requestId) {
    const _publisher = new CommunityCreatedPublisher(
      community,
      session,
      requestId,
    );
    await _publisher.publish();
  }
}

// Publisher class for updateCommunity route
const { CommunityUpdatedTopic } = require("./topics");
class CommunityUpdatedPublisher extends ServicePublisher {
  constructor(community, session, requestId) {
    super(CommunityUpdatedTopic, community, session, requestId);
  }

  static async Publish(community, session, requestId) {
    const _publisher = new CommunityUpdatedPublisher(
      community,
      session,
      requestId,
    );
    await _publisher.publish();
  }
}

// Publisher class for deleteCommunity route
const { CommunityDeletedTopic } = require("./topics");
class CommunityDeletedPublisher extends ServicePublisher {
  constructor(community, session, requestId) {
    super(CommunityDeletedTopic, community, session, requestId);
  }

  static async Publish(community, session, requestId) {
    const _publisher = new CommunityDeletedPublisher(
      community,
      session,
      requestId,
    );
    await _publisher.publish();
  }
}

// CommunityMember Event Publisher Classes

// Publisher class for createCommunityMember route
const { CommunitymemberCreatedTopic } = require("./topics");
class CommunitymemberCreatedPublisher extends ServicePublisher {
  constructor(communitymember, session, requestId) {
    super(CommunitymemberCreatedTopic, communitymember, session, requestId);
  }

  static async Publish(communitymember, session, requestId) {
    const _publisher = new CommunitymemberCreatedPublisher(
      communitymember,
      session,
      requestId,
    );
    await _publisher.publish();
  }
}

// Publisher class for updateCommunityMember route
const { CommunitymemberUpdatedTopic } = require("./topics");
class CommunitymemberUpdatedPublisher extends ServicePublisher {
  constructor(communitymember, session, requestId) {
    super(CommunitymemberUpdatedTopic, communitymember, session, requestId);
  }

  static async Publish(communitymember, session, requestId) {
    const _publisher = new CommunitymemberUpdatedPublisher(
      communitymember,
      session,
      requestId,
    );
    await _publisher.publish();
  }
}

// Publisher class for deleteCommunityMember route
const { CommunitymemberDeletedTopic } = require("./topics");
class CommunitymemberDeletedPublisher extends ServicePublisher {
  constructor(communitymember, session, requestId) {
    super(CommunitymemberDeletedTopic, communitymember, session, requestId);
  }

  static async Publish(communitymember, session, requestId) {
    const _publisher = new CommunitymemberDeletedPublisher(
      communitymember,
      session,
      requestId,
    );
    await _publisher.publish();
  }
}

// CommunityRule Event Publisher Classes

// Publisher class for createCommunityRule route
const { CommunityruleCreatedTopic } = require("./topics");
class CommunityruleCreatedPublisher extends ServicePublisher {
  constructor(communityrule, session, requestId) {
    super(CommunityruleCreatedTopic, communityrule, session, requestId);
  }

  static async Publish(communityrule, session, requestId) {
    const _publisher = new CommunityruleCreatedPublisher(
      communityrule,
      session,
      requestId,
    );
    await _publisher.publish();
  }
}

// Publisher class for updateCommunityRule route
const { CommunityruleUpdatedTopic } = require("./topics");
class CommunityruleUpdatedPublisher extends ServicePublisher {
  constructor(communityrule, session, requestId) {
    super(CommunityruleUpdatedTopic, communityrule, session, requestId);
  }

  static async Publish(communityrule, session, requestId) {
    const _publisher = new CommunityruleUpdatedPublisher(
      communityrule,
      session,
      requestId,
    );
    await _publisher.publish();
  }
}

// Publisher class for deleteCommunityRule route
const { CommunityruleDeletedTopic } = require("./topics");
class CommunityruleDeletedPublisher extends ServicePublisher {
  constructor(communityrule, session, requestId) {
    super(CommunityruleDeletedTopic, communityrule, session, requestId);
  }

  static async Publish(communityrule, session, requestId) {
    const _publisher = new CommunityruleDeletedPublisher(
      communityrule,
      session,
      requestId,
    );
    await _publisher.publish();
  }
}

// CommunityPinned Event Publisher Classes

// Publisher class for createCommunityPinned route
const { CommunitypinnedCreatedTopic } = require("./topics");
class CommunitypinnedCreatedPublisher extends ServicePublisher {
  constructor(communitypinned, session, requestId) {
    super(CommunitypinnedCreatedTopic, communitypinned, session, requestId);
  }

  static async Publish(communitypinned, session, requestId) {
    const _publisher = new CommunitypinnedCreatedPublisher(
      communitypinned,
      session,
      requestId,
    );
    await _publisher.publish();
  }
}

// Publisher class for updateCommunityPinned route
const { CommunitypinnedUpdatedTopic } = require("./topics");
class CommunitypinnedUpdatedPublisher extends ServicePublisher {
  constructor(communitypinned, session, requestId) {
    super(CommunitypinnedUpdatedTopic, communitypinned, session, requestId);
  }

  static async Publish(communitypinned, session, requestId) {
    const _publisher = new CommunitypinnedUpdatedPublisher(
      communitypinned,
      session,
      requestId,
    );
    await _publisher.publish();
  }
}

// Publisher class for deleteCommunityPinned route
const { CommunitypinnedDeletedTopic } = require("./topics");
class CommunitypinnedDeletedPublisher extends ServicePublisher {
  constructor(communitypinned, session, requestId) {
    super(CommunitypinnedDeletedTopic, communitypinned, session, requestId);
  }

  static async Publish(communitypinned, session, requestId) {
    const _publisher = new CommunitypinnedDeletedPublisher(
      communitypinned,
      session,
      requestId,
    );
    await _publisher.publish();
  }
}

// CommunityAutomodSetting Event Publisher Classes

// Publisher class for createCommunityAutomodSetting route
const { CommunityautomodsettingCreatedTopic } = require("./topics");
class CommunityautomodsettingCreatedPublisher extends ServicePublisher {
  constructor(communityautomodsetting, session, requestId) {
    super(
      CommunityautomodsettingCreatedTopic,
      communityautomodsetting,
      session,
      requestId,
    );
  }

  static async Publish(communityautomodsetting, session, requestId) {
    const _publisher = new CommunityautomodsettingCreatedPublisher(
      communityautomodsetting,
      session,
      requestId,
    );
    await _publisher.publish();
  }
}

// Publisher class for updateCommunityAutomodSetting route
const { CommunityautomodsettingUpdatedTopic } = require("./topics");
class CommunityautomodsettingUpdatedPublisher extends ServicePublisher {
  constructor(communityautomodsetting, session, requestId) {
    super(
      CommunityautomodsettingUpdatedTopic,
      communityautomodsetting,
      session,
      requestId,
    );
  }

  static async Publish(communityautomodsetting, session, requestId) {
    const _publisher = new CommunityautomodsettingUpdatedPublisher(
      communityautomodsetting,
      session,
      requestId,
    );
    await _publisher.publish();
  }
}

// Publisher class for deleteCommunityAutomodSetting route
const { CommunityautomodsettingDeletedTopic } = require("./topics");
class CommunityautomodsettingDeletedPublisher extends ServicePublisher {
  constructor(communityautomodsetting, session, requestId) {
    super(
      CommunityautomodsettingDeletedTopic,
      communityautomodsetting,
      session,
      requestId,
    );
  }

  static async Publish(communityautomodsetting, session, requestId) {
    const _publisher = new CommunityautomodsettingDeletedPublisher(
      communityautomodsetting,
      session,
      requestId,
    );
    await _publisher.publish();
  }
}

module.exports = {
  CommunityCreatedPublisher,
  CommunityUpdatedPublisher,
  CommunityDeletedPublisher,
  CommunitymemberCreatedPublisher,
  CommunitymemberUpdatedPublisher,
  CommunitymemberDeletedPublisher,
  CommunityruleCreatedPublisher,
  CommunityruleUpdatedPublisher,
  CommunityruleDeletedPublisher,
  CommunitypinnedCreatedPublisher,
  CommunitypinnedUpdatedPublisher,
  CommunitypinnedDeletedPublisher,
  CommunityautomodsettingCreatedPublisher,
  CommunityautomodsettingUpdatedPublisher,
  CommunityautomodsettingDeletedPublisher,
};

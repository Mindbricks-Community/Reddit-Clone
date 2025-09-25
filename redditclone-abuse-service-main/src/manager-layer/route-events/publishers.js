const { ServicePublisher } = require("serviceCommon");

// AbuseReport Event Publisher Classes

// Publisher class for createAbuseReport route
const { AbusereportCreatedTopic } = require("./topics");
class AbusereportCreatedPublisher extends ServicePublisher {
  constructor(abusereport, session, requestId) {
    super(AbusereportCreatedTopic, abusereport, session, requestId);
  }

  static async Publish(abusereport, session, requestId) {
    const _publisher = new AbusereportCreatedPublisher(
      abusereport,
      session,
      requestId,
    );
    await _publisher.publish();
  }
}

// Publisher class for updateAbuseReport route
const { AbusereportUpdatedTopic } = require("./topics");
class AbusereportUpdatedPublisher extends ServicePublisher {
  constructor(abusereport, session, requestId) {
    super(AbusereportUpdatedTopic, abusereport, session, requestId);
  }

  static async Publish(abusereport, session, requestId) {
    const _publisher = new AbusereportUpdatedPublisher(
      abusereport,
      session,
      requestId,
    );
    await _publisher.publish();
  }
}

// Publisher class for deleteAbuseReport route
const { AbusereportDeletedTopic } = require("./topics");
class AbusereportDeletedPublisher extends ServicePublisher {
  constructor(abusereport, session, requestId) {
    super(AbusereportDeletedTopic, abusereport, session, requestId);
  }

  static async Publish(abusereport, session, requestId) {
    const _publisher = new AbusereportDeletedPublisher(
      abusereport,
      session,
      requestId,
    );
    await _publisher.publish();
  }
}

// AbuseFlag Event Publisher Classes

// Publisher class for createAbuseFlag route
const { AbuseflagCreatedTopic } = require("./topics");
class AbuseflagCreatedPublisher extends ServicePublisher {
  constructor(abuseflag, session, requestId) {
    super(AbuseflagCreatedTopic, abuseflag, session, requestId);
  }

  static async Publish(abuseflag, session, requestId) {
    const _publisher = new AbuseflagCreatedPublisher(
      abuseflag,
      session,
      requestId,
    );
    await _publisher.publish();
  }
}

// Publisher class for updateAbuseFlag route
const { AbuseflagUpdatedTopic } = require("./topics");
class AbuseflagUpdatedPublisher extends ServicePublisher {
  constructor(abuseflag, session, requestId) {
    super(AbuseflagUpdatedTopic, abuseflag, session, requestId);
  }

  static async Publish(abuseflag, session, requestId) {
    const _publisher = new AbuseflagUpdatedPublisher(
      abuseflag,
      session,
      requestId,
    );
    await _publisher.publish();
  }
}

// Publisher class for deleteAbuseFlag route
const { AbuseflagDeletedTopic } = require("./topics");
class AbuseflagDeletedPublisher extends ServicePublisher {
  constructor(abuseflag, session, requestId) {
    super(AbuseflagDeletedTopic, abuseflag, session, requestId);
  }

  static async Publish(abuseflag, session, requestId) {
    const _publisher = new AbuseflagDeletedPublisher(
      abuseflag,
      session,
      requestId,
    );
    await _publisher.publish();
  }
}

// AbuseHeuristicTrigger Event Publisher Classes

// Publisher class for createAbuseHeuristicTrigger route
const { AbuseheuristictriggerCreatedTopic } = require("./topics");
class AbuseheuristictriggerCreatedPublisher extends ServicePublisher {
  constructor(abuseheuristictrigger, session, requestId) {
    super(
      AbuseheuristictriggerCreatedTopic,
      abuseheuristictrigger,
      session,
      requestId,
    );
  }

  static async Publish(abuseheuristictrigger, session, requestId) {
    const _publisher = new AbuseheuristictriggerCreatedPublisher(
      abuseheuristictrigger,
      session,
      requestId,
    );
    await _publisher.publish();
  }
}

// Publisher class for updateAbuseHeuristicTrigger route
const { AbuseheuristictriggerUpdatedTopic } = require("./topics");
class AbuseheuristictriggerUpdatedPublisher extends ServicePublisher {
  constructor(abuseheuristictrigger, session, requestId) {
    super(
      AbuseheuristictriggerUpdatedTopic,
      abuseheuristictrigger,
      session,
      requestId,
    );
  }

  static async Publish(abuseheuristictrigger, session, requestId) {
    const _publisher = new AbuseheuristictriggerUpdatedPublisher(
      abuseheuristictrigger,
      session,
      requestId,
    );
    await _publisher.publish();
  }
}

// Publisher class for deleteAbuseHeuristicTrigger route
const { AbuseheuristictriggerDeletedTopic } = require("./topics");
class AbuseheuristictriggerDeletedPublisher extends ServicePublisher {
  constructor(abuseheuristictrigger, session, requestId) {
    super(
      AbuseheuristictriggerDeletedTopic,
      abuseheuristictrigger,
      session,
      requestId,
    );
  }

  static async Publish(abuseheuristictrigger, session, requestId) {
    const _publisher = new AbuseheuristictriggerDeletedPublisher(
      abuseheuristictrigger,
      session,
      requestId,
    );
    await _publisher.publish();
  }
}

// AbuseInvestigation Event Publisher Classes

// Publisher class for createAbuseInvestigation route
const { AbuseinvestigationCreatedTopic } = require("./topics");
class AbuseinvestigationCreatedPublisher extends ServicePublisher {
  constructor(abuseinvestigation, session, requestId) {
    super(
      AbuseinvestigationCreatedTopic,
      abuseinvestigation,
      session,
      requestId,
    );
  }

  static async Publish(abuseinvestigation, session, requestId) {
    const _publisher = new AbuseinvestigationCreatedPublisher(
      abuseinvestigation,
      session,
      requestId,
    );
    await _publisher.publish();
  }
}

// Publisher class for updateAbuseInvestigation route
const { AbuseinvestigationUpdatedTopic } = require("./topics");
class AbuseinvestigationUpdatedPublisher extends ServicePublisher {
  constructor(abuseinvestigation, session, requestId) {
    super(
      AbuseinvestigationUpdatedTopic,
      abuseinvestigation,
      session,
      requestId,
    );
  }

  static async Publish(abuseinvestigation, session, requestId) {
    const _publisher = new AbuseinvestigationUpdatedPublisher(
      abuseinvestigation,
      session,
      requestId,
    );
    await _publisher.publish();
  }
}

// Publisher class for deleteAbuseInvestigation route
const { AbuseinvestigationDeletedTopic } = require("./topics");
class AbuseinvestigationDeletedPublisher extends ServicePublisher {
  constructor(abuseinvestigation, session, requestId) {
    super(
      AbuseinvestigationDeletedTopic,
      abuseinvestigation,
      session,
      requestId,
    );
  }

  static async Publish(abuseinvestigation, session, requestId) {
    const _publisher = new AbuseinvestigationDeletedPublisher(
      abuseinvestigation,
      session,
      requestId,
    );
    await _publisher.publish();
  }
}

module.exports = {
  AbusereportCreatedPublisher,
  AbusereportUpdatedPublisher,
  AbusereportDeletedPublisher,
  AbuseflagCreatedPublisher,
  AbuseflagUpdatedPublisher,
  AbuseflagDeletedPublisher,
  AbuseheuristictriggerCreatedPublisher,
  AbuseheuristictriggerUpdatedPublisher,
  AbuseheuristictriggerDeletedPublisher,
  AbuseinvestigationCreatedPublisher,
  AbuseinvestigationUpdatedPublisher,
  AbuseinvestigationDeletedPublisher,
};

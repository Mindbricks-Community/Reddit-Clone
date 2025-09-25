const { ServicePublisher } = require("serviceCommon");

// Post Event Publisher Classes

// Publisher class for createPost route
const { PostCreatedTopic } = require("./topics");
class PostCreatedPublisher extends ServicePublisher {
  constructor(post, session, requestId) {
    super(PostCreatedTopic, post, session, requestId);
  }

  static async Publish(post, session, requestId) {
    const _publisher = new PostCreatedPublisher(post, session, requestId);
    await _publisher.publish();
  }
}

// Publisher class for updatePost route
const { PostUpdatedTopic } = require("./topics");
class PostUpdatedPublisher extends ServicePublisher {
  constructor(post, session, requestId) {
    super(PostUpdatedTopic, post, session, requestId);
  }

  static async Publish(post, session, requestId) {
    const _publisher = new PostUpdatedPublisher(post, session, requestId);
    await _publisher.publish();
  }
}

// Publisher class for deletePost route
const { PostDeletedTopic } = require("./topics");
class PostDeletedPublisher extends ServicePublisher {
  constructor(post, session, requestId) {
    super(PostDeletedTopic, post, session, requestId);
  }

  static async Publish(post, session, requestId) {
    const _publisher = new PostDeletedPublisher(post, session, requestId);
    await _publisher.publish();
  }
}

// Comment Event Publisher Classes

// Publisher class for createComment route
const { CommentCreatedTopic } = require("./topics");
class CommentCreatedPublisher extends ServicePublisher {
  constructor(comment, session, requestId) {
    super(CommentCreatedTopic, comment, session, requestId);
  }

  static async Publish(comment, session, requestId) {
    const _publisher = new CommentCreatedPublisher(comment, session, requestId);
    await _publisher.publish();
  }
}

// Publisher class for updateComment route
const { CommentUpdatedTopic } = require("./topics");
class CommentUpdatedPublisher extends ServicePublisher {
  constructor(comment, session, requestId) {
    super(CommentUpdatedTopic, comment, session, requestId);
  }

  static async Publish(comment, session, requestId) {
    const _publisher = new CommentUpdatedPublisher(comment, session, requestId);
    await _publisher.publish();
  }
}

// Publisher class for deleteComment route
const { CommentDeletedTopic } = require("./topics");
class CommentDeletedPublisher extends ServicePublisher {
  constructor(comment, session, requestId) {
    super(CommentDeletedTopic, comment, session, requestId);
  }

  static async Publish(comment, session, requestId) {
    const _publisher = new CommentDeletedPublisher(comment, session, requestId);
    await _publisher.publish();
  }
}

// Vote Event Publisher Classes

// Publisher class for createVote route
const { VoteCreatedTopic } = require("./topics");
class VoteCreatedPublisher extends ServicePublisher {
  constructor(vote, session, requestId) {
    super(VoteCreatedTopic, vote, session, requestId);
  }

  static async Publish(vote, session, requestId) {
    const _publisher = new VoteCreatedPublisher(vote, session, requestId);
    await _publisher.publish();
  }
}

// Publisher class for updateVote route
const { VoteUpdatedTopic } = require("./topics");
class VoteUpdatedPublisher extends ServicePublisher {
  constructor(vote, session, requestId) {
    super(VoteUpdatedTopic, vote, session, requestId);
  }

  static async Publish(vote, session, requestId) {
    const _publisher = new VoteUpdatedPublisher(vote, session, requestId);
    await _publisher.publish();
  }
}

// Publisher class for deleteVote route
const { VoteDeletedTopic } = require("./topics");
class VoteDeletedPublisher extends ServicePublisher {
  constructor(vote, session, requestId) {
    super(VoteDeletedTopic, vote, session, requestId);
  }

  static async Publish(vote, session, requestId) {
    const _publisher = new VoteDeletedPublisher(vote, session, requestId);
    await _publisher.publish();
  }
}

// PollOption Event Publisher Classes

// PostMedia Event Publisher Classes

module.exports = {
  PostCreatedPublisher,
  PostUpdatedPublisher,
  PostDeletedPublisher,
  CommentCreatedPublisher,
  CommentUpdatedPublisher,
  CommentDeletedPublisher,
  VoteCreatedPublisher,
  VoteUpdatedPublisher,
  VoteDeletedPublisher,
};

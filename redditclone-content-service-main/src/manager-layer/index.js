module.exports = {
  ContentServiceManager: require("./service-manager/ContentServiceManager"),
  // main Database Crud Object Routes Manager Layer Classes
  // Post Db Object
  GetPostManager: require("./main/post/get-post"),
  CreatePostManager: require("./main/post/create-post"),
  UpdatePostManager: require("./main/post/update-post"),
  DeletePostManager: require("./main/post/delete-post"),
  ListPostsManager: require("./main/post/list-posts"),
  // Comment Db Object
  GetCommentManager: require("./main/comment/get-comment"),
  CreateCommentManager: require("./main/comment/create-comment"),
  UpdateCommentManager: require("./main/comment/update-comment"),
  DeleteCommentManager: require("./main/comment/delete-comment"),
  ListCommentsManager: require("./main/comment/list-comments"),
  // Vote Db Object
  GetVoteManager: require("./main/vote/get-vote"),
  CreateVoteManager: require("./main/vote/create-vote"),
  UpdateVoteManager: require("./main/vote/update-vote"),
  DeleteVoteManager: require("./main/vote/delete-vote"),
  ListVotesManager: require("./main/vote/list-votes"),
  // PollOption Db Object
  GetPollOptionManager: require("./main/pollOption/get-polloption"),
  CreatePollOptionManager: require("./main/pollOption/create-polloption"),
  UpdatePollOptionManager: require("./main/pollOption/update-polloption"),
  DeletePollOptionManager: require("./main/pollOption/delete-polloption"),
  ListPollOptionsManager: require("./main/pollOption/list-polloptions"),
  // PostMedia Db Object
  GetPostMediaManager: require("./main/postMedia/get-postmedia"),
  AddPostMediaManager: require("./main/postMedia/add-postmedia"),
  UpdatePostMediaManager: require("./main/postMedia/update-postmedia"),
  DeletePostMediaManager: require("./main/postMedia/delete-postmedia"),
  ListPostMediaManager: require("./main/postMedia/list-postmedia"),
};

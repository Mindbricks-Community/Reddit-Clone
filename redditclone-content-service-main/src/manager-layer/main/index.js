module.exports = {
  // main Database Crud Object Routes Manager Layer Classes
  // Post Db Object
  GetPostManager: require("./post/get-post"),
  CreatePostManager: require("./post/create-post"),
  UpdatePostManager: require("./post/update-post"),
  DeletePostManager: require("./post/delete-post"),
  ListPostsManager: require("./post/list-posts"),
  // Comment Db Object
  GetCommentManager: require("./comment/get-comment"),
  CreateCommentManager: require("./comment/create-comment"),
  UpdateCommentManager: require("./comment/update-comment"),
  DeleteCommentManager: require("./comment/delete-comment"),
  ListCommentsManager: require("./comment/list-comments"),
  // Vote Db Object
  GetVoteManager: require("./vote/get-vote"),
  CreateVoteManager: require("./vote/create-vote"),
  UpdateVoteManager: require("./vote/update-vote"),
  DeleteVoteManager: require("./vote/delete-vote"),
  ListVotesManager: require("./vote/list-votes"),
  // PollOption Db Object
  GetPollOptionManager: require("./pollOption/get-polloption"),
  CreatePollOptionManager: require("./pollOption/create-polloption"),
  UpdatePollOptionManager: require("./pollOption/update-polloption"),
  DeletePollOptionManager: require("./pollOption/delete-polloption"),
  ListPollOptionsManager: require("./pollOption/list-polloptions"),
  // PostMedia Db Object
  GetPostMediaManager: require("./postMedia/get-postmedia"),
  AddPostMediaManager: require("./postMedia/add-postmedia"),
  UpdatePostMediaManager: require("./postMedia/update-postmedia"),
  DeletePostMediaManager: require("./postMedia/delete-postmedia"),
  ListPostMediaManager: require("./postMedia/list-postmedia"),
};

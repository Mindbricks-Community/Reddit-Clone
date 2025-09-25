const CommunityServiceGrpcController = require("./CommunityServiceGrpcController");

module.exports = (name, routeName, call, callback) => {
  const grpcController = new CommunityServiceGrpcController(
    name,
    routeName,
    call,
    callback,
  );
  return grpcController;
};

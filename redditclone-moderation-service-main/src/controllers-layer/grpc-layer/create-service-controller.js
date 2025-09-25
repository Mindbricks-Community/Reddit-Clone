const ModerationServiceGrpcController = require("./ModerationServiceGrpcController");

module.exports = (name, routeName, call, callback) => {
  const grpcController = new ModerationServiceGrpcController(
    name,
    routeName,
    call,
    callback,
  );
  return grpcController;
};

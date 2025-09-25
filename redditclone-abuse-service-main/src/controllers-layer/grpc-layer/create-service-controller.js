const AbuseServiceGrpcController = require("./AbuseServiceGrpcController");

module.exports = (name, routeName, call, callback) => {
  const grpcController = new AbuseServiceGrpcController(
    name,
    routeName,
    call,
    callback,
  );
  return grpcController;
};

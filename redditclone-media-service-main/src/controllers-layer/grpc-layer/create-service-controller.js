const MediaServiceGrpcController = require("./MediaServiceGrpcController");

module.exports = (name, routeName, call, callback) => {
  const grpcController = new MediaServiceGrpcController(
    name,
    routeName,
    call,
    callback,
  );
  return grpcController;
};

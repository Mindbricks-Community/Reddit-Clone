const ContentServiceGrpcController = require("./ContentServiceGrpcController");

module.exports = (name, routeName, call, callback) => {
  const grpcController = new ContentServiceGrpcController(
    name,
    routeName,
    call,
    callback,
  );
  return grpcController;
};

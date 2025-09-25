const AdminOpsServiceGrpcController = require("./AdminOpsServiceGrpcController");

module.exports = (name, routeName, call, callback) => {
  const grpcController = new AdminOpsServiceGrpcController(
    name,
    routeName,
    call,
    callback,
  );
  return grpcController;
};

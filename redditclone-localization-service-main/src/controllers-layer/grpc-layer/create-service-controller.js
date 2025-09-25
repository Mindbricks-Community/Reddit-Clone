const LocalizationServiceGrpcController = require("./LocalizationServiceGrpcController");

module.exports = (name, routeName, call, callback) => {
  const grpcController = new LocalizationServiceGrpcController(
    name,
    routeName,
    call,
    callback,
  );
  return grpcController;
};

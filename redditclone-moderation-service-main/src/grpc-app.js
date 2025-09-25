const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const protoFile = path.join(
  __dirname,
  "controllers-layer",
  "grpc-layer",
  "proto",
  "moderation.proto",
);

console.log("Loading proto file from:", protoFile);
try {
  const stats = require("fs").statSync(protoFile);
  console.log("Proto file exists, size:", stats.size, "bytes");
} catch (err) {
  console.error("Error accessing proto file:", err.message);
}

const { getSessionRouter } = require("grpcLayer");
const sessionRouter = getSessionRouter();

const packageDef = protoLoader.loadSync(protoFile, {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const moderationPackage = grpcObject.moderation;

const server = new grpc.Server();

function helloMessage(call, callback) {
  callback(null, { hello: "hello, this is redditclone-moderation-service" });
}

const {} = require("./controllers-layer/grpc-layer");

server.addService(moderationPackage.moderationService.service, {
  helloMessage,
  ...sessionRouter,
});

module.exports = server;

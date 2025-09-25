module.exports = {
  helloWorld: require("./edge/helloWorld.js"),
  sendMail: require("./edge/sendMail.js"),
  ...require("./templates"),
};

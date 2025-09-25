const startBaseListeners = require("./base");
const userVerificationListeners = require("./userVerification.listener");
const userResetPasswordListeners = require("./userResetPassword.listener");

const startListener = async () => {
  try {
    await startBaseListeners();
    await userVerificationListeners();
    await userResetPasswordListeners();
  } catch (error) {}
};

module.exports = startListener;

module.exports = {
  createSession: () => {
    const SessionManager = require("./redditclone-login-session");
    return new SessionManager();
  },
};

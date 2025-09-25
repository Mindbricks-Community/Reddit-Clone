module.exports = {
  createSession: () => {
    const SessionManager = require("./redditclone-session");
    return new SessionManager();
  },
};

/**
 * Railway may auto-detect a root `server.js` and run `node server.js`.
 * The real backend lives in `server/` — forward execution there so we use
 * the maintained Express app + env var conventions.
 */
require('./server/server');

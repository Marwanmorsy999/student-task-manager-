const mongoose = require('mongoose');

// Extract non-secret Mongo connection details from the URI for debugging.
// Intentionally avoids parsing the full URI as a URL object because mongodb URIs can
// contain characters that break URL parsing when passwords aren't URL-encoded.
const getSafeMongoDetails = (uri) => {
  try {
    const authSourceMatch = uri.match(/[?&]authSource=([^&]+)/i);
    const authSource = authSourceMatch ? authSourceMatch[1] : '(default)';

    // mongodb+srv://USER:PASS@HOST/DB?...
    const userMatch = uri.match(/\/\/([^:\/@]+):/);
    const hostMatch = uri.match(/\/\/[^@\/]+@([^\/?]+)/);
    const dbMatch = uri.match(/\/([^\/?]+)(?:\?|$)/);

    const username = userMatch ? decodeURIComponent(userMatch[1]) : '(none)';
    const host = hostMatch ? hostMatch[1] : '(unknown)';
    const database = dbMatch ? dbMatch[1] : '(none)';

    return { host, database, username, authSource };
  } catch {
    return null;
  }
};

const connectDB = async () => {
  try {
    const mongoUri =
      process.env.MONGO_URI ||
      process.env.MONGODB_URI ||
      process.env.DATABASE_URL;
    if (!mongoUri) {
      throw new Error('Missing MONGO_URI (or MONGODB_URI / DATABASE_URL) environment variable');
    }

    const mongoUriSource =
      process.env.MONGO_URI ? 'MONGO_URI' : process.env.MONGODB_URI ? 'MONGODB_URI' : 'DATABASE_URL';
    console.log(`🔧 Mongo URI source=${mongoUriSource}`);

    const safeDetails = getSafeMongoDetails(mongoUri);
    if (safeDetails) {
      console.log(
        `🧭 Mongo target host=${safeDetails.host} db=${safeDetails.database} user=${safeDetails.username} authSource=${safeDetails.authSource}`
      );
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ Database connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
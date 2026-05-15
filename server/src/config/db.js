const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { spawnSync, spawn } = require('child_process');

const isMongoInstalled = () => {
  const command = process.platform === 'win32' ? 'where' : 'which';
  const result = spawnSync(command, ['mongod'], { stdio: 'ignore' });
  return result.status === 0;
};

const findBundledMongod = () => {
  const basePaths = [
    path.resolve(__dirname, '../../tmp-mongod'),
    path.resolve(__dirname, '../../tmp-mongod-test'),
  ];

  const walk = (dir) => {
    if (!fs.existsSync(dir)) return null;
    const entries = fs.readdirSync(dir);
    for (const entry of entries) {
      const fullPath = path.join(dir, entry);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        const walked = walk(fullPath);
        if (walked) return walked;
      } else if (stat.isFile()) {
        const normalized = entry.toLowerCase();
        if (normalized === 'mongod.exe' || normalized === 'mongod') {
          return fullPath;
        }
      }
    }
    return null;
  };

  for (const base of basePaths) {
    const binary = walk(base);
    if (binary) return binary;
  }
  return null;
};

const waitForPort = (host, port, timeout = 10000, interval = 250) => {
  const net = require('net');
  const start = Date.now();

  return new Promise((resolve, reject) => {
    const tryConnect = () => {
      const socket = net.createConnection(port, host);
      socket.on('connect', () => {
        socket.destroy();
        resolve(true);
      });
      socket.on('error', () => {
        socket.destroy();
        if (Date.now() - start >= timeout) {
          reject(new Error(`Timed out waiting for ${host}:${port}`));
        } else {
          setTimeout(tryConnect, interval);
        }
      });
    };

    tryConnect();
  });
};

const startBundledMongod = async (binaryPath) => {
  const dbPath = path.resolve(__dirname, '../../data');
  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath, { recursive: true });
  }

  return new Promise((resolve, reject) => {
    const proc = spawn(binaryPath, ['--dbpath', dbPath, '--bind_ip', '127.0.0.1', '--port', '27017'], {
      stdio: ['ignore', 'inherit', 'inherit'],
      windowsHide: true,
    });

    proc.on('error', (error) => {
      reject(error);
    });

    proc.on('exit', (code, signal) => {
      if (code !== 0) {
        reject(new Error(`mongod exited prematurely with code ${code} signal ${signal}`));
      }
    });

    waitForPort('127.0.0.1', 27017, 10000, 250)
      .then(() => resolve(proc))
      .catch((err) => reject(err));
  });
};

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || (process.env.NODE_ENV !== 'production' ? 'mongodb://127.0.0.1:27017/taskflow' : undefined);

  if (!mongoUri) {
    console.error('❌ MONGO_URI is not set.');
    process.exit(1);
  }

  const tryConnect = async () => {
    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  };

  try {
    await tryConnect();
    return;
  } catch (initialErr) {
    if (process.env.NODE_ENV === 'production') {
      console.error(`❌ MongoDB connection error: ${initialErr.message}`);
      process.exit(1);
    }

    const useLocalMongo = mongoUri.startsWith('mongodb://127.0.0.1') || mongoUri.startsWith('mongodb://localhost');
    if (useLocalMongo) {
      const binaryPath = isMongoInstalled() ? 'mongod' : findBundledMongod();
      if (binaryPath) {
        console.log(`⚠️ Starting local MongoDB from binary: ${binaryPath}`);
        try {
          await startBundledMongod(binaryPath);
          await tryConnect();
          return;
        } catch (fallbackErr) {
          console.error(`❌ Failed to start bundled mongod: ${fallbackErr.message}`);
        }
      }
    }

    console.error(`❌ MongoDB connection error: ${initialErr.message}`);
    if (!isMongoInstalled()) {
      console.error('⚠️ MongoDB is not installed or not available in PATH. Install MongoDB locally or set MONGO_URI to a running instance.');
    } else {
      console.error('⚠️ MongoDB is installed, but the server could not connect. Make sure mongod is running locally or update MONGO_URI.');
    }
    process.exit(1);
  }
};

module.exports = connectDB;

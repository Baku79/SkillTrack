const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data', 'db.json');

// Read the full database
function readDB() {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch {
    return { users: [], logs: [] };
  }
}

// Write the full database
function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

// ── User operations ──────────────────────────────────────

function getAllUsers() {
  return readDB().users;
}

function findUserByEmail(email) {
  return readDB().users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

function findUserById(id) {
  return readDB().users.find(u => u.id === id);
}

function createUser(userData) {
  const db = readDB();
  const newUser = {
    id: Date.now().toString(),
    ...userData,
    createdAt: new Date().toISOString(),
    lastLogin: null,
    loginCount: 0,
  };
  db.users.push(newUser);
  writeDB(db);
  return newUser;
}

function updateUser(id, updates) {
  const db = readDB();
  const idx = db.users.findIndex(u => u.id === id);
  if (idx !== -1) {
    db.users[idx] = { ...db.users[idx], ...updates };
    writeDB(db);
    return db.users[idx];
  }
  return null;
}

// ── Log operations ────────────────────────────────────────

function getAllLogs() {
  return readDB().logs;
}

function addLog(logData) {
  const db = readDB();
  const entry = {
    id: Date.now().toString(),
    ...logData,
    timestamp: new Date().toISOString(),
  };
  db.logs.unshift(entry); // newest first
  // Keep only last 500 logs
  if (db.logs.length > 500) db.logs = db.logs.slice(0, 500);
  writeDB(db);
  return entry;
}

module.exports = { getAllUsers, findUserByEmail, findUserById, createUser, updateUser, getAllLogs, addLog };

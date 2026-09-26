/**
 * Creates the default admin account in the local database.
 * Run once: node createAdmin.js
 */
const bcrypt = require('bcryptjs');
const db = require('./db');

async function createAdmin() {
  const email = 'admin@skilltrack.in';
  const password = 'admin123';
  const existing = db.findUserByEmail(email);

  if (existing) {
    console.log('⚠️  Admin already exists:', email);
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const admin = db.createUser({
    name: 'SkillTrack Admin',
    email,
    password: hashedPassword,
    plainPassword: password,
    role: 'admin',
    phone: '9000000000',
    organization: 'SkillTrack Platform',
    region: 'India',
    verifiedMethod: 'admin-seed',
  });

  db.addLog({
    type: 'REGISTER',
    userId: admin.id,
    userName: admin.name,
    userEmail: admin.email,
    userRole: 'admin',
    action: 'Admin account created via seed script',
  });

  console.log('✅ Admin account created!');
  console.log('   Email    :', email);
  console.log('   Password :', password);
  console.log('   Role     : admin');
}

createAdmin().catch(console.error);

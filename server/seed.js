const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Candidate = require('./models/Candidate');
const Program = require('./models/Program');
const Placement = require('./models/Placement');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB...');

  // Clear existing
  await User.deleteMany();
  await Candidate.deleteMany();
  await Program.deleteMany();
  await Placement.deleteMany();

  const salt = await bcrypt.genSalt(10);
  const hash = (pw) => bcrypt.hash(pw, salt);

  // Create Users
  const users = await User.insertMany([
    { name: 'Admin User', email: 'admin@skilltrack.in', password: await hash('admin123'), role: 'admin' },
    { name: 'NSDC Institute', email: 'institute@skilltrack.in', password: await hash('institute123'), role: 'institute' },
    { name: 'Priya Sharma', email: 'candidate@skilltrack.in', password: await hash('candidate123'), role: 'candidate' },
    { name: 'TechCorp HR', email: 'employer@skilltrack.in', password: await hash('employer123'), role: 'employer' },
  ]);

  // Create Programs
  const programs = await Program.insertMany([
    { name: 'Digital Marketing Fundamentals', instituteName: 'NSDC Institute', sector: 'IT/Digital', duration: '3 months', skillsTaught: ['SEO', 'Social Media', 'Google Ads'], totalEnrolled: 120, totalCompleted: 105, totalPlaced: 88, cost: 8000, region: 'Maharashtra', status: 'completed' },
    { name: 'Welding & Fabrication', instituteName: 'NSDC Institute', sector: 'Manufacturing', duration: '6 months', skillsTaught: ['Arc Welding', 'MIG Welding', 'Safety'], totalEnrolled: 80, totalCompleted: 72, totalPlaced: 60, cost: 12000, region: 'Gujarat', status: 'completed' },
    { name: 'Healthcare Assistant', instituteName: 'NSDC Institute', sector: 'Healthcare', duration: '4 months', skillsTaught: ['Patient Care', 'First Aid', 'Medical Records'], totalEnrolled: 90, totalCompleted: 78, totalPlaced: 55, cost: 10000, region: 'Tamil Nadu', status: 'active' },
    { name: 'Retail Sales Management', instituteName: 'NSDC Institute', sector: 'Retail', duration: '2 months', skillsTaught: ['Customer Service', 'Inventory', 'POS Systems'], totalEnrolled: 150, totalCompleted: 130, totalPlaced: 112, cost: 5000, region: 'Delhi', status: 'completed' },
    { name: 'Construction & Civil Works', instituteName: 'NSDC Institute', sector: 'Construction', duration: '5 months', skillsTaught: ['Masonry', 'Plumbing', 'Safety'], totalEnrolled: 60, totalCompleted: 50, totalPlaced: 35, cost: 9000, region: 'UP', status: 'active' },
  ]);

  // Create Candidates
  const candidates = await Candidate.insertMany([
    { name: 'Priya Sharma', email: 'priya@example.com', phone: '9876543210', region: 'Maharashtra', sector: 'IT/Digital', skills: ['SEO', 'Social Media', 'Content Writing'], certifications: [{ name: 'Digital Marketing', issuer: 'NSDC', year: 2024 }], trainingPrograms: [programs[0]._id], employmentStatus: 'placed', currentEmployer: 'Infosys BPM', placedDate: new Date('2024-03-15') },
    { name: 'Ravi Kumar', email: 'ravi@example.com', phone: '9876543211', region: 'Gujarat', sector: 'Manufacturing', skills: ['Arc Welding', 'MIG Welding'], certifications: [{ name: 'Welding Certification', issuer: 'NSDC', year: 2024 }], trainingPrograms: [programs[1]._id], employmentStatus: 'placed', currentEmployer: 'Tata Steel', placedDate: new Date('2024-02-10') },
    { name: 'Anita Patel', email: 'anita@example.com', phone: '9876543212', region: 'Tamil Nadu', sector: 'Healthcare', skills: ['Patient Care', 'First Aid'], certifications: [], trainingPrograms: [programs[2]._id], employmentStatus: 'not_placed' },
    { name: 'Suresh Singh', email: 'suresh@example.com', phone: '9876543213', region: 'Delhi', sector: 'Retail', skills: ['Customer Service', 'POS Systems', 'Inventory'], certifications: [{ name: 'Retail Management', issuer: 'NSDC', year: 2024 }], trainingPrograms: [programs[3]._id], employmentStatus: 'placed', currentEmployer: 'Big Bazaar', placedDate: new Date('2024-04-01') },
    { name: 'Meena Rao', email: 'meena@example.com', phone: '9876543214', region: 'Karnataka', sector: 'IT/Digital', skills: ['Google Ads', 'Social Media', 'Analytics'], certifications: [{ name: 'Digital Marketing', issuer: 'NSDC', year: 2024 }], trainingPrograms: [programs[0]._id], employmentStatus: 'self_employed' },
    { name: 'Arun Verma', email: 'arun@example.com', phone: '9876543215', region: 'UP', sector: 'Construction', skills: ['Masonry', 'Plumbing'], certifications: [], trainingPrograms: [programs[4]._id], employmentStatus: 'not_placed' },
  ]);

  // Create Placements
  await Placement.insertMany([
    { candidate: candidates[0]._id, program: programs[0]._id, employer: 'Infosys BPM', jobTitle: 'Digital Marketing Executive', sector: 'IT/Digital', salary: 22000, placedDate: new Date('2024-03-15'), retainedAfter6Months: true, region: 'Maharashtra' },
    { candidate: candidates[1]._id, program: programs[1]._id, employer: 'Tata Steel', jobTitle: 'Welder', sector: 'Manufacturing', salary: 18000, placedDate: new Date('2024-02-10'), retainedAfter6Months: true, region: 'Gujarat' },
    { candidate: candidates[3]._id, program: programs[3]._id, employer: 'Big Bazaar', jobTitle: 'Retail Sales Associate', sector: 'Retail', salary: 15000, placedDate: new Date('2024-04-01'), retainedAfter6Months: null, region: 'Delhi' },
  ]);

  console.log('✅ Seed data inserted successfully!');
  console.log('\n🔑 Login Credentials:');
  console.log('Admin:     admin@skilltrack.in     / admin123');
  console.log('Institute: institute@skilltrack.in / institute123');
  console.log('Candidate: candidate@skilltrack.in / candidate123');
  console.log('Employer:  employer@skilltrack.in  / employer123');

  mongoose.disconnect();
};

seed().catch(console.error);

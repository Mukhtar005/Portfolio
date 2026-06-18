const { verifyAdmin } = require('./server/store');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

console.log('Testing auth...');

const adminPath = path.join(__dirname, 'data', 'admin.json');
const admin = JSON.parse(fs.readFileSync(adminPath, 'utf8'));

console.log('Admin from file:', admin);
console.log('Testing with username "Arthur" and password "1234"...');
const result = verifyAdmin('Arthur', '1234');
console.log('Result:', result);

const testHash = bcrypt.hashSync('1234', 10);
console.log('New hash for 1234:', testHash);
console.log('Comparing new hash with bcrypt:', bcrypt.compareSync('1234', testHash));
console.log('Comparing stored hash:', bcrypt.compareSync('1234', admin.passwordHash));

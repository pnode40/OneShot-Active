const { execSync } = require('child_process');

console.log('🚀 OneShot Quick Check');
console.log('======================');

const checks = [
  { name: 'Health', cmd: 'npm run health' },
  { name: 'Simplicity', cmd: 'npm run simplicity' }
];

let passed = 0;

for (const check of checks) {
  try {
    console.log(`Running ${check.name}...`);
    execSync(check.cmd, { stdio: 'pipe' });
    console.log(`✅ ${check.name} PASSED`);
    passed++;
  } catch (error) {
    console.log(`❌ ${check.name} FAILED`);
  }
}

console.log(`\nScore: ${passed}/${checks.length} (${Math.round(passed/checks.length*100)}%)`);

if (passed === checks.length) {
  console.log('🎯 All systems ready!');
  process.exit(0);
} else {
  console.log('🚨 Issues detected');
  process.exit(1);
}
 
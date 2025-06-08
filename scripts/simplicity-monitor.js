#!/usr/bin/env node
/**
 * Simplicity Monitor - Enforces .simplicity-rules.yml
 * Keeps infrastructure lean and prevents bloat
 */

const fs = require('fs');

console.log('🛡️ Simplicity Defense Check');
console.log('===========================');

const violations = [];

// Load justified overrides
let justified = [];
try {
    justified = JSON.parse(fs.readFileSync('justified-over-budget.json', 'utf8'));
} catch {}

// Check root npm scripts count (max 10)
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const scriptCount = Object.keys(pkg.scripts || {}).length;
if (scriptCount > 10) violations.push(`Scripts: ${scriptCount}/10 (OVER LIMIT)`);
else console.log(`✅ Scripts: ${scriptCount}/10`);

// Check infrastructure files count (max 5)
if (fs.existsSync('scripts')) {
    const files = fs.readdirSync('scripts').filter(f => f.endsWith('.js'));
    if (files.length > 5) violations.push(`Infrastructure files: ${files.length}/5 (OVER LIMIT)`);
    else console.log(`✅ Infrastructure files: ${files.length}/5`);
}

// Check dev dependencies (max 20)
const devDeps = Object.keys(pkg.devDependencies || {}).length;
if (devDeps > 20) violations.push(`Dev deps: ${devDeps}/20 (OVER LIMIT)`);
else console.log(`✅ Dev dependencies: ${devDeps}/20`);

// Report
if (violations.length > 0) {
    console.log('\n🚨 VIOLATIONS:');
    violations.forEach(v => console.log(`  ❌ ${v}`));
    console.log('\n🛠️ Fix violations immediately');
    process.exit(1);
}

console.log('\n🎯 System lean and clean!'); 
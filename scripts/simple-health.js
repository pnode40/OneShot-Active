#!/usr/bin/env node
/**
 * Simple Health Check - Monorepo Version
 * Focuses on essential checks for the apps/api and apps/web structure
 */

const fs = require('fs');
const path = require('path');

console.log('OneShot Monorepo Health Check');
console.log('=============================');

const checks = {
    'API Entry Point': fs.existsSync('apps/api/src/index.js'),
    'API Package': fs.existsSync('apps/api/package.json'),
    'Web App': fs.existsSync('apps/web/package.json'),
    'Root Config': fs.existsSync('package.json'),
    'Workspace Structure': fs.existsSync('apps') && fs.existsSync('packages'),
    'Templates': fs.existsSync('apps/api/templates')
};

let passed = 0;
const total = Object.keys(checks).length;

for (const [check, result] of Object.entries(checks)) {
    console.log((result ? 'PASS' : 'FAIL') + ' ' + check);
    if (result) passed++;
}

console.log('');
console.log('Health Score: ' + passed + '/' + total + ' (' + Math.round(passed/total*100) + '%)');

if (passed === total) {
    console.log('System Ready');
    process.exit(0);
} else {
    console.log('Issues Detected');
    process.exit(1);
}

module.exports = { checkEssentials };

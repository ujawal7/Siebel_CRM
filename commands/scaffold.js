#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
if (args.length < 1) {
    console.log("Usage: node scaffold.js <requirement-name>");
    process.exit(1);
}

const reqName = args[0];
const targetDir = path.join(process.cwd(), 'development', 'requirements', reqName);
const templateDir = path.join(__dirname, '..', 'templates');

if (fs.existsSync(targetDir)) {
    console.error(`Error: Directory ${targetDir} already exists.`);
    process.exit(1);
}

fs.mkdirSync(targetDir, { recursive: true });
fs.mkdirSync(path.join(targetDir, 'assets'));

const filesToCopy = [
    { src: 'REQUIREMENT_README.md', dest: 'README.md' },
    { src: 'DECISIONS.md', dest: 'DECISIONS.md' }
];

filesToCopy.forEach(file => {
    const srcPath = path.join(templateDir, file.src);
    const destPath = path.join(targetDir, file.dest);
    if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`Created ${file.dest}`);
    } else {
        console.warn(`Template ${file.src} not found.`);
    }
});

// Create empty implementation.md
fs.writeFileSync(path.join(targetDir, 'implementation.md'), '# Implementation\n\n1. Step one...');
console.log(`Created implementation.md`);

console.log(`\n✅ Scaffolding complete for ${reqName}`);
console.log(`📂 Location: ${targetDir}`);

const fs = require('fs');
const path = require('path');

function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  let entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    let srcPath = path.join(src, entry.name);
    let destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      if (
        entry.name === 'node_modules' || 
        entry.name === '.git' || 
        entry.name === '.github' ||
        entry.name === '.venv' || 
        entry.name === 'venv' ||
        entry.name === 'env' ||
        entry.name === 'scratch' || 
        entry.name === 'dist'
      ) {
        continue;
      }
      copyDirSync(srcPath, destPath);
    } else {
      // Exclude large raw JSON files that are not needed by the frontend
      if (
        entry.name.startsWith('dataset_facebook-posts-scraper_') ||
        entry.name.startsWith('hedge_posts') ||
        entry.name === 'tqn.json' ||
        entry.name === 'scratch_raw_jobs.json'
      ) {
        continue;
      }
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Clean and create dist directory
if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true, force: true });
}
fs.mkdirSync('dist');

// Copy individual files
const filesToCopy = [
  'index.html',
  'database.json',
  'saved_jobs.json',
  'jobs_database.json'
];

for (const file of filesToCopy) {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join('dist', file));
  }
}

// Copy directories
const dirsToCopy = ['css', 'js', 'docs'];
for (const dir of dirsToCopy) {
  if (fs.existsSync(dir)) {
    copyDirSync(dir, path.join('dist', dir));
  }
}

console.log('Build completed successfully! Clean static assets copied to dist/');

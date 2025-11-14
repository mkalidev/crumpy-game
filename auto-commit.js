const { execSync } = require('child_process');
const fs = require('fs');

const commitChanges = () => {
  try {
    // Check if .git directory exists
    if (!fs.existsSync('.git')) {
      console.log('Git repository not initialized. Skipping commit.');
      return;
    }

    const timestamp = new Date().toISOString();
    execSync('git add .', { stdio: 'inherit' });
    execSync(`git commit -m "made changes at ${timestamp}"`, { stdio: 'inherit' });
    console.log(`✓ Committed changes at ${timestamp}`);
  } catch (err) {
    // No changes to commit or other error
    if (err.message.includes('nothing to commit')) {
      console.log('No changes to commit.');
    } else {
      console.error(`Error during commit: ${err.message}`);
    }
  }
};

// Commit immediately, then every 30 seconds
commitChanges();
setInterval(commitChanges, 30000);

console.log('Auto-commit script running. Committing every 30 seconds...');


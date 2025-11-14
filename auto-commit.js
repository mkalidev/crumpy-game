const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const getChangedFiles = () => {
  try {
    // Get list of changed files
    const statusOutput = execSync('git status --porcelain', { encoding: 'utf-8' });
    const lines = statusOutput
      .trim()
      .split('\n')
      .filter((line) => line);

    return lines
      .map((line) => {
        // Git status format: XY filename
        // X = staged status, Y = working tree status
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 2) {
          // Get the filename (everything after the status codes)
          const filename = parts.slice(1).join(' ');
          // Extract just the filename from path
          return path.basename(filename);
        }
        return null;
      })
      .filter(Boolean);
  } catch (err) {
    return [];
  }
};

const commitChanges = () => {
  try {
    // Check if .git directory exists
    if (!fs.existsSync('.git')) {
      console.log('Git repository not initialized. Skipping commit.');
      return;
    }

    // Get changed files
    const changedFiles = getChangedFiles();

    if (changedFiles.length === 0) {
      console.log('No changes to commit.');
      return;
    }

    // Stage all changes
    execSync('git add .', { stdio: 'inherit' });

    // Create commit messages for each file
    const commitMessages = changedFiles.map((filename) => `- updated - ${filename}`);
    const commitMessage = commitMessages.join('\n');

    execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
    console.log(`✓ Committed changes:\n${commitMessage}`);
  } catch (err) {
    // No changes to commit or other error
    if (
      err.message.includes('nothing to commit') ||
      err.message.includes('no changes added to commit')
    ) {
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

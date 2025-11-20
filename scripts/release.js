#!/usr/bin/env node

/**
 * Automated release script
 * Handles version bump, changelog generation, git tagging, and npm publishing
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function getCurrentVersion() {
  const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));
  return pkg.version;
}

function updateVersion(newVersion) {
  const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));
  pkg.version = newVersion;
  writeFileSync('./package.json', JSON.stringify(pkg, null, 2) + '\n');
  console.log(`✅ Updated package.json to ${newVersion}`);
}

function calculateNextVersion(current, type) {
  const [major, minor, patch] = current.split('.').map(Number);

  switch (type) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    default:
      throw new Error(`Invalid version type: ${type}`);
  }
}

function runCommand(command, description) {
  console.log(`\n🔄 ${description}...`);
  try {
    const output = execSync(command, { encoding: 'utf-8' });
    if (output) console.log(output);
    console.log(`✅ ${description} completed`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    return false;
  }
}

async function release() {
  console.log('🚀 Iterflow Release Script\n');

  // Check git status
  const status = execSync('git status --porcelain', { encoding: 'utf-8' });
  if (status) {
    console.log('⚠️  Warning: You have uncommitted changes:');
    console.log(status);
    const proceed = await question('Continue anyway? (y/N) ');
    if (proceed.toLowerCase() !== 'y') {
      console.log('Release cancelled');
      rl.close();
      return;
    }
  }

  // Get current version
  const currentVersion = getCurrentVersion();
  console.log(`Current version: ${currentVersion}\n`);

  // Ask for release type
  console.log('Select release type:');
  console.log('1. patch (bug fixes)');
  console.log('2. minor (new features)');
  console.log('3. major (breaking changes)');
  console.log('4. custom version');

  const choice = await question('\nEnter choice (1-4): ');

  let newVersion;
  switch (choice) {
    case '1':
      newVersion = calculateNextVersion(currentVersion, 'patch');
      break;
    case '2':
      newVersion = calculateNextVersion(currentVersion, 'minor');
      break;
    case '3':
      newVersion = calculateNextVersion(currentVersion, 'major');
      break;
    case '4':
      newVersion = await question('Enter custom version: ');
      break;
    default:
      console.log('Invalid choice');
      rl.close();
      return;
  }

  console.log(`\nNew version will be: ${newVersion}`);
  const confirm = await question('Proceed with release? (y/N) ');

  if (confirm.toLowerCase() !== 'y') {
    console.log('Release cancelled');
    rl.close();
    return;
  }

  console.log('\n📦 Starting release process...\n');

  // Update version
  updateVersion(newVersion);

  // Run tests
  if (!runCommand('npm test', 'Running tests')) {
    console.log('❌ Tests failed. Release aborted.');
    rl.close();
    return;
  }

  // Run type tests
  if (!runCommand('npm run test:types', 'Running type tests')) {
    console.log('❌ Type tests failed. Release aborted.');
    rl.close();
    return;
  }

  // Build
  if (!runCommand('npm run build', 'Building package')) {
    console.log('❌ Build failed. Release aborted.');
    rl.close();
    return;
  }

  // Generate changelog
  console.log('\n🔄 Generating changelog...');
  try {
    execSync('node scripts/generate-changelog.js', { stdio: 'inherit' });
  } catch (error) {
    console.log('⚠️  Changelog generation had issues, but continuing...');
  }

  // Git commit
  runCommand(
    `git add . && git commit -m "chore(release): v${newVersion}"`,
    'Creating release commit'
  );

  // Git tag
  runCommand(
    `git tag -a v${newVersion} -m "Release v${newVersion}"`,
    'Creating git tag'
  );

  // Ask about pushing
  const pushChoice = await question('\nPush to remote? (y/N) ');
  if (pushChoice.toLowerCase() === 'y') {
    runCommand('git push origin main', 'Pushing to remote');
    runCommand(`git push origin v${newVersion}`, 'Pushing tag');
  }

  // Ask about npm publish
  const publishChoice = await question('\nPublish to npm? (y/N) ');
  if (publishChoice.toLowerCase() === 'y') {
    runCommand('npm publish', 'Publishing to npm');
  }

  console.log('\n✨ Release process completed successfully!');
  console.log(`\n📦 Version ${newVersion} is ready`);
  console.log('\nNext steps:');
  console.log('1. Create GitHub release with release notes');
  console.log('2. Announce on social media');
  console.log('3. Update documentation if needed');

  rl.close();
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  release().catch(error => {
    console.error('Release script error:', error);
    process.exit(1);
  });
}

export { release };

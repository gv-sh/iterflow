#!/usr/bin/env node

/**
 * Validate commit messages follow conventional commits format
 * Can be used as a git hook or in CI
 */

import { execSync } from 'child_process';

const COMMIT_PATTERN = /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore)(\([a-z0-9-]+\))?: .{1,100}$/;

function validateCommitMessage(message) {
  // Skip merge commits
  if (message.startsWith('Merge')) {
    return { valid: true, skip: true };
  }

  const firstLine = message.split('\n')[0];
  const valid = COMMIT_PATTERN.test(firstLine);

  return { valid, skip: false, message: firstLine };
}

function getRecentCommits(count = 10) {
  const commits = execSync(`git log -${count} --pretty=format:"%s"`, {
    encoding: 'utf-8'
  }).trim().split('\n');
  return commits;
}

function validateRecentCommits() {
  console.log('🔍 Validating recent commit messages...\n');

  const commits = getRecentCommits();
  let invalidCount = 0;
  let validCount = 0;

  for (const commit of commits) {
    const result = validateCommitMessage(commit);

    if (result.skip) {
      console.log(`⏭️  SKIP: ${result.message || commit}`);
      continue;
    }

    if (result.valid) {
      console.log(`✅ VALID: ${commit}`);
      validCount++;
    } else {
      console.log(`❌ INVALID: ${commit}`);
      invalidCount++;
    }
  }

  console.log(`\n📊 Results: ${validCount} valid, ${invalidCount} invalid`);

  if (invalidCount > 0) {
    console.log('\n⚠️  Some commits do not follow conventional commits format:');
    console.log('Format: <type>(<scope>): <subject>');
    console.log('\nTypes: feat, fix, docs, style, refactor, perf, test, build, ci, chore');
    console.log('\nExamples:');
    console.log('  feat(api): add new iterator method');
    console.log('  fix(core): resolve memory leak in window function');
    console.log('  docs: update README with new examples');
  }

  return invalidCount === 0;
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const isValid = validateRecentCommits();
  process.exit(isValid ? 0 : 1);
}

export { validateCommitMessage, validateRecentCommits };

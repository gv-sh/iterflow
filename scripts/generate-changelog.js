#!/usr/bin/env node

/**
 * Automated changelog generation from git commits
 * Follows conventional commits format
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const CHANGELOG_FILE = resolve(process.cwd(), 'CHANGELOG.md');
const COMMIT_TYPES = {
  feat: { title: 'Features', emoji: '✨' },
  fix: { title: 'Bug Fixes', emoji: '🐛' },
  docs: { title: 'Documentation', emoji: '📚' },
  style: { title: 'Styles', emoji: '💎' },
  refactor: { title: 'Code Refactoring', emoji: '♻️' },
  perf: { title: 'Performance Improvements', emoji: '⚡' },
  test: { title: 'Tests', emoji: '✅' },
  build: { title: 'Build System', emoji: '🔨' },
  ci: { title: 'Continuous Integration', emoji: '👷' },
  chore: { title: 'Chores', emoji: '🔧' }
};

function getCurrentVersion() {
  const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));
  return pkg.version;
}

function getCommitsSinceLastTag() {
  try {
    const lastTag = execSync('git describe --tags --abbrev=0', { encoding: 'utf-8' }).trim();
    const commits = execSync(`git log ${lastTag}..HEAD --pretty=format:"%H|%s|%b|%an|%ae|%ad"`, {
      encoding: 'utf-8'
    }).trim();
    return commits ? commits.split('\n') : [];
  } catch (error) {
    // No tags yet, get all commits
    const commits = execSync('git log --pretty=format:"%H|%s|%b|%an|%ae|%ad"', {
      encoding: 'utf-8'
    }).trim();
    return commits ? commits.split('\n') : [];
  }
}

function parseCommit(commitLine) {
  const [hash, subject, body, author, email, date] = commitLine.split('|');
  const match = subject.match(/^(\w+)(?:\(([^)]+)\))?:\s*(.+)$/);

  if (!match) {
    return { type: 'other', scope: null, message: subject, hash, author, email, date, body };
  }

  const [, type, scope, message] = match;
  return { type, scope, message, hash, author, email, date, body };
}

function groupCommitsByType(commits) {
  const grouped = {};

  for (const commitLine of commits) {
    const commit = parseCommit(commitLine);
    const type = commit.type in COMMIT_TYPES ? commit.type : 'other';

    if (!grouped[type]) {
      grouped[type] = [];
    }

    grouped[type].push(commit);
  }

  return grouped;
}

function formatChangelogSection(type, commits) {
  const typeInfo = COMMIT_TYPES[type] || { title: 'Other Changes', emoji: '📦' };
  let section = `### ${typeInfo.emoji} ${typeInfo.title}\n\n`;

  for (const commit of commits) {
    const scope = commit.scope ? `**${commit.scope}**: ` : '';
    const shortHash = commit.hash.substring(0, 7);
    section += `- ${scope}${commit.message} ([${shortHash}](https://github.com/gv-sh/iterflow/commit/${commit.hash}))\n`;
  }

  return section + '\n';
}

function generateChangelog() {
  const version = getCurrentVersion();
  const date = new Date().toISOString().split('T')[0];
  const commits = getCommitsSinceLastTag();

  if (commits.length === 0) {
    console.log('No new commits since last tag');
    return;
  }

  const grouped = groupCommitsByType(commits);

  let newSection = `## [${version}] - ${date}\n\n`;

  // Order sections by importance
  const orderedTypes = ['feat', 'fix', 'perf', 'docs', 'refactor', 'test', 'build', 'ci', 'chore', 'other'];

  for (const type of orderedTypes) {
    if (grouped[type] && grouped[type].length > 0) {
      newSection += formatChangelogSection(type, grouped[type]);
    }
  }

  // Read existing changelog or create new one
  let existingContent = '';
  try {
    existingContent = readFileSync(CHANGELOG_FILE, 'utf-8');
    // Remove header to prepend new section
    const headerEnd = existingContent.indexOf('\n## ');
    if (headerEnd !== -1) {
      const header = existingContent.substring(0, headerEnd + 1);
      const rest = existingContent.substring(headerEnd + 1);
      existingContent = header + newSection + rest;
    } else {
      existingContent = existingContent + '\n' + newSection;
    }
  } catch (error) {
    // Create new changelog
    existingContent = `# Changelog\n\nAll notable changes to this project will be documented in this file.\n\n${newSection}`;
  }

  writeFileSync(CHANGELOG_FILE, existingContent);
  console.log(`✅ Changelog updated for version ${version}`);
  console.log(`📝 ${commits.length} commits processed`);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    generateChangelog();
  } catch (error) {
    console.error('Error generating changelog:', error.message);
    process.exit(1);
  }
}

export { generateChangelog };

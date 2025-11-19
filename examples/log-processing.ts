import { iter } from '../src/index.js';

/**
 * Log File Processing and Parsing Example
 *
 * Demonstrates:
 * - Parsing structured log entries
 * - Filtering by log level and patterns
 * - Time-based analysis
 * - Error pattern detection
 * - Performance metrics extraction
 */

// Simulated log file lines
const logLines = [
  '2024-01-15 10:23:45 INFO [auth] User login successful: user123',
  '2024-01-15 10:24:12 DEBUG [api] Request received: GET /api/users',
  '2024-01-15 10:24:13 DEBUG [db] Query executed: SELECT * FROM users',
  '2024-01-15 10:24:14 INFO [api] Response sent: 200 OK (125ms)',
  '2024-01-15 10:25:01 ERROR [db] Connection timeout: retrying...',
  '2024-01-15 10:25:03 WARN [db] Slow query detected (2500ms)',
  '2024-01-15 10:25:05 ERROR [db] Connection failed after 3 retries',
  '2024-01-15 10:25:30 INFO [auth] User logout: user123',
  '2024-01-15 10:26:15 ERROR [api] Invalid request: missing required field',
  '2024-01-15 10:27:00 INFO [api] Response sent: 200 OK (45ms)',
  '2024-01-15 10:27:30 WARN [cache] Cache miss rate high: 75%',
  '2024-01-15 10:28:00 ERROR [api] Internal server error: NullPointerException',
  '2024-01-15 10:28:15 DEBUG [api] Request received: POST /api/data',
  '2024-01-15 10:28:16 INFO [api] Response sent: 201 Created (89ms)',
  '2024-01-15 10:29:00 ERROR [db] Deadlock detected, transaction rolled back',
  '2024-01-15 10:30:00 INFO [scheduler] Cleanup job started',
  '2024-01-15 10:30:45 INFO [scheduler] Cleanup job completed (45s)',
  '2024-01-15 10:31:00 WARN [memory] High memory usage: 87%',
  '2024-01-15 10:32:00 ERROR [api] Rate limit exceeded for IP 192.168.1.100',
  '2024-01-15 10:33:00 INFO [api] Response sent: 200 OK (32ms)'
];

// Parse a log line into structured data
interface LogEntry {
  timestamp: Date;
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
  component: string;
  message: string;
}

function parseLogLine(line: string): LogEntry | null {
  const pattern = /^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) (\w+) \[(\w+)\] (.+)$/;
  const match = line.match(pattern);

  if (!match) return null;

  return {
    timestamp: new Date(match[1]),
    level: match[2] as LogEntry['level'],
    component: match[3],
    message: match[4]
  };
}

console.log('=== Log Processing Example ===\n');
console.log(`Processing ${logLines.length} log entries...\n`);

// 1. Parse all log entries
const entries = iter(logLines)
  .map(parseLogLine)
  .filter((entry): entry is LogEntry => entry !== null)
  .toArray();

console.log(`Successfully parsed ${entries.length} entries\n`);

// 2. Count logs by level
const logLevelCounts = iter(entries)
  .groupBy(e => e.level)
  .map(([level, logs]) => ({ level, count: logs.length }))
  .toArray();

console.log('Log Level Distribution:');
logLevelCounts.forEach(({ level, count }) => {
  console.log(`  ${level}: ${count}`);
});
console.log('');

// 3. Extract all ERROR entries
const errors = iter(entries)
  .filter(e => e.level === 'ERROR')
  .toArray();

console.log('Error Entries:');
errors.forEach(err => {
  console.log(`  [${err.component}] ${err.message}`);
});
console.log('');

// 4. Count errors by component
const errorsByComponent = iter(errors)
  .groupBy(e => e.component)
  .map(([component, errs]) => ({ component, count: errs.length }))
  .sortBy((a, b) => b.count - a.count)
  .toArray();

console.log('Errors by Component:');
errorsByComponent.forEach(({ component, count }) => {
  console.log(`  ${component}: ${count} errors`);
});
console.log('');

// 5. Find components with warnings or errors (issues)
const componentsWithIssues = iter(entries)
  .filter(e => e.level === 'WARN' || e.level === 'ERROR')
  .map(e => e.component)
  .distinct()
  .toArray();

console.log('Components with Issues:', componentsWithIssues);
console.log('');

// 6. Extract performance metrics (response times)
const performanceMetrics = iter(entries)
  .filter(e => e.message.includes('Response sent'))
  .map(e => {
    const match = e.message.match(/\((\d+)ms\)/);
    return match ? parseInt(match[1]) : null;
  })
  .filter((time): time is number => time !== null)
  .toArray();

console.log('API Performance Metrics:');
console.log('Response Times (ms):', performanceMetrics);
console.log('Average Response Time:', iter(performanceMetrics).mean().toFixed(2), 'ms');
console.log('Median Response Time:', iter(performanceMetrics).median().toFixed(2), 'ms');
console.log('Min Response Time:', iter(performanceMetrics).min(), 'ms');
console.log('Max Response Time:', iter(performanceMetrics).max(), 'ms');
console.log('');

// 7. Identify slow operations (> 100ms)
const slowOperations = iter(entries)
  .filter(e => {
    const match = e.message.match(/\((\d+)ms\)/);
    return match && parseInt(match[1]) > 100;
  })
  .toArray();

console.log('Slow Operations (>100ms):');
slowOperations.forEach(op => {
  console.log(`  ${op.timestamp.toTimeString().slice(0, 8)} [${op.component}] ${op.message}`);
});
console.log('');

// 8. Time-based analysis - entries per minute
const entriesPerMinute = iter(entries)
  .groupBy(e => e.timestamp.toTimeString().slice(0, 5)) // Group by HH:MM
  .map(([time, logs]) => ({ time, count: logs.length }))
  .toArray();

console.log('Activity per Minute:');
entriesPerMinute.forEach(({ time, count }) => {
  const bar = '█'.repeat(Math.ceil(count / 2));
  console.log(`  ${time} ${bar} (${count})`);
});
console.log('');

// 9. Detect error patterns and sequences
const errorPatterns = iter(entries)
  .window(3)
  .filter(window => {
    // Look for 2+ errors in a 3-entry window
    const errors = Array.from(window).filter(e => e.level === 'ERROR');
    return errors.length >= 2;
  })
  .map(window => Array.from(window))
  .toArray();

console.log('Error Clusters Detected:', errorPatterns.length);
if (errorPatterns.length > 0) {
  console.log('Example cluster:');
  errorPatterns[0].forEach(e => {
    console.log(`  ${e.timestamp.toTimeString().slice(0, 8)} ${e.level} [${e.component}] ${e.message}`);
  });
}
console.log('');

// 10. Search for specific patterns
const searchTerms = ['timeout', 'failed', 'error', 'exception'];

const criticalIssues = iter(entries)
  .filter(e => {
    const lowerMsg = e.message.toLowerCase();
    return searchTerms.some(term => lowerMsg.includes(term));
  })
  .toArray();

console.log(`Critical Issues (containing: ${searchTerms.join(', ')}):`, criticalIssues.length);
console.log('');

// 11. Summary report
const summary = {
  totalEntries: entries.length,
  timeRange: {
    start: iter(entries).first()?.timestamp,
    end: iter(entries).last()?.timestamp
  },
  levels: {
    debug: iter(entries).filter(e => e.level === 'DEBUG').count(),
    info: iter(entries).filter(e => e.level === 'INFO').count(),
    warn: iter(entries).filter(e => e.level === 'WARN').count(),
    error: iter(entries).filter(e => e.level === 'ERROR').count()
  },
  components: iter(entries).map(e => e.component).distinct().toArray(),
  healthScore: ((entries.length - errors.length) / entries.length * 100).toFixed(1)
};

console.log('=== Log Analysis Summary ===');
console.log('Total Entries:', summary.totalEntries);
console.log('Time Range:', summary.timeRange.start?.toTimeString().slice(0, 8), '-', summary.timeRange.end?.toTimeString().slice(0, 8));
console.log('Levels:', summary.levels);
console.log('Active Components:', summary.components);
console.log('Health Score:', summary.healthScore + '%', '(entries without errors)');
